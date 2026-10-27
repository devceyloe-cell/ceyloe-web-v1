export type OrderPaymentStatus = "pending" | "paid" | "failed" | "expired";
export type OrderPaymentMethod = "stripe" | "afterpay";
export type OrderSource = "product" | "cart" | "afterpay";

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface OrderShipping {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface OrderItem {
  handle: string;
  productId: string;
  title: string;
  price: number;
  currency: string;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId?: string | null;
  source: OrderSource;
  paymentStatus: OrderPaymentStatus;
  paymentMethod: OrderPaymentMethod;
  stripeSessionId?: string;
  afterpayOrderId?: string;
  customer: OrderCustomer;
  shipping: OrderShipping;
  items: OrderItem[];
  amountTotal: number;
  currency: string;
}

export interface DeliveryDetailsInput {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export function normalizeDeliveryDetails(
  input: Partial<DeliveryDetailsInput> | null | undefined,
): DeliveryDetailsInput | null {
  if (!input) return null;
  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  const phone = String(input.phone || "").trim();
  const line1 = String(input.line1 || "").trim();
  const line2 = String(input.line2 || "").trim() || undefined;
  const city = String(input.city || "").trim();
  const state = String(input.state || "").trim();
  const postcode = String(input.postcode || "").trim();
  const country = String(input.country || "Australia").trim() || "Australia";

  if (!name || !email || !phone || !line1 || !city || !state || !postcode) {
    return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return { name, email, phone, line1, line2, city, state, postcode, country };
}
