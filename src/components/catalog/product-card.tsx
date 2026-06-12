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
          className={`relative mb-6 aspect-[2/3] overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 ${
            darkImage ? "bg-neutral-950" : "bg-white"
          }`}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
          {product.isNew && (
            <span className="label-caps absolute left-3 top-3 bg-deep-navy px-2 py-1 text-white">
              New
            </span>
          )}
        </div>
        <div className="text-center">
          <h3 className="font-caslon text-xl transition-colors group-hover:text-rich-gold">
            {product.title}
          </h3>
          <div className="gold-divider my-3" />
          <p className="label-caps text-on-surface-variant">
            <Price amount={product.price} />
          </p>
        </div>
      </Link>
      <div className="mt-3 text-center">
        <CompareButton handle={product.handle} />
      </div>
    </div>
  );
}
