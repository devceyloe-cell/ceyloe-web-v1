"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/cart-context";

/** Clears cart after a successful Stripe cart checkout. */
export function ClearCartOnSuccess() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const shouldClear = searchParams.get("clear_cart") === "1";

  useEffect(() => {
    if (shouldClear) clearCart();
  }, [shouldClear, clearCart]);

  return null;
}
