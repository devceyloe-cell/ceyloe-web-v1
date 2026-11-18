import { getDiscountPercent, isOnSale, type PricedItem } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type SaleBadgeVariant = "corner" | "pill" | "inline";

interface SaleBadgeProps {
  product: PricedItem;
  variant?: SaleBadgeVariant;
  className?: string;
}

/**
 * Marketing-facing sale callout showing percent off when a product is discounted.
 */
export function SaleBadge({ product, variant = "corner", className }: SaleBadgeProps) {
  if (!isOnSale(product)) return null;
  const pct = getDiscountPercent(product);
  if (!pct) return null;

  if (variant === "inline") {
    return (
      <span
        className={cn(
          "font-manrope inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.04em] text-[#004B69]",
          className,
        )}
      >
        <span className="inline-flex items-center rounded-sm bg-[#004B69] px-1.5 py-0.5 text-[10px] font-bold tracking-[0.12em] text-white uppercase">
          −{pct}%
        </span>
        <span>Limited offer</span>
      </span>
    );
  }

  if (variant === "pill") {
    return (
      <span
        className={cn(
          "font-manrope inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#004B69] to-[#0a6a8f] px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-white uppercase shadow-[0_6px_16px_-8px_rgba(0,75,105,0.7)]",
          className,
        )}
      >
        Save {pct}%
      </span>
    );
  }

  return (
    <span
      className={cn(
        "pointer-events-none absolute top-3 left-3 z-10 flex flex-col items-start gap-1",
        className,
      )}
    >
      <span className="relative overflow-hidden bg-[#004B69] px-2.5 py-1.5 text-white shadow-[0_8px_20px_-10px_rgba(0,75,105,0.85)]">
        <span className="font-manrope relative z-10 block text-[10px] font-semibold tracking-[0.18em] uppercase opacity-90">
          Sale
        </span>
        <span className="font-caslon relative z-10 mt-0.5 block text-[18px] leading-none tracking-tight">
          {pct}%
          <span className="ml-0.5 align-top text-[10px] font-manrope font-bold tracking-[0.12em]">
            OFF
          </span>
        </span>
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] bg-rich-gold"
        />
      </span>
    </span>
  );
}
