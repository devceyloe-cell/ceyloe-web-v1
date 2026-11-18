import type { Coupon } from "@/types/coupon";

export type PricedItem = {
  price: number;
  compareAtPrice?: number | null;
};

export function isOnSale(product: PricedItem): boolean {
  const compare = product.compareAtPrice;
  return typeof compare === "number" && Number.isFinite(compare) && compare > product.price;
}

export function getSellPrice(product: PricedItem): number {
  return product.price;
}

export function getListPrice(product: PricedItem): number {
  if (isOnSale(product) && typeof product.compareAtPrice === "number") {
    return product.compareAtPrice;
  }
  return product.price;
}

/** Whole-number percent off when on sale (e.g. 25 for 25% off). */
export function getDiscountPercent(product: PricedItem): number | null {
  if (!isOnSale(product) || typeof product.compareAtPrice !== "number") return null;
  if (product.compareAtPrice <= 0) return null;
  const pct = Math.round((1 - product.price / product.compareAtPrice) * 100);
  if (!Number.isFinite(pct) || pct < 1) return null;
  return Math.min(99, pct);
}

/** Dollars saved vs list price. */
export function getDiscountAmount(product: PricedItem): number | null {
  if (!isOnSale(product) || typeof product.compareAtPrice !== "number") return null;
  const saved = roundMoney(product.compareAtPrice - product.price);
  return saved > 0 ? saved : null;
}

/** Round money to 2 decimal places (AUD). */
export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function applyCouponToSubtotal(
  subtotal: number,
  coupon: Pick<Coupon, "type" | "value">,
): number {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;
  let discount = 0;
  if (coupon.type === "percent") {
    discount = subtotal * (Math.min(100, Math.max(0, coupon.value)) / 100);
  } else {
    discount = Math.max(0, coupon.value);
  }
  return roundMoney(Math.min(subtotal, Math.max(0, discount)));
}

/**
 * Distribute a cart-level discount across line unit amounts (cents)
 * so Stripe/Afterpay totals match the discounted subtotal.
 */
export function allocateDiscountAcrossCents(
  unitAmountsCents: number[],
  discountDollars: number,
): number[] {
  const totalCents = unitAmountsCents.reduce((sum, n) => sum + n, 0);
  const discountCents = Math.min(totalCents, Math.round(discountDollars * 100));
  if (totalCents <= 0 || discountCents <= 0) {
    return unitAmountsCents.map((n) => Math.max(0, n));
  }

  const allocated = unitAmountsCents.map((cents) => {
    const share = Math.floor((cents / totalCents) * discountCents);
    return Math.max(0, cents - share);
  });

  let remaining =
    discountCents - unitAmountsCents.reduce((sum, cents, i) => sum + (cents - allocated[i]), 0);

  for (let i = 0; i < allocated.length && remaining > 0; i++) {
    if (allocated[i] <= 0) continue;
    allocated[i] -= 1;
    remaining -= 1;
  }

  return allocated;
}
