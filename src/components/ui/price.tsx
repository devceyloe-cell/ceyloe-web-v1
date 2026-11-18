"use client";

import { useCurrency } from "@/contexts/currency-context";
import { getDiscountPercent } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface PriceProps {
  /** Amount in AUD (base catalog currency) */
  amount: number;
  /** Optional list/compare-at amount for strikethrough sale UI */
  compareAt?: number;
  /** Show a marketing “Save X%” chip next to the sale price */
  showPercent?: boolean;
  className?: string;
}

export function Price({ amount, compareAt, showPercent = true, className }: PriceProps) {
  const { formatProductPrice } = useCurrency();
  const onSale =
    typeof compareAt === "number" && Number.isFinite(compareAt) && compareAt > amount;
  const pct = onSale ? getDiscountPercent({ price: amount, compareAtPrice: compareAt }) : null;

  if (!onSale) {
    return <span className={className}>{formatProductPrice(amount)}</span>;
  }

  return (
    <span className={cn("inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1", className)}>
      <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-muted line-through decoration-muted/80">
          {formatProductPrice(compareAt)}
        </span>
        <span className="text-rich-gold">{formatProductPrice(amount)}</span>
      </span>
      {showPercent && pct ? (
        <span className="font-manrope inline-flex items-center rounded-sm bg-[#004B69] px-1.5 py-0.5 text-[10px] font-bold tracking-[0.1em] text-white uppercase">
          −{pct}%
        </span>
      ) : null}
    </span>
  );
}
