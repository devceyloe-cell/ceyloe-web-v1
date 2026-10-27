import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb/client";
import type {
  DeliveryDetailsInput,
  Order,
  OrderItem,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderSource,
} from "@/types/order";

const COLLECTION = "orders";

type StoredOrder = Omit<Order, "id">;

function toOrder(doc: StoredOrder & { _id: ObjectId }): Order {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() };
}

export async function createPendingOrder(input: {
  customer: DeliveryDetailsInput;
  items: OrderItem[];
  source: OrderSource;
  paymentMethod?: OrderPaymentMethod;
  userId?: string | null;
}): Promise<Order | null> {
  const db = await getDb();
  if (!db) return null;

  const now = new Date().toISOString();
  const amountTotal = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const currency = (input.items[0]?.currency || "AUD").toUpperCase();

  const doc: StoredOrder = {
    createdAt: now,
    updatedAt: now,
    userId: input.userId ?? null,
    source: input.source,
    paymentStatus: "pending",
    paymentMethod: input.paymentMethod ?? "stripe",
    customer: {
      name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone,
    },
    shipping: {
      line1: input.customer.line1,
      line2: input.customer.line2,
      city: input.customer.city,
      state: input.customer.state,
      postcode: input.customer.postcode,
      country: input.customer.country,
    },
    items: input.items,
    amountTotal,
    currency,
  };

  const result = await db.collection<StoredOrder>(COLLECTION).insertOne(doc);
  const inserted = await db
    .collection<StoredOrder>(COLLECTION)
    .findOne({ _id: result.insertedId });
  if (!inserted) return null;
  return toOrder(inserted as StoredOrder & { _id: ObjectId });
}

export async function attachStripeSession(
  orderId: string,
  stripeSessionId: string,
): Promise<void> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(orderId)) return;
  await db.collection<StoredOrder>(COLLECTION).updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        stripeSessionId,
        updatedAt: new Date().toISOString(),
      },
    },
  );
}

export async function markOrderPaidByStripeSession(
  stripeSessionId: string,
  extras?: { amountTotal?: number; currency?: string },
): Promise<Order | null> {
  const db = await getDb();
  if (!db) return null;

  const collection = db.collection<StoredOrder>(COLLECTION);
  const existing = await collection.findOne({ stripeSessionId });
  if (!existing) return null;

  const $set: Partial<StoredOrder> = {
    paymentStatus: "paid",
    updatedAt: new Date().toISOString(),
  };
  if (typeof extras?.amountTotal === "number") {
    $set.amountTotal = extras.amountTotal / 100;
  }
  if (extras?.currency) {
    $set.currency = extras.currency.toUpperCase();
  }

  await collection.updateOne({ _id: existing._id }, { $set });
  const updated = await collection.findOne({ _id: existing._id });
  return updated ? toOrder(updated as StoredOrder & { _id: ObjectId }) : null;
}

export async function markOrderStatusByStripeSession(
  stripeSessionId: string,
  paymentStatus: Extract<OrderPaymentStatus, "expired" | "failed">,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.collection<StoredOrder>(COLLECTION).updateOne(
    { stripeSessionId, paymentStatus: "pending" },
    {
      $set: {
        paymentStatus,
        updatedAt: new Date().toISOString(),
      },
    },
  );
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return null;
  const doc = await db.collection<StoredOrder>(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toOrder(doc as StoredOrder & { _id: ObjectId }) : null;
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const docs = await db
      .collection<StoredOrder>(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((doc) => toOrder(doc as StoredOrder & { _id: ObjectId }));
  } catch (err) {
    console.error("[orders] query failed:", err instanceof Error ? err.message : err);
    return [];
  }
}
