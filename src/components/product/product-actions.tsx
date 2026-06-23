"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Gem, MessageCircle } from "lucide-react";

interface ProductActionsProps {
  handle: string;
  inStock: boolean;
  whatsappHref: string;
}

const ctaBase =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 px-6 text-center font-manrope text-sm font-semibold uppercase tracking-wider transition-colors";

export function ProductActions({ handle, inStock, whatsappHref }: ProductActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
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

      setError(data.error || "Unable to start checkout");
    } catch {
      setError("Unable to start checkout. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div className="mt-8 border-t border-border pt-8">
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-rich-gold">Acquire this piece</p>

      <div className="space-y-3">
        {inStock ? (
          <button
            type="button"
            onClick={handleBuy}
            disabled={loading}
            className={`${ctaBase} btn-stitch-gold disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <CreditCard className="h-4 w-4 shrink-0" />
            {loading ? "Redirecting to Stripe..." : "Buy now"}
          </button>
        ) : (
          <button type="button" disabled className={`${ctaBase} cursor-not-allowed bg-surface-dim text-muted`}>
            Sold out
          </button>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${ctaBase} btn-stitch-primary`}
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span className="leading-tight">Inquire on WhatsApp</span>
          </a>

          <Link href="/custom-jewelry" className={`${ctaBase} btn-stitch-outline`}>
            <Gem className="h-4 w-4 shrink-0" />
            <span className="leading-tight">Custom jewellery</span>
          </Link>
        </div>
      </div>

      {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}

      {inStock && (
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-muted">
          Secure card payment via Stripe
        </p>
      )}
    </div>
  );
}
