"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type SyncResult = {
  label: string;
  paymentStatus: string;
};

export function PaymentStatusBanner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<SyncResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    async function sync() {
      try {
        const res = await fetch(
          `/api/checkout/sync?session_id=${encodeURIComponent(sessionId!)}`,
        );
        if (!res.ok) {
          if (!cancelled) setError(true);
          return;
        }
        const data = (await res.json()) as SyncResult;
        if (!cancelled) setStatus(data);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    void sync();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!sessionId) return null;

  if (error) {
    return (
      <p className="mt-4 text-sm text-amber-800">
        We could not confirm payment status yet. If you were charged, your order is
        recorded — our team will follow up by email.
      </p>
    );
  }

  if (!status) {
    return (
      <p className="mt-4 text-sm text-muted" aria-live="polite">
        Confirming payment with Stripe…
      </p>
    );
  }

  const completed = status.paymentStatus === "paid";
  const failed =
    status.paymentStatus === "failed" || status.paymentStatus === "expired";

  return (
    <p
      className={`mt-4 inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${
        completed
          ? "bg-emerald-500/15 text-emerald-800"
          : failed
            ? "bg-red-500/15 text-red-800"
            : "bg-amber-500/15 text-amber-900"
      }`}
      aria-live="polite"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          completed ? "bg-emerald-600" : failed ? "bg-red-600" : "bg-amber-600"
        }`}
        aria-hidden
      />
      {status.label}
    </p>
  );
}
