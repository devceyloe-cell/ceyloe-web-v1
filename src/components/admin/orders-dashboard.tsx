"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import {
  filterOrders,
  type OrderPaymentStatusFilter,
} from "@/lib/orders/filter-orders";
import { cn } from "@/lib/utils";
import type { Order, OrderPaymentStatus } from "@/types/order";

function formatMoney(amount: number, currency = "AUD") {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
}

const statusLabels: Record<OrderPaymentStatus, string> = {
  paid: "Payment completed",
  pending: "Payment pending",
  failed: "Payment failed",
  expired: "Checkout expired",
};

const statusDotClass: Record<OrderPaymentStatus, string> = {
  paid: "bg-emerald-500",
  pending: "bg-amber-500",
  failed: "bg-red-500",
  expired: "bg-slate-500",
};

const statusBadgeClass: Record<OrderPaymentStatus, string> = {
  paid: "bg-emerald-500/15 text-emerald-800 ring-emerald-500/25",
  pending: "bg-amber-500/15 text-amber-900 ring-amber-500/30",
  failed: "bg-red-500/10 text-red-700 ring-red-500/25",
  expired: "bg-slate-500/10 text-slate-700 ring-slate-500/25",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-AU", {
      timeZone: "Australia/Perth",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

interface OrdersDashboardProps {
  orders: Order[];
  mongoConfigured: boolean;
}

export function OrdersDashboard({ orders, mongoConfigured }: OrdersDashboardProps) {
  const [paymentStatus, setPaymentStatus] = useState<OrderPaymentStatusFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(
    () =>
      filterOrders(orders, {
        paymentStatus,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    [orders, paymentStatus, dateFrom, dateTo],
  );

  const filtersActive =
    paymentStatus !== "all" || Boolean(dateFrom) || Boolean(dateTo);

  const paidCount = orders.filter((o) => o.paymentStatus === "paid").length;
  const pendingCount = orders.filter((o) => o.paymentStatus === "pending").length;

  function clearFilters() {
    setPaymentStatus("all");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <>
      <AdminHeader title="Orders" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Sales</p>
          <h1 className="mt-1 font-display text-3xl font-light tracking-tight">Sales orders</h1>
          <p className="mt-1 text-sm text-muted">
            Buy Now and cart checkouts with delivery details and payment status
            {paidCount > 0 || pendingCount > 0 ? (
              <span className="ml-2 text-foreground">
                · {paidCount} paid
                {pendingCount > 0 ? ` · ${pendingCount} pending` : ""}
              </span>
            ) : null}
          </p>
        </div>

        {!mongoConfigured ? (
          <div className="mb-8 border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            Set <code className="text-foreground">MONGODB_URI</code> to store customer orders.
          </div>
        ) : null}

        {orders.length === 0 ? (
          <div className="border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
            <Package className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 text-sm text-muted">No orders yet.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
                <label
                  htmlFor="orders-date-from"
                  className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted"
                >
                  From date
                </label>
                <input
                  id="orders-date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2"
                />
              </div>
              <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
                <label
                  htmlFor="orders-date-to"
                  className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted"
                >
                  To date
                </label>
                <input
                  id="orders-date-to"
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2"
                />
              </div>
              <div className="flex min-w-[220px] flex-1 flex-col gap-1.5 sm:max-w-xs">
                <label
                  htmlFor="orders-payment-status"
                  className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted"
                >
                  Payment status
                </label>
                <select
                  id="orders-payment-status"
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value as OrderPaymentStatusFilter)
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none ring-gold/40 focus:ring-2"
                >
                  <option value="all">All statuses</option>
                  <option value="paid">{statusLabels.paid}</option>
                  <option value="pending">{statusLabels.pending}</option>
                  <option value="failed">{statusLabels.failed}</option>
                  <option value="expired">{statusLabels.expired}</option>
                </select>
              </div>
              {filtersActive ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-md border border-border px-3 py-2.5 text-sm text-muted transition hover:border-gold/40 hover:text-foreground"
                >
                  Clear filters
                </button>
              ) : null}
            </div>

            <p className="mb-4 text-xs text-muted">
              Showing {filtered.length} of {orders.length}
              {dateFrom || dateTo ? (
                <span className="ml-1">· dates in AWST</span>
              ) : null}
            </p>

            {filtered.length === 0 ? (
              <div className="border border-dashed border-border bg-surface/50 px-6 py-12 text-center">
                <p className="text-sm text-muted">No orders match your filters.</p>
                <button
                  type="button"
                  className="mt-3 text-sm text-gold hover:underline"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </div>
            ) : (
          <ul className="space-y-3">
            {filtered.map((order) => (
              <li
                key={order.id}
                className="border border-border bg-surface p-5 transition hover:border-gold/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-medium text-foreground">{order.customer.name}</h2>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset",
                          statusBadgeClass[order.paymentStatus],
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            statusDotClass[order.paymentStatus],
                          )}
                          aria-hidden
                        />
                        {statusLabels[order.paymentStatus]}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted">
                        {order.source === "cart" ? "Cart" : "Buy Now"}
                        {!order.userId ? " · Guest" : " · Account"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted">{formatDate(order.createdAt)} AWST</p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                      <a
                        href={`mailto:${order.customer.email}`}
                        className="inline-flex items-center gap-1.5 hover:text-gold"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {order.customer.email}
                      </a>
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-gold"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {order.customer.phone}
                      </a>
                      <span className="inline-flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5" />
                        {order.paymentMethod}
                      </span>
                      {order.userId ? (
                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          User {order.userId.slice(-6)}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex items-start gap-1.5 text-sm text-muted">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        {[
                          order.shipping.line1,
                          order.shipping.line2,
                          `${order.shipping.city} ${order.shipping.state} ${order.shipping.postcode}`,
                          order.shipping.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>

                    <ul className="mt-4 space-y-2 border-t border-border pt-4">
                      {order.items.map((item) => (
                        <li key={`${order.id}-${item.handle}`} className="flex items-center gap-3">
                          {item.image ? (
                            <span className="relative h-12 w-12 shrink-0 overflow-hidden bg-black">
                              <Image
                                src={item.image}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </span>
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-foreground">{item.title}</p>
                            <p className="text-xs text-muted">
                              Qty {item.quantity} · {item.handle}
                            </p>
                          </div>
                          <p className="shrink-0 text-sm font-medium text-gold">
                            {formatMoney(item.price * item.quantity, item.currency || order.currency)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Total</p>
                    <p className="mt-1 font-display text-2xl text-gold">
                      {formatMoney(order.amountTotal, order.currency)}
                    </p>
                    <p className="mt-1 text-[10px] text-muted">
                      Ref …{order.id.slice(-8).toUpperCase()}
                    </p>
                    {order.stripeSessionId ? (
                      <p className="mt-1 max-w-[140px] truncate text-[10px] text-muted" title={order.stripeSessionId}>
                        Stripe {order.stripeSessionId.slice(-10)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
