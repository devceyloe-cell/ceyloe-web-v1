"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkoutActionIconClass } from "@/components/product/afterpay-mark";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/types";

type CartProduct = Pick<Product, "id" | "handle" | "title" | "price" | "image" | "specs">;

interface BuyNowButtonProps {
  product: CartProduct;
  inStock?: boolean;
  /** Shown when not purchasable (e.g. "Sold out" or "Hold"). */
  unavailableLabel?: string;
  className?: string;
  size?: "sm" | "md";
}

const shell =
  "inline-flex w-full items-center justify-center gap-1.5 font-manrope font-semibold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50";

export function BuyNowButton({
  product,
  inStock = true,
  unavailableLabel = "Sold out",
  className,
  size = "sm",
}: BuyNowButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || loading) return;

    setLoading(true);
    // Always add (or keep if already in cart), then go to cart for delivery
    addItem(product);
    router.push("/cart");
  }

  const sizeClass = size === "sm" ? "h-10 px-3 text-[10px]" : "h-12 px-5 text-[11px]";

  if (!inStock) {
    return (
      <span className={cn(shell, sizeClass, "bg-surface-dim text-muted", className)}>
        {unavailableLabel}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleBuyNow}
      disabled={loading}
      className={cn(
        shell,
        sizeClass,
        "min-w-0 flex-1 bg-rich-gold text-black hover:bg-[#c49a4a]",
        className,
      )}
    >
      {loading ? (
        <Loader2 className={cn(checkoutActionIconClass, "animate-spin")} />
      ) : (
        <CreditCard className={checkoutActionIconClass} strokeWidth={2} />
      )}
      <span>{loading ? "Going to cart…" : "Buy Now"}</span>
    </button>
  );
}
