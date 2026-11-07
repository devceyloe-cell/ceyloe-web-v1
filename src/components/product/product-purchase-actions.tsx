"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Gem, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { AfterpayPlacement } from "@/components/product/afterpay-placement";
import {
  AfterpayMark,
  checkoutActionIconClass,
} from "@/components/product/afterpay-mark";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { isAfterpayUiEnabled } from "@/config/afterpay-public";
import {
  getProductAvailability,
  isProductPurchasable,
} from "@/lib/product-availability";

interface ProductPurchaseActionsProps {
  product: Product;
  actionsRef?: React.RefObject<HTMLDivElement | null>;
}

export function ProductPurchaseActions({ product, actionsRef }: ProductPurchaseActionsProps) {
  const router = useRouter();
  const { addItem, hasItem } = useCart();
  const [cartStatus, setCartStatus] = useState<"idle" | "adding" | "success" | "duplicate" | "error">(
    "idle",
  );
  const [buyLoading, setBuyLoading] = useState(false);
  const [afterpayLoading, setAfterpayLoading] = useState(false);
  const [buyError, setBuyError] = useState("");
  const [showAfterpayForm, setShowAfterpayForm] = useState(false);
  const [email, setEmail] = useState("");
  const [givenNames, setGivenNames] = useState("");
  const [surname, setSurname] = useState("");

  const alreadyInCart = hasItem(product.handle);
  const afterpayEnabled = isAfterpayUiEnabled();
  const purchasable = isProductPurchasable(product);
  const unavailableLabel =
    getProductAvailability(product) === "hold" ? "Hold" : "Sold Out";
  const bespokeHref = `/custom-jewelry?stone=${encodeURIComponent(product.title)}&handle=${encodeURIComponent(product.handle)}&price=${product.price}&image=${encodeURIComponent(product.image)}`;

  async function handleAddToCart() {
    if (!purchasable || cartStatus === "adding") return;
    setCartStatus("adding");
    const result = addItem(product);
    if (result.ok) {
      setCartStatus("success");
      window.setTimeout(() => setCartStatus("idle"), 2500);
    } else if (result.reason === "duplicate") {
      setCartStatus("duplicate");
      window.setTimeout(() => setCartStatus("idle"), 2500);
    } else {
      setCartStatus("error");
      window.setTimeout(() => setCartStatus("idle"), 2500);
    }
  }

  function handleBuyNow() {
    if (!purchasable || buyLoading) return;
    setBuyError("");
    setBuyLoading(true);
    addItem(product);
    router.push("/cart");
  }

  async function handleAfterpay() {
    if (!purchasable || afterpayLoading) return;
    if (!showAfterpayForm) {
      setShowAfterpayForm(true);
      setBuyError("");
      return;
    }
    if (!email.trim()) {
      setBuyError("Enter your email to continue with Afterpay");
      return;
    }

    setAfterpayLoading(true);
    setBuyError("");

    try {
      const res = await fetch("/api/afterpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: product.handle,
          email: email.trim(),
          givenNames: givenNames.trim() || undefined,
          surname: surname.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setBuyError(data.error || "Unable to start Afterpay");
    } catch {
      setBuyError("Unable to start Afterpay. Please try again.");
    }
    setAfterpayLoading(false);
  }

  const btnBase =
    "inline-flex w-full min-h-12 min-w-0 items-center justify-center gap-2 px-4 font-manrope text-[10px] font-bold uppercase tracking-[0.12em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:text-[11px] sm:tracking-[0.14em]";

  const inputClass =
    "w-full border border-border bg-surface px-3 py-2.5 font-manrope text-sm text-foreground placeholder:text-muted focus:border-foreground/30 focus:outline-none";

  return (
    <div ref={actionsRef} className="mt-6 w-full min-w-0 space-y-3">
      {purchasable ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            {buyLoading ? (
              <Loader2 className={cn(checkoutActionIconClass, "animate-spin")} />
            ) : (
              <CreditCard className={checkoutActionIconClass} strokeWidth={2} />
            )}
            {buyLoading ? "Redirecting..." : "Buy Now"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled
          className={cn(btnBase, "w-full cursor-not-allowed bg-surface-dim text-muted")}
        >
          {unavailableLabel}
        </button>
      )}

      {purchasable && afterpayEnabled ? (
        <div className="w-full min-w-0 max-w-full space-y-3 overflow-hidden border border-border bg-surface-elevated/60 p-3 sm:p-4 [contain:inline-size]">
          <AfterpayPlacement amount={product.price} />

          {showAfterpayForm ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email *"
                className={cn(inputClass, "sm:col-span-2")}
                autoComplete="email"
                aria-label="Email for Afterpay"
              />
              <input
                type="text"
                value={givenNames}
                onChange={(e) => setGivenNames(e.target.value)}
                placeholder="First name"
                className={inputClass}
                autoComplete="given-name"
                aria-label="First name"
              />
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Last name"
                className={inputClass}
                autoComplete="family-name"
                aria-label="Last name"
              />
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleAfterpay}
            disabled={afterpayLoading}
            aria-label={
              showAfterpayForm ? "Continue with Afterpay" : "Pay with Afterpay"
            }
            className={cn(
              btnBase,
              "w-full bg-[#b2fce4] text-[#000000] hover:bg-[#9af5d6]",
            )}
          >
            {afterpayLoading ? (
              <Loader2 className={cn(checkoutActionIconClass, "animate-spin")} />
            ) : (
              <AfterpayMark className={checkoutActionIconClass} />
            )}
            {afterpayLoading
              ? "Opening..."
              : showAfterpayForm
                ? "Continue with Afterpay"
                : "Pay with Afterpay"}
          </button>
        </div>
      ) : null}

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
      {buyError ? (
        <p className="font-manrope text-center text-[12px] text-red-600">{buyError}</p>
      ) : null}
    </div>
  );
}
