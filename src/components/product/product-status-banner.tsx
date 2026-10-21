import type { Product, ProductAvailability } from "@/types";
import { getProductAvailability } from "@/lib/product-availability";
import { cn } from "@/lib/utils";

const BANNER_STYLES: Record<
  Exclude<ProductAvailability, "available">,
  string
> = {
  sold_out: "bg-neutral-900/90 text-white",
  hold: "bg-[#8a6a2a]/92 text-white",
};

interface ProductStatusBannerProps {
  product: Pick<Product, "availability" | "inStock">;
  className?: string;
  /** compact: small corner badge; banner: full-width strip */
  variant?: "banner" | "badge";
}

export function ProductStatusBanner({
  product,
  className,
  variant = "banner",
}: ProductStatusBannerProps) {
  const status = getProductAvailability(product);
  if (status === "available") return null;

  const label = status === "sold_out" ? "Sold out" : "Hold";

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur",
          BANNER_STYLES[status],
          className,
        )}
      >
        {label}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-center px-3 py-2 text-center",
        BANNER_STYLES[status],
        className,
      )}
      aria-label={label}
    >
      <span className="label-caps text-[11px] tracking-[0.2em] text-white sm:text-xs">
        {label}
      </span>
    </div>
  );
}
