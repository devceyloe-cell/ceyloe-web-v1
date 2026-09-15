"use client";

import { useState } from "react";
import Link from "next/link";
import { Gem, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductPurchaseActionsProps {
  product: Product;
  actionsRef?: React.RefObject<HTMLDivElement | null>;
}

export function ProductPurchaseActions({ product, actionsRef }: ProductPurchaseActionsProps) {
  const { addItem, hasItem } = useCart();
  const [cartStatus, setCartStatus] = useState<"idle" | "adding" | "success" | "duplicate" | "error">(
    "idle",
  );
  const [buyLoading, setBuyLoading] = useState(false);
  const [buyError, setBuyError] = useState("");

  const alreadyInCart = hasItem(product.handle);
  const bespokeHref = `/custom-jewelry?stone=${encodeURIComponent(product.title)}&handle=${encodeURIComponent(product.handle)}&price=${product.price}&image=${encodeURIComponent(product.image)}`;

  async function handleAddToCart() {
    if (!product.inStock || cartStatus === "adding") return;
    setCartStatus("adding");
    const result = addItem(product);
    if (result.ok) {
      setCartStatus("success");
      window.setTimeout(() => setCartStatus("idle"), 2500);
    } else if (result.reason === "auth") {
      window.location.href = `/login?next=${encodeURIComponent(`/products/${product.handle}`)}`;
    } else if (result.reason === "duplicate") {
      setCartStatus("duplicate");
      window.setTimeout(() => setCartStatus("idle"), 2500);
    } else {
      setCartStatus("error");
      window.setTimeout(() => setCartStatus("idle"), 2500);
    }
  }

  async function handleBuyNow() {
    if (!product.inStock || buyLoading) return;
    setBuyLoading(true);
    setBuyError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: product.handle }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setBuyError(data.error || "Unable to start checkout");
    } catch {
      setBuyError("Unable to start checkout. Please try again.");
    }
    setBuyLoading(false);
  }

  const btnBase =
    "inline-flex min-h-12 items-center justify-center gap-2 px-5 font-manrope text-[11px] font-bold uppercase tracking-[0.14em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div ref={actionsRef} className="mt-6 space-y-3">
      {product.inStock ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={cartStatus === "adding" || alreadyInCart}
            className={cn(
              btnBase,
              "border border-rich-gold bg-transparent text-rich-gold hover:bg-rich-gold hover:text-black",
            )}
          >
            {cartStatus === "adding" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
            {alreadyInCart || cartStatus === "duplicate"
              ? "In Cart"
              : cartStatus === "adding"
                ? "Adding..."
                : "Add to Cart"}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={buyLoading}
            className={cn(btnBase, "bg-rich-gold text-black hover:bg-[#c49a4a]")}
          >
            {buyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {buyLoading ? "Redirecting..." : "Buy Now"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled
          className={cn(btnBase, "w-full cursor-not-allowed bg-surface-dim text-muted")}
        >
          Sold Out
        </button>
      )}

      <Link
        href={bespokeHref}
        className={cn(
          btnBase,
          "w-full flex-col border border-rich-gold bg-white py-3.5 text-rich-gold hover:bg-rich-gold hover:text-black",
        )}
      >
        <span className="inline-flex items-center gap-2">
          <Gem className="h-4 w-4" />
          Create Bespoke Jewellery
        </span>
        <span className="mt-0.5 text-[9px] font-semibold tracking-[0.16em] opacity-80">
          With This Gemstone
        </span>
      </Link>

      {cartStatus === "success" && (
        <p className="font-manrope text-center text-[12px] text-emerald-700">
          Added to cart.{" "}
          <Link href="/cart" className="underline underline-offset-2 hover:text-rich-gold">
            View cart
          </Link>
        </p>
      )}
      {buyError && (
        <p className="font-manrope text-center text-[12px] text-red-600">{buyError}</p>
      )}
    </div>
  );
}
