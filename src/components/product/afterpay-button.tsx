"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isAfterpayUiEnabled } from "@/config/afterpay-public";
import {
  AfterpayMark,
  checkoutActionIconClass,
} from "@/components/product/afterpay-mark";

interface AfterpayButtonProps {
  handle: string;
  inStock?: boolean;
  className?: string;
  size?: "sm" | "md";
}

const shell =
  "inline-flex w-full items-center justify-center gap-1.5 font-manrope font-semibold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4a1] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50";

export function AfterpayButton({
  handle,
  inStock = true,
  className,
  size = "sm",
}: AfterpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");

  if (!isAfterpayUiEnabled() || !inStock) return null;

  async function startAfterpay(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    if (!showForm) {
      setShowForm(true);
      setError("");
      return;
    }

    if (!email.trim()) {
      setError("Enter your email to continue");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/afterpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Afterpay unavailable");
    } catch {
      setError("Afterpay unavailable");
    }
    setLoading(false);
  }

  const sizeClass = size === "sm" ? "h-10 px-3 text-[10px]" : "h-12 px-5 text-[11px]";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-stretch gap-1.5",
        showForm ? "w-full basis-full" : "flex-1",
      )}
    >
      {showForm ? (
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="Email for Afterpay *"
          autoComplete="email"
          aria-label="Email for Afterpay"
          className="h-10 w-full border border-border bg-white px-3 font-manrope text-[12px] text-foreground placeholder:text-muted focus:border-foreground/30 focus:outline-none"
        />
      ) : null}
      <button
        type="button"
        onClick={startAfterpay}
        disabled={loading}
        aria-label={showForm ? "Continue with Afterpay" : "Pay with Afterpay"}
        className={cn(
          shell,
          sizeClass,
          "bg-[#b2fce4] text-black hover:bg-[#9af5d6]",
          className,
        )}
      >
        {loading ? (
          <Loader2 className={cn(checkoutActionIconClass, "animate-spin")} />
        ) : (
          <AfterpayMark className={checkoutActionIconClass} />
        )}
        <span>{loading ? "Opening…" : showForm ? "Continue" : "Afterpay"}</span>
      </button>
      {error ? <span className="text-center text-[10px] text-red-600">{error}</span> : null}
    </div>
  );
}
