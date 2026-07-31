"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Price } from "@/components/ui/price";
import { getCategoryHref, getSimilarSectionTitle } from "@/lib/product-detail";
import type { Product } from "@/types";

interface SimilarProductsProps {
  products: Product[];
  category: string;
}

export function SimilarProducts({ products, category }: SimilarProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-[#FAF8F5] px-[var(--margin-mobile)] py-12 md:px-[var(--margin-desktop)] md:py-14">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-caslon text-[28px] text-[#1a1a1a] md:text-[32px]">
            {getSimilarSectionTitle(category)}
          </h2>
          <Link
            href={getCategoryHref(category)}
            className="font-manrope inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-rich-gold uppercase transition-colors hover:text-[#9a7532]"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 md:gap-5">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group w-[200px] shrink-0 sm:w-[220px]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#111111]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="220px"
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
