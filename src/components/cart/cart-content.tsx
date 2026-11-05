"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Lock, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { useCart } from "@/contexts/cart-context";
import { useUserAuth } from "@/contexts/user-auth-context";
import {
  DELIVERY_FORM_ID,
  DeliveryDetailsForm,
} from "@/components/checkout/delivery-details-form";
import type { DeliveryDetailsInput } from "@/types/order";

function PayButton({
  checkingOut,
  className,
}: {
  checkingOut: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      form={DELIVERY_FORM_ID}
      disabled={checkingOut}
      className={
        className ??
        "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-rich-gold px-5 font-manrope text-[12px] font-bold uppercase tracking-[0.12em] text-black transition hover:bg-[#c49a4a] disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {checkingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
      {checkingOut ? "Redirecting to Stripe…" : "Continue to payment"}
    </button>
  );
}

function CartBody() {
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed") === "1";
  const cancelled = searchParams.get("checkout") === "cancelled";
  const { items, removeItem, clearCart, itemCount, itemsTotal } = useCart();
  const { user } = useUserAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  async function checkoutCart(delivery: DeliveryDetailsInput) {
    if (items.length === 0 || checkingOut) return;
    setCheckingOut(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handles: items.map((item) => item.handle),
          source: "cart",
          delivery,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Unable to start checkout");
    } catch {
      setError("Unable to start checkout. Please try again.");
    }
    setCheckingOut(false);
  }

  return (
    <div className="min-h-[60vh] bg-[#f7f5f2]">
      <Container className="pb-12 pt-6 md:pb-16 md:pt-8">
        {confirmed ? (
          <p className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-800">
            Email confirmed. Your account is active.
          </p>
        ) : null}
        {cancelled ? (
          <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
            Checkout was cancelled. Your cart is unchanged.
          </p>
        ) : null}

        {itemCount === 0 ? (
          <div className="mx-auto max-w-md rounded-lg border border-[#ece9e6] bg-white px-8 py-16 text-center shadow-sm">
            <ShoppingBag className="mx-auto h-10 w-10 text-muted" />
            <h1 className="font-caslon mt-4 text-2xl">Your cart is empty</h1>
            <p className="mt-2 text-sm text-muted">
              Browse the collection and add a gemstone to get started.
            </p>
            <Link
              href="/gemstones"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-rich-gold px-8 text-[11px] font-bold uppercase tracking-[0.14em] text-black hover:bg-[#c49a4a]"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rich-gold">
                  Checkout
                </p>
                <h1 className="font-caslon mt-1 text-3xl text-foreground md:text-[2.5rem]">
                  Delivery & cart
                </h1>
                <p className="mt-1.5 text-sm text-muted">
                  {!user
                    ? "Guest checkout — no account required"
                    : "Signed in · cart saved to your account"}
                </p>
              </div>
              <Link
                href="/gemstones"
                className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
              >
                Continue shopping
              </Link>
            </header>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-start lg:gap-8">
              {/* Left — delivery */}
              <section className="rounded-lg border border-[#ece9e6] bg-white p-5 shadow-sm md:p-8">
                <div className="mb-6 flex items-center gap-3 border-b border-[#ece9e6] pb-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rich-gold text-[12px] font-bold text-black">
                    1
                  </span>
                  <div>
                    <h2 className="font-manrope text-base font-semibold text-foreground">
                      Delivery details
                    </h2>
                    <p className="text-xs text-muted">Where should we send your order?</p>
                  </div>
                </div>

                <DeliveryDetailsForm
                  submitting={checkingOut}
                  error={error}
                  onSubmit={checkoutCart}
                  footer={
                    <div className="border-t border-[#ece9e6] pt-6 lg:hidden">
                      <PayButton checkingOut={checkingOut} />
                    </div>
                  }
                />
              </section>

              {/* Right — cart summary */}
              <aside className="rounded-lg border border-[#ece9e6] bg-white shadow-sm lg:sticky lg:top-28">
                <div className="flex items-center gap-3 border-b border-[#ece9e6] px-5 py-5 md:px-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] text-[12px] font-bold text-white">
                    2
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-manrope text-base font-semibold text-foreground">
                      Your cart
                    </h2>
                    <p className="text-xs text-muted">
                      {itemCount} item{itemCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <ul className="max-h-[min(420px,50vh)] divide-y divide-[#ece9e6] overflow-y-auto">
                  {items.map((item) => (
                    <li key={item.handle} className="flex gap-3 px-5 py-4 md:px-6">
                      <Link
                        href={`/products/${item.handle}`}
                        className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f3f1ee]"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-muted" aria-hidden />
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.handle}`}
                            className="font-manrope line-clamp-2 text-sm font-medium leading-snug text-foreground hover:text-rich-gold"
                          >
                            {item.title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.handle)}
                            className="shrink-0 rounded p-1 text-muted transition hover:bg-red-50 hover:text-red-600"
                            aria-label={`Remove ${item.title}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {item.origin ? (
                          <p className="mt-0.5 truncate text-xs text-muted">{item.origin}</p>
                        ) : null}
                        <p className="mt-1.5 text-sm font-semibold text-rich-gold">
                          <Price amount={item.price} />
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 border-t border-[#ece9e6] px-5 py-5 md:px-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-medium">
                      <Price amount={itemsTotal} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="text-muted">Calculated at payment</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#ece9e6] pt-3">
                    <span className="font-manrope text-sm font-semibold uppercase tracking-[0.08em]">
                      Total
                    </span>
                    <span className="font-caslon text-xl text-rich-gold">
                      <Price amount={itemsTotal} />
                    </span>
                  </div>

                  <div className="hidden pt-2 lg:block">
                    <PayButton checkingOut={checkingOut} />
                  </div>

                  <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[11px] text-muted">
                    <Lock className="h-3 w-3" />
                    Secure checkout powered by Stripe
                  </p>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="w-full text-center text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
                  >
                    Clear cart
                  </button>
                </div>
              </aside>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export function CartContent() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#f7f5f2] py-16 text-center text-sm text-muted">
          Loading cart…
        </div>
      }
    >
      <CartBody />
    </Suspense>
  );
}
