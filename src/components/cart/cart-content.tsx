"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { useCart } from "@/contexts/cart-context";
import { useUserAuth } from "@/contexts/user-auth-context";

function CartBody() {
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed") === "1";
  const cancelled = searchParams.get("checkout") === "cancelled";
  const { items, removeItem, clearCart, itemCount, itemsTotal } = useCart();
  const { user, loading: authLoading } = useUserAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  async function checkoutCart() {
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

  if (!authLoading && !user) {
    return (
      <Container className="py-12 md:py-16">
        <div className="text-center">
          <p className="font-poppins text-muted">
            Sign in to view your cart. Items you add are saved to your account.
          </p>
          <Link
            href="/login"
            className="font-poppins mt-6 inline-flex min-h-12 items-center justify-center bg-[#C09A4A] px-8 text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#d0ab5c]"
          >
            Login / Create account
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
      {confirmed ? (
        <p className="mb-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-800">
          Email confirmed. Your account is active.
        </p>
      ) : null}
      {cancelled ? (
        <p className="mb-6 border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
          Checkout was cancelled. Your cart is unchanged.
        </p>
      ) : null}
      {itemCount === 0 ? (
        <div className="text-center">
          <p className="font-poppins text-muted">Your cart is empty.</p>
          <Link
            href="/gemstones"
            className="font-poppins mt-6 inline-flex min-h-12 items-center justify-center bg-[#C09A4A] px-8 text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#d0ab5c]"
          >
            Explore Gemstones
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.handle}
                className="flex flex-col gap-4 border border-border bg-white p-4 sm:flex-row sm:items-center"
              >
                <Link
                  href={`/products/${item.handle}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden bg-black"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.handle}`}
                    className="font-caslon text-lg hover:text-rich-gold"
                  >
                    {item.title}
                  </Link>
                  {item.origin && (
                    <p className="font-manrope mt-1 text-sm text-muted">{item.origin}</p>
                  )}
                  <p className="font-manrope mt-1 font-semibold text-rich-gold">
                    <Price amount={item.price} />
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.handle)}
                  className="inline-flex h-11 w-11 items-center justify-center border border-border text-muted hover:text-red-600"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={clearCart}
              className="font-manrope text-sm text-muted underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear cart
            </button>
          </div>

          <aside className="h-fit border border-border bg-white p-6 lg:sticky lg:top-28">
            <p className="text-xs uppercase tracking-[0.2em] text-rich-gold">Order summary</p>
            <h2 className="font-caslon mt-2 text-2xl">Total</h2>

            <dl className="mt-6 space-y-3 border-t border-border pt-6 font-manrope text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted">
                  Items ({itemCount})
                </dt>
                <dd className="font-semibold">
                  <Price amount={itemsTotal} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-3 text-base">
                <dt className="font-semibold uppercase tracking-[0.08em]">Total</dt>
                <dd className="font-semibold text-rich-gold">
                  <Price amount={itemsTotal} />
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              You will be charged this total securely via Stripe for all items in your cart.
            </p>

            {error ? <p className="mt-4 font-manrope text-sm text-red-500">{error}</p> : null}

            <button
              type="button"
              onClick={checkoutCart}
              disabled={checkingOut || items.length === 0}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-rich-gold px-4 font-manrope text-[11px] font-bold tracking-[0.14em] text-black uppercase disabled:opacity-50"
            >
              {checkingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {checkingOut ? "Redirecting…" : "Proceed to payment"}
            </button>
          </aside>
        </div>
      )}
    </Container>
  );
}

export function CartContent() {
  return (
    <Suspense
      fallback={
        <Container className="py-12 md:py-16">
          <p className="text-center text-sm text-muted">Loading cart...</p>
        </Container>
      }
    >
      <CartBody />
    </Suspense>
  );
}
