import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { filterOrders, type OrderPaymentStatusFilter } from "@/lib/orders/filter-orders";
import { getAllOrders } from "@/lib/mongodb/orders";
import type { OrderPaymentStatus } from "@/types/order";

const PAYMENT_STATUSES: OrderPaymentStatus[] = [
  "paid",
  "pending",
  "failed",
  "expired",
];

function parsePaymentStatus(value: string | null): OrderPaymentStatusFilter {
  if (!value || value === "all") return "all";
  return PAYMENT_STATUSES.includes(value as OrderPaymentStatus)
    ? (value as OrderPaymentStatus)
    : "all";
}

function parseDateParam(value: string | null): string | undefined {
  if (!value) return undefined;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const orders = filterOrders(await getAllOrders(), {
    paymentStatus: parsePaymentStatus(searchParams.get("paymentStatus")),
    dateFrom: parseDateParam(searchParams.get("dateFrom")),
    dateTo: parseDateParam(searchParams.get("dateTo")),
  });

  return NextResponse.json({ orders });
}
