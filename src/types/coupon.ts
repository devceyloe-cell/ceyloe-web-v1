export type CouponType = "percent" | "fixed";

export interface Coupon {
  id: string;
  /** Uppercase unique code shown to customers. */
  code: string;
  type: CouponType;
  /** Percent 1–100, or fixed AUD amount. */
  value: number;
  active: boolean;
  /** Optional customer-facing label, e.g. "10% off". */
  label?: string;
  startsAt?: string;
  endsAt?: string;
  minSubtotal?: number;
  usageLimit?: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponInput {
  code: string;
  type: CouponType;
  value: number;
  active?: boolean;
  label?: string;
  startsAt?: string | null;
  endsAt?: string | null;
  minSubtotal?: number | null;
  usageLimit?: number | null;
}
