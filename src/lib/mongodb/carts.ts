import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb/client";

const COLLECTION = "carts";

export type StoredCartItem = {
  id: string;
  handle: string;
  title: string;
  price: number;
  image: string;
  origin?: string;
};

type StoredCart = {
  userId: string;
  items: StoredCartItem[];
  updatedAt: string;
};

async function getCollection() {
  const db = await getDb();
  if (!db) throw new Error("MongoDB is not configured");
  const collection = db.collection<StoredCart>(COLLECTION);
  await collection.createIndex({ userId: 1 }, { unique: true });
  return collection;
}

export async function getCartByUserId(userId: string): Promise<StoredCartItem[]> {
  const collection = await getCollection();
  const doc = await collection.findOne({ userId });
  return doc?.items ?? [];
}

export async function setCartForUser(userId: string, items: StoredCartItem[]): Promise<StoredCartItem[]> {
  const collection = await getCollection();
  const now = new Date().toISOString();
  await collection.updateOne(
    { userId },
    { $set: { userId, items, updatedAt: now } },
    { upsert: true },
  );
  return items;
}

export async function mergeCartForUser(
  userId: string,
  guestItems: StoredCartItem[],
): Promise<StoredCartItem[]> {
  const existing = await getCartByUserId(userId);
  const byHandle = new Map<string, StoredCartItem>();
  for (const item of existing) byHandle.set(item.handle, item);
  for (const item of guestItems) {
    if (!byHandle.has(item.handle)) byHandle.set(item.handle, item);
  }
  return setCartForUser(userId, Array.from(byHandle.values()));
}

export async function deleteCartForUser(userId: string): Promise<void> {
  const collection = await getCollection();
  await collection.deleteOne({ userId });
}

export function isValidUserId(userId: string) {
  return ObjectId.isValid(userId);
}
