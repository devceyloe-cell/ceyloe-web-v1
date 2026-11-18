import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb/client";
import { applyCouponToSubtotal, roundMoney } from "@/lib/pricing";
import type { Coupon, CouponInput, CouponType } from "@/types/coupon";

const COLLECTION = "coupons";

type StoredCoupon = Omit<Coupon, "id">;

function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

function toCoupon(doc: StoredCoupon & { _id: ObjectId }): Coupon {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() };
}

function parseOptionalDate(value: string | null | undefined): string | undefined {
  if (value == null || String(value).trim() === "") return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function normalizeCouponInput(input: CouponInput): {
  ok: true;
  data: Omit<StoredCoupon, "usedCount" | "createdAt" | "updatedAt">;
} | { ok: false; error: string } {
  const code = normalizeCode(input.code || "");
  if (!code || code.length < 2) {
    return { ok: false, error: "Coupon code is required (min 2 characters)." };
  }
  if (!/^[A-Z0-9_-]+$/.test(code)) {
    return { ok: false, error: "Code may only contain letters, numbers, hyphens, and underscores." };
  }

  const type: CouponType = input.type === "fixed" ? "fixed" : "percent";
  const value = Number(input.value);
  if (!Number.isFinite(value) || value <= 0) {
    return { ok: false, error: "Discount value must be greater than zero." };
  }
  if (type === "percent" && value > 100) {
    return { ok: false, error: "Percent discount cannot exceed 100." };
  }

  const minSubtotal =
    input.minSubtotal == null || input.minSubtotal === ("" as never)
      ? undefined
      : Number(input.minSubtotal);
  if (minSubtotal !== undefined && (!Number.isFinite(minSubtotal) || minSubtotal < 0)) {
    return { ok: false, error: "Minimum subtotal must be a non-negative number." };
  }

  const usageLimit =
    input.usageLimit == null || input.usageLimit === ("" as never)
      ? undefined
      : Number(input.usageLimit);
  if (usageLimit !== undefined && (!Number.isInteger(usageLimit) || usageLimit < 1)) {
    return { ok: false, error: "Usage limit must be a whole number of at least 1." };
  }

  const startsAt = parseOptionalDate(input.startsAt ?? undefined);
  const endsAt = parseOptionalDate(input.endsAt ?? undefined);
  if (startsAt && endsAt && new Date(endsAt) < new Date(startsAt)) {
    return { ok: false, error: "End date must be after start date." };
  }

  const label = String(input.label || "").trim() || undefined;

  return {
    ok: true,
    data: {
      code,
      type,
      value: type === "fixed" ? roundMoney(value) : value,
      active: input.active !== false,
      label,
      startsAt,
      endsAt,
      minSubtotal: minSubtotal !== undefined ? roundMoney(minSubtotal) : undefined,
      usageLimit,
    },
  };
}

export async function listCoupons(): Promise<Coupon[]> {
  const db = await getDb();
  if (!db) return [];
  const docs = await db
    .collection<StoredCoupon>(COLLECTION)
    .find({})
    .sort({ updatedAt: -1 })
    .toArray();
  return docs.map((doc) => toCoupon(doc as StoredCoupon & { _id: ObjectId }));
}

export async function getCouponById(id: string): Promise<Coupon | null> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return null;
  const doc = await db.collection<StoredCoupon>(COLLECTION).findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return toCoupon(doc as StoredCoupon & { _id: ObjectId });
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const db = await getDb();
  if (!db) return null;
  const normalized = normalizeCode(code);
  if (!normalized) return null;
  const doc = await db.collection<StoredCoupon>(COLLECTION).findOne({ code: normalized });
  if (!doc) return null;
  return toCoupon(doc as StoredCoupon & { _id: ObjectId });
}

export async function createCoupon(input: CouponInput): Promise<Coupon | { error: string }> {
  const db = await getDb();
  if (!db) return { error: "MongoDB is not configured" };

  const normalized = normalizeCouponInput(input);
  if (!normalized.ok) return { error: normalized.error };

  const existing = await getCouponByCode(normalized.data.code);
  if (existing) return { error: "A coupon with this code already exists." };

  const now = new Date().toISOString();
  const doc: StoredCoupon = {
    ...normalized.data,
    usedCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection<StoredCoupon>(COLLECTION).insertOne(doc);
  const inserted = await db
    .collection<StoredCoupon>(COLLECTION)
    .findOne({ _id: result.insertedId });
  if (!inserted) return { error: "Could not create coupon." };
  return toCoupon(inserted as StoredCoupon & { _id: ObjectId });
}

export async function updateCoupon(
  id: string,
  input: CouponInput,
): Promise<Coupon | { error: string }> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return { error: "Coupon not found." };

  const normalized = normalizeCouponInput(input);
  if (!normalized.ok) return { error: normalized.error };

  const other = await getCouponByCode(normalized.data.code);
  if (other && other.id !== id) {
    return { error: "A coupon with this code already exists." };
  }

  const existing = await getCouponById(id);
  if (!existing) return { error: "Coupon not found." };

  const now = new Date().toISOString();
  await db.collection<StoredCoupon>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...normalized.data,
        updatedAt: now,
      },
    },
  );

  const updated = await getCouponById(id);
  if (!updated) return { error: "Could not update coupon." };
  return updated;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return false;
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export type CouponValidationResult =
  | {
      ok: true;
      coupon: Coupon;
      subtotal: number;
      discountAmount: number;
      total: number;
    }
  | { ok: false; error: string };

export function evaluateCouponForSubtotal(
  coupon: Coupon,
  subtotal: number,
  now = new Date(),
): CouponValidationResult {
  if (!coupon.active) {
    return { ok: false, error: "This coupon is not active." };
  }
  if (coupon.startsAt && now < new Date(coupon.startsAt)) {
    return { ok: false, error: "This coupon is not valid yet." };
  }
  if (coupon.endsAt && now > new Date(coupon.endsAt)) {
    return { ok: false, error: "This coupon has expired." };
  }
  if (
    typeof coupon.usageLimit === "number" &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    return { ok: false, error: "This coupon has reached its usage limit." };
  }
  if (
    typeof coupon.minSubtotal === "number" &&
    subtotal < coupon.minSubtotal
  ) {
    return {
      ok: false,
      error: `Minimum order of $${coupon.minSubtotal.toFixed(2)} AUD required.`,
    };
  }

  const discountAmount = applyCouponToSubtotal(subtotal, coupon);
  if (discountAmount <= 0) {
    return { ok: false, error: "This coupon does not apply to your cart." };
  }

  return {
    ok: true,
    coupon,
    subtotal: roundMoney(subtotal),
    discountAmount,
    total: roundMoney(Math.max(0, subtotal - discountAmount)),
  };
}

export async function validateCouponCode(
  code: string,
  subtotal: number,
): Promise<CouponValidationResult> {
  const coupon = await getCouponByCode(code);
  if (!coupon) return { ok: false, error: "Invalid coupon code." };
  return evaluateCouponForSubtotal(coupon, subtotal);
}

export async function incrementCouponUsedCount(code: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const normalized = normalizeCode(code);
  if (!normalized) return;
  await db.collection<StoredCoupon>(COLLECTION).updateOne(
    { code: normalized },
    {
      $inc: { usedCount: 1 },
      $set: { updatedAt: new Date().toISOString() },
    },
  );
}
