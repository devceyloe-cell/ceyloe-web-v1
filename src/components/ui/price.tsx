"use client";

import { useCurrency } from "@/contexts/currency-context";

interface PriceProps {
  /** Amount in USD (base catalog currency) */
  amount: number;
  className?: string;
}

export function Price({ amount, className }: PriceProps) {
  const { formatProductPrice } = useCurrency();
  return <span className={className}>{formatProductPrice(amount)}</span>;
}
