"use client";

import Link from "next/link";
import Image from "next/image";
import { Price } from "@/components/ui/price";
import { CompareButton } from "@/components/compare/compare-button";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const darkImage =
    product.image.includes("/hero/slide-") || product.handle === "custom-sapphire-bracelet";

  return (
    <div className="group relative">
      <Link href={`/products/${product.handle}`}>
        <div
          className={`relative aspect-square overflow-hidden ${
            darkImage ? "bg-neutral-950" : "bg-surface-elevated"
          }`}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`transition-transform duration-500 group-hover:scale-[1.03] ${
              darkImage ? "object-cover object-center" : "object-cover"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.isNew && (
            <span className="absolute left-2 top-2 bg-primary px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">
              New
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-x-0 bottom-0 bg-background/80 py-2 text-center">
              <span className="text-[10px] uppercase tracking-widest text-muted">Sold out</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <h3 className="text-sm leading-snug text-heading transition-colors group-hover:text-primary">
            {product.title}
          </h3>
          <p className="mt-1 text-sm text-foreground">
            <Price amount={product.price} />
          </p>
        </div>
      </Link>
      <div className="mt-2">
        <CompareButton handle={product.handle} />
      </div>
    </div>
  );
}
