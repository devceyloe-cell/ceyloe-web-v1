"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Percent,
  Pencil,
  Plus,
  Search,
  Tag,
  TicketPercent,
  Trash2,
  X,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { isOnSale, roundMoney } from "@/lib/pricing";
import type { Coupon, CouponType } from "@/types/coupon";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "sales" | "coupons";

type CouponFormState = {
  code: string;
  type: CouponType;
  value: string;
  label: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
  minSubtotal: string;
  usageLimit: string;
};

const emptyCouponForm = (): CouponFormState => ({
  code: "",
  type: "percent",
  value: "",
  label: "",
  active: true,
  startsAt: "",
  endsAt: "",
  minSubtotal: "",
  usageLimit: "",
});

function toDatetimeLocal(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string): string | null {
  if (!value.trim()) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function couponToForm(coupon: Coupon): CouponFormState {
  return {
    code: coupon.code,
    type: coupon.type,
    value: String(coupon.value),
    label: coupon.label || "",
    active: coupon.active,
    startsAt: toDatetimeLocal(coupon.startsAt),
    endsAt: toDatetimeLocal(coupon.endsAt),
    minSubtotal: coupon.minSubtotal != null ? String(coupon.minSubtotal) : "",
    usageLimit: coupon.usageLimit != null ? String(coupon.usageLimit) : "",
  };
}

function couponStatus(coupon: Coupon): { label: string; className: string } {
  const now = Date.now();
  if (!coupon.active) {
    return { label: "Inactive", className: "bg-neutral-100 text-neutral-600" };
  }
  if (coupon.startsAt && now < new Date(coupon.startsAt).getTime()) {
    return { label: "Scheduled", className: "bg-sky-50 text-sky-700" };
  }
  if (coupon.endsAt && now > new Date(coupon.endsAt).getTime()) {
    return { label: "Expired", className: "bg-amber-50 text-amber-800" };
  }
  if (
    typeof coupon.usageLimit === "number" &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    return { label: "Used up", className: "bg-amber-50 text-amber-800" };
  }
  return { label: "Active", className: "bg-emerald-50 text-emerald-800" };
}

function money(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

interface DiscountsDashboardProps {
  initialCoupons: Coupon[];
  products: Product[];
  mongoConfigured: boolean;
}

export function DiscountsDashboard({
  initialCoupons,
  products: initialProducts,
  mongoConfigured,
}: DiscountsDashboardProps) {
  const [tab, setTab] = useState<Tab>("sales");
  const [coupons, setCoupons] = useState(initialCoupons);
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponFormState>(emptyCouponForm);
  const [showForm, setShowForm] = useState(false);

  const [saleProductId, setSaleProductId] = useState("");
  const [saleMode, setSaleMode] = useState<"percent" | "price">("percent");
  const [saleValue, setSaleValue] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [onSaleQuery, setOnSaleQuery] = useState("");

  const onSale = useMemo(
    () => products.filter((p) => isOnSale(p)).sort((a, b) => a.title.localeCompare(b.title)),
    [products],
  );

  const filteredOnSale = useMemo(() => {
    const q = onSaleQuery.trim().toLowerCase();
    if (!q) return onSale;
    return onSale.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q),
    );
  }, [onSale, onSaleQuery]);

  const productOptions = useMemo(() => {
    const sorted = [...products].sort((a, b) => a.title.localeCompare(b.title));
    const q = productQuery.trim().toLowerCase();
    if (!q) return sorted.slice(0, 80);
    return sorted
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.handle.toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q),
      )
      .slice(0, 80);
  }, [products, productQuery]);

  const selectedSaleProduct = products.find((p) => p.id === saleProductId);
  const salePreview = useMemo(() => {
    if (!selectedSaleProduct) return null;
    const list = isOnSale(selectedSaleProduct)
      ? (selectedSaleProduct.compareAtPrice as number)
      : selectedSaleProduct.price;
    const raw = Number(saleValue);
    if (!Number.isFinite(raw) || raw <= 0) return { list, sell: null as number | null };
    if (saleMode === "percent") {
      if (raw > 100) return { list, sell: null };
      return { list, sell: roundMoney(list * (1 - raw / 100)) };
    }
    return { list, sell: roundMoney(raw) };
  }, [selectedSaleProduct, saleMode, saleValue]);

  function flash(message: string) {
    setSuccess(message);
    setError("");
    window.setTimeout(() => setSuccess(""), 3500);
  }

  function openCreateCoupon() {
    setEditingId(null);
    setForm(emptyCouponForm());
    setShowForm(true);
    setError("");
  }

  function openEditCoupon(coupon: Coupon) {
    setEditingId(coupon.id);
    setForm(couponToForm(coupon));
    setShowForm(true);
    setError("");
  }

  async function saveCoupon() {
    setSaving(true);
    setError("");
    const payload = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      label: form.label || undefined,
      active: form.active,
      startsAt: fromDatetimeLocal(form.startsAt),
      endsAt: fromDatetimeLocal(form.endsAt),
      minSubtotal: form.minSubtotal.trim() ? Number(form.minSubtotal) : null,
      usageLimit: form.usageLimit.trim() ? Number(form.usageLimit) : null,
    };

    try {
      const res = await fetch(
        editingId ? `/api/admin/coupons/${editingId}` : "/api/admin/coupons",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save coupon");
        setSaving(false);
        return;
      }
      const saved = data.coupon as Coupon;
      setCoupons((prev) => {
        const without = prev.filter((c) => c.id !== saved.id);
        return [saved, ...without].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      });
      setShowForm(false);
      setEditingId(null);
      setForm(emptyCouponForm());
      flash(editingId ? "Coupon updated" : "Coupon created");
    } catch {
      setError("Could not save coupon");
    }
    setSaving(false);
  }

  async function removeCoupon(id: string) {
    if (!confirm("Delete this coupon? Customers will no longer be able to use it.")) return;
    setError("");
    const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not delete coupon");
      return;
    }
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    flash("Coupon deleted");
  }

  async function patchProductSale(
    product: Product,
    next: { price?: number; compareAtPrice?: number | null },
  ) {
    setSaving(true);
    setError("");
    try {
      const body: Product = {
        ...product,
        price: next.price ?? product.price,
        compareAtPrice:
          next.compareAtPrice === null
            ? undefined
            : next.compareAtPrice !== undefined
              ? next.compareAtPrice
              : product.compareAtPrice,
      };
      if (next.compareAtPrice === null) {
        delete body.compareAtPrice;
      }

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          compareAtPrice: next.compareAtPrice === null ? null : body.compareAtPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not update product");
        setSaving(false);
        return false;
      }
      const saved = data.product as Product;
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      return true;
    } catch {
      setError("Could not update product");
      setSaving(false);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function applyQuickSale() {
    const product = products.find((p) => p.id === saleProductId);
    if (!product) {
      setError("Select a product first");
      return;
    }
    const raw = Number(saleValue);
    if (!Number.isFinite(raw) || raw <= 0) {
      setError("Enter a valid sale value");
      return;
    }

    const list = isOnSale(product) ? (product.compareAtPrice as number) : product.price;
    let sell: number;
    if (saleMode === "percent") {
      if (raw > 100) {
        setError("Percent cannot exceed 100");
        return;
      }
      sell = roundMoney(list * (1 - raw / 100));
    } else {
      sell = roundMoney(raw);
      if (sell >= list) {
        setError("Sale price must be lower than the current list price");
        return;
      }
    }

    if (sell <= 0) {
      setError("Sale price must be greater than zero");
      return;
    }

    const ok = await patchProductSale(product, { price: sell, compareAtPrice: list });
    if (ok) {
      setSaleValue("");
      flash(`Sale applied to ${product.title}`);
    }
  }

  async function clearSale(product: Product) {
    const restore = product.compareAtPrice ?? product.price;
    const ok = await patchProductSale(product, {
      price: restore,
      compareAtPrice: null,
    });
    if (ok) flash(`Sale cleared for ${product.title}`);
  }

  if (!mongoConfigured) {
    return (
      <div>
        <AdminHeader title="Discounts" />
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            MongoDB is not configured. Connect the database to manage discounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader title="Discounts" />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">
              Pricing
            </p>
            <h1 className="font-display mt-1 text-2xl font-light tracking-tight sm:text-3xl">
              Discounts
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Put gemstones on sale for the catalog, or create coupon codes customers enter at
              checkout.
            </p>
          </div>
          {tab === "coupons" ? (
            <Button type="button" onClick={openCreateCoupon} className="gap-2 self-start">
              <Plus className="h-4 w-4" />
              New coupon
            </Button>
          ) : null}
        </div>

        <div
          role="tablist"
          aria-label="Discount types"
          className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface p-1.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "sales"}
            onClick={() => setTab("sales")}
            className={cn(
              "flex items-start gap-3 rounded-md px-3 py-3 text-left transition",
              tab === "sales"
                ? "bg-background shadow-sm ring-1 ring-border"
                : "hover:bg-background/60",
            )}
          >
            <span
              className={cn(
                "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                tab === "sales" ? "bg-[#004B69]/10 text-[#004B69]" : "bg-background text-muted",
              )}
            >
              <Tag className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2 font-manrope text-sm font-semibold text-foreground">
                Product sales
                <span className="rounded-full bg-background px-1.5 text-[11px] font-medium text-muted ring-1 ring-border">
                  {onSale.length}
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                Strikethrough prices on the storefront
              </span>
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "coupons"}
            onClick={() => setTab("coupons")}
            className={cn(
              "flex items-start gap-3 rounded-md px-3 py-3 text-left transition",
              tab === "coupons"
                ? "bg-background shadow-sm ring-1 ring-border"
                : "hover:bg-background/60",
            )}
          >
            <span
              className={cn(
                "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                tab === "coupons" ? "bg-gold/15 text-gold" : "bg-background text-muted",
              )}
            >
              <TicketPercent className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2 font-manrope text-sm font-semibold text-foreground">
                Coupons
                <span className="rounded-full bg-background px-1.5 text-[11px] font-medium text-muted ring-1 ring-border">
                  {coupons.length}
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                Codes like SAVE10 at cart checkout
              </span>
            </span>
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="mt-4 inline-flex w-full items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {success}
          </p>
        ) : null}

        {tab === "sales" ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
              <h2 className="font-manrope text-sm font-semibold text-foreground">Put a gem on sale</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Customers see the old price crossed out and pay the new sale price. Coupons can still
                stack on top at checkout.
              </p>

              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted">Find product</span>
                  <span className="relative block">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      placeholder="Search title, SKU, or handle…"
                      className="w-full rounded-md border border-border bg-background py-2.5 pr-3 pl-9 text-sm outline-none focus:border-foreground/30"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted">Product</span>
                  <select
                    value={saleProductId}
                    onChange={(e) => setSaleProductId(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
                  >
                    <option value="">Select a gemstone…</option>
                    {productOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                        {isOnSale(p) ? " (already on sale)" : ""} — {money(p.price)}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-muted">Discount type</span>
                    <select
                      value={saleMode}
                      onChange={(e) => setSaleMode(e.target.value as "percent" | "price")}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
                    >
                      <option value="percent">Percent off</option>
                      <option value="price">Set sale price (AUD)</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-muted">
                      {saleMode === "percent" ? "Percent" : "Sale price"}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={saleMode === "percent" ? 1 : 0.01}
                      value={saleValue}
                      onChange={(e) => setSaleValue(e.target.value)}
                      placeholder={saleMode === "percent" ? "e.g. 15" : "e.g. 1200"}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground/30"
                    />
                  </label>
                </div>

                {salePreview ? (
                  <div className="rounded-md border border-dashed border-border bg-background px-3 py-2.5 text-sm">
                    <p className="text-xs text-muted">Customer will see</p>
                    <p className="mt-1">
                      {salePreview.sell != null && salePreview.sell < salePreview.list ? (
                        <>
                          <span className="text-muted line-through">{money(salePreview.list)}</span>
                          <span className="mx-2 text-foreground font-medium">
                            {money(salePreview.sell)}
                          </span>
                          <span className="text-xs text-muted">AUD</span>
                        </>
                      ) : (
                        <span className="text-muted">Enter a value to preview the sale price</span>
                      )}
                    </p>
                  </div>
                ) : null}

                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  disabled={saving || !saleProductId || !saleValue}
                  onClick={applyQuickSale}
                >
                  {saving ? "Saving…" : "Apply sale"}
                </Button>
              </div>
            </section>

            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-manrope text-sm font-semibold text-foreground">
                  Currently on sale
                </h2>
                {onSale.length > 0 ? (
                  <label className="relative block w-full sm:w-56">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                    <input
                      value={onSaleQuery}
                      onChange={(e) => setOnSaleQuery(e.target.value)}
                      placeholder="Filter…"
                      className="w-full rounded-md border border-border bg-surface py-2 pr-3 pl-8 text-xs outline-none focus:border-foreground/30"
                    />
                  </label>
                ) : null}
              </div>

              {onSale.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-surface/50 px-6 py-12 text-center">
                  <Tag className="mx-auto h-8 w-8 text-muted" />
                  <p className="mt-3 text-sm font-medium text-foreground">No sales yet</p>
                  <p className="mt-1 text-xs text-muted">
                    Choose a product on the left and apply a percent or sale price.
                  </p>
                </div>
              ) : filteredOnSale.length === 0 ? (
                <p className="rounded-lg border border-border bg-surface px-4 py-6 text-center text-sm text-muted">
                  No on-sale products match “{onSaleQuery}”.
                </p>
              ) : (
                <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
                  {filteredOnSale.map((product) => {
                    const savePct = Math.round(
                      (1 - product.price / Number(product.compareAtPrice)) * 100,
                    );
                    return (
                      <li
                        key={product.id}
                        className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-background">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : null}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-manrope text-sm font-medium">
                              {product.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted">
                              <span className="line-through">
                                {money(Number(product.compareAtPrice))}
                              </span>{" "}
                              → <span className="text-foreground">{money(product.price)}</span>
                              {savePct > 0 ? (
                                <span className="ml-2 rounded-full bg-[#004B69]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#004B69]">
                                  −{savePct}%
                                </span>
                              ) : null}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2 pl-15 sm:pl-0">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-background"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => clearSale(product)}
                            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:bg-background hover:text-foreground"
                          >
                            <X className="h-3.5 w-3.5" />
                            Clear
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {showForm ? (
              <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-manrope text-sm font-semibold">
                      {editingId ? "Edit coupon" : "Create coupon"}
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      Shoppers enter the code on the cart page before paying with Stripe.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="text-xs text-muted hover:text-foreground"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs sm:col-span-1">
                    <span className="mb-1.5 block font-medium text-muted">Code *</span>
                    <input
                      value={form.code}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm tracking-wide uppercase outline-none focus:border-foreground/30"
                      placeholder="SAVE10"
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="mb-1.5 block font-medium text-muted">
                      Customer label (optional)
                    </span>
                    <input
                      value={form.label}
                      onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground/30"
                      placeholder="10% off your order"
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="mb-1.5 block font-medium text-muted">Discount type *</span>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, type: e.target.value as CouponType }))
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
                    >
                      <option value="percent">Percent off cart</option>
                      <option value="fixed">Fixed amount off (AUD)</option>
                    </select>
                  </label>
                  <label className="block text-xs">
                    <span className="mb-1.5 block font-medium text-muted">
                      Value * {form.type === "percent" ? "(%)" : "(AUD)"}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={form.type === "percent" ? 1 : 0.01}
                      value={form.value}
                      onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground/30"
                      placeholder={form.type === "percent" ? "10" : "50"}
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="mb-1.5 block font-medium text-muted">Starts (optional)</span>
                    <input
                      type="datetime-local"
                      value={form.startsAt}
                      onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="mb-1.5 block font-medium text-muted">Ends (optional)</span>
                    <input
                      type="datetime-local"
                      value={form.endsAt}
                      onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="mb-1.5 block font-medium text-muted">
                      Minimum cart (AUD, optional)
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.minSubtotal}
                      onChange={(e) => setForm((f) => ({ ...f, minSubtotal: e.target.value }))}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
                      placeholder="e.g. 500"
                    />
                  </label>
                  <label className="block text-xs">
                    <span className="mb-1.5 block font-medium text-muted">
                      Max redemptions (optional)
                    </span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={form.usageLimit}
                      onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
                      className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
                      placeholder="Unlimited"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    Active — customers can use this code now
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button type="button" disabled={saving} onClick={saveCoupon}>
                    {saving ? "Saving…" : editingId ? "Save changes" : "Create coupon"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </section>
            ) : null}

            {coupons.length === 0 && !showForm ? (
              <div className="rounded-lg border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
                <Percent className="mx-auto h-8 w-8 text-muted" />
                <p className="mt-3 text-sm font-medium text-foreground">No coupons yet</p>
                <p className="mx-auto mt-1 max-w-sm text-xs text-muted">
                  Create a code such as SAVE10 for 10% off, or FLAT50 for $50 off the cart total.
                </p>
                <Button type="button" onClick={openCreateCoupon} className="mt-5 gap-2">
                  <Plus className="h-4 w-4" />
                  Create first coupon
                </Button>
              </div>
            ) : coupons.length > 0 ? (
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
                {coupons.map((coupon) => {
                  const status = couponStatus(coupon);
                  return (
                    <li
                      key={coupon.id}
                      className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-manrope text-sm font-semibold tracking-wide">
                            {coupon.code}
                          </p>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                              status.className,
                            )}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          {coupon.type === "percent"
                            ? `${coupon.value}% off`
                            : `${money(coupon.value)} AUD off`}
                          {coupon.label ? ` · ${coupon.label}` : ""}
                          {` · used ${coupon.usedCount}`}
                          {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ""}
                          {coupon.minSubtotal != null
                            ? ` · min ${money(coupon.minSubtotal)}`
                            : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => openEditCoupon(coupon)}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-background"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCoupon(coupon.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
