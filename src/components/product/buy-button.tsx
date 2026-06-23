"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuyButtonProps {
  handle: string;
  inStock: boolean;
}

export function BuyButton({ handle, inStock }: BuyButtonProps) {
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

  if (!inStock) {
    return (
      <Button size="lg" className="w-full flex-1" disabled>
        Sold out
      </Button>
    );
  }

  return (
    <div className="flex-1">
      <Button
        type="button"
        variant="gold"
        size="lg"
        className="w-full"
        onClick={handleBuy}
        disabled={loading}
      >
        <CreditCard className="h-4 w-4" />
        {loading ? "Redirecting to Stripe..." : "Buy now"}
      </Button>
      {error && <p className="mt-2 text-center text-xs text-red-500">{error}</p>}
      <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-muted">
        Secure payment via Stripe
      </p>
    </div>
  );
}
