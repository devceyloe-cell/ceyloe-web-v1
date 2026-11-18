"use client";

import { useCurrency } from "@/contexts/currency-context";
import {
  getDiscountAmount,
  getDiscountPercent,
  getListPrice,
  isOnSale,
} from "@/lib/pricing";
import type { Product } from "@/types";

interface ProductSaleOfferProps {
  product: Product;
}

/** Prominent marketing block for the product detail description column. */
export function ProductSaleOffer({ product }: ProductSaleOfferProps) {
  if (!isOnSale(product)) return null;

  const pct = getDiscountPercent(product);
  const saved = getDiscountAmount(product);
  const { formatProductPrice } = useCurrency();
  if (!pct || !saved) return null;

  return (
    <div className="mt-4 overflow-hidden border border-[#004B69]/25 bg-gradient-to-br from-[#004B69]/08 via-[#FAF8F5] to-rich-gold/10">
      <div className="flex flex-wrap items-stretch">
        <div className="flex min-w-[7.5rem] flex-col items-center justify-center bg-[#004B69] px-4 py-4 text-center text-white">
          <span className="font-manrope text-[10px] font-semibold tracking-[0.2em] uppercase opacity-90">
            Special offer
          </span>
          <span className="font-caslon mt-1 text-[34px] leading-none tracking-tight">
            {pct}%
          </span>
          <span className="font-manrope mt-1 text-[11px] font-bold tracking-[0.16em] uppercase">
            Off
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3.5 sm:px-5">
          <p className="font-manrope text-[13px] font-semibold text-foreground sm:text-[14px]">
            Limited-time sale on this gemstone
          </p>
          <p className="font-manrope text-[12px] leading-relaxed text-muted sm:text-[13px]">
            Was{" "}
            <span className="line-through decoration-muted/80">
              {formatProductPrice(getListPrice(product))}
            </span>
            {" · "}
            You save{" "}
            <span className="font-semibold text-[#004B69]">{formatProductPrice(saved)}</span>
          </p>
          <p className="font-manrope text-[11px] tracking-[0.04em] text-rich-gold uppercase">
            Exclusive Ceyloe offer
          </p>
        </div>
      </div>
    </div>
  );
}
