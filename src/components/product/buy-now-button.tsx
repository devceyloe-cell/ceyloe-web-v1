"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyNowButtonProps {
  handle: string;
  inStock?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function BuyNowButton({
  handle,
  inStock = true,
  className,
  size = "sm",
}: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
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

  if (!inStock) {
    return (
      <span
        className={cn(
          "inline-flex cursor-not-allowed items-center justify-center bg-surface-dim font-manrope font-bold uppercase tracking-[0.14em] text-muted",
          size === "sm" ? "min-h-9 px-4 text-[10px]" : "min-h-12 px-5 text-[11px]",
          className,
        )}
      >
        Sold out
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={loading}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 bg-rich-gold font-manrope font-bold uppercase tracking-[0.14em] text-black transition hover:bg-[#c49a4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rich-gold disabled:opacity-50",
          size === "sm" ? "min-h-9 px-4 text-[10px]" : "min-h-12 px-5 text-[11px]",
          className,
        )}
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        {loading ? "Redirecting…" : "Buy Now"}
      </button>
      {error ? <span className="text-[10px] text-red-600">{error}</span> : null}
    </div>
  );
}
