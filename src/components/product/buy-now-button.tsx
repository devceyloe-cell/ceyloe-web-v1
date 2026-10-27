"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkoutActionIconClass } from "@/components/product/afterpay-mark";
import { DeliveryDetailsModal } from "@/components/checkout/delivery-details-modal";
import type { DeliveryDetailsInput } from "@/types/order";

interface BuyNowButtonProps {
  handle: string;
  title?: string;
  inStock?: boolean;
  /** Shown when not purchasable (e.g. "Sold out" or "Hold"). */
  unavailableLabel?: string;
  className?: string;
  size?: "sm" | "md";
}

const shell =
  "inline-flex w-full items-center justify-center gap-1.5 font-manrope font-semibold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50";

export function BuyNowButton({
  handle,
  title,
  inStock = true,
  unavailableLabel = "Sold out",
  className,
  size = "sm",
}: BuyNowButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout(delivery: DeliveryDetailsInput) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, delivery, source: "product" }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Checkout unavailable");
    } catch {
      setError("Checkout unavailable");
    }
    setLoading(false);
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
    <div className="flex min-w-0 flex-1 flex-col items-stretch gap-1">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setError("");
          setOpen(true);
        }}
        disabled={loading}
        className={cn(
          shell,
          sizeClass,
          "bg-rich-gold text-black hover:bg-[#c49a4a]",
          className,
        )}
      >
        {loading ? (
          <Loader2 className={cn(checkoutActionIconClass, "animate-spin")} />
        ) : (
          <CreditCard className={checkoutActionIconClass} strokeWidth={2} />
        )}
        <span>{loading ? "Redirecting…" : "Buy Now"}</span>
      </button>
      {error && !open ? <span className="text-center text-[10px] text-red-600">{error}</span> : null}

      <DeliveryDetailsModal
        key={open ? `delivery-${handle}` : "delivery-closed"}
        open={open}
        onClose={() => !loading && setOpen(false)}
        summary={title ? `Buying: ${title}` : undefined}
        submitting={loading}
        error={error}
        onSubmit={startCheckout}
      />
    </div>
  );
}
