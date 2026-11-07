"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Price } from "@/components/ui/price";
import { getCategoryHref, getSimilarSectionTitle } from "@/lib/product-detail";
import type { Product } from "@/types";

interface SimilarProductsProps {
  products: Product[];
  category: string;
  subcategory?: string;
}

export function SimilarProducts({
  products,
  category,
  subcategory,
}: SimilarProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="overflow-x-hidden bg-[#FAF8F5] px-4 py-10 sm:px-[var(--margin-mobile)] sm:py-12 md:px-[var(--margin-desktop)] md:py-14">
      <div className="mx-auto w-full min-w-0 max-w-[1280px]">
        <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8 sm:gap-4">
          <h2 className="font-caslon min-w-0 text-[24px] text-[#1a1a1a] sm:text-[28px] md:text-[32px]">
            {getSimilarSectionTitle(category)}
          </h2>
          <Link
            href={getCategoryHref(category, subcategory)}
            className="font-manrope inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] text-rich-gold uppercase transition-colors hover:text-[#9a7532] sm:text-[11px]"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0 md:gap-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group w-[160px] shrink-0 sm:w-[200px] md:w-[220px]"
            >
              <div
                className="relative overflow-hidden bg-[#111111]"
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  width={220}
                  height={220}
                  loading="lazy"
                  decoding="async"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <h3 className="font-caslon mt-3 text-[16px] leading-snug text-[#1a1a1a] transition-colors group-hover:text-rich-gold">
                {product.title}
              </h3>
              {product.specs.origin && (
                <p className="font-manrope mt-1 text-[12px] text-[#777777]">
                  {product.specs.origin}
                </p>
              )}
              <p className="font-manrope mt-1.5 text-[13px] font-semibold text-rich-gold">
                <Price amount={product.price} />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
