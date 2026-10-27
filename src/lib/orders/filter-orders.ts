import type { Order, OrderPaymentStatus } from "@/types/order";

export type OrderPaymentStatusFilter = OrderPaymentStatus | "all";

export interface OrderListFilters {
  paymentStatus?: OrderPaymentStatusFilter;
  /** Inclusive, YYYY-MM-DD (AWST calendar day). */
  dateFrom?: string;
  /** Inclusive, YYYY-MM-DD (AWST calendar day). */
  dateTo?: string;
}

const AWST = "Australia/Perth";

/** Calendar date in AWST for comparing with date inputs. */
export function orderCreatedDateKey(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-CA", { timeZone: AWST });
  } catch {
    return "";
  }
}

export function filterOrders(orders: Order[], filters: OrderListFilters): Order[] {
  const status = filters.paymentStatus ?? "all";
  const { dateFrom, dateTo } = filters;

  return orders.filter((order) => {
    if (status !== "all" && order.paymentStatus !== status) return false;

    if (dateFrom || dateTo) {
      const key = orderCreatedDateKey(order.createdAt);
      if (!key) return false;
      if (dateFrom && key < dateFrom) return false;
      if (dateTo && key > dateTo) return false;
    }

    return true;
  });
}
