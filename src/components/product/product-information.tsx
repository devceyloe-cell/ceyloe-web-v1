"use client";

import { Price } from "@/components/ui/price";
import { ProductPurchaseActions } from "@/components/product/product-purchase-actions";
import { ProductSpecifications } from "@/components/product/product-specifications";
import type { ProductSpecification } from "@/data/product-detail-content";
import type { Product } from "@/types";

interface ProductInformationProps {
  product: Product;
  typeLabel: string;
  specifications: ProductSpecification[];
  actionsRef?: React.RefObject<HTMLDivElement | null>;
}

export function ProductInformation({
  product,
  typeLabel,
  specifications,
  actionsRef,
}: ProductInformationProps) {
  return (
    <div className="flex flex-col lg:pt-1">
      <p className="font-manrope text-[11px] font-semibold tracking-[0.2em] text-rich-gold uppercase">
        {typeLabel}
      </p>
      <h1 className="font-caslon mt-2 text-[28px] leading-tight text-heading md:text-[34px] lg:text-[36px]">
        {product.title}
      </h1>
      {product.specs.origin && (
        <p className="font-manrope mt-1.5 text-[14px] text-muted">{product.specs.origin}</p>
      )}

      <p className="font-caslon mt-4 text-[26px] text-rich-gold md:text-[30px]">
        <Price amount={product.price} />
      </p>

      {product.description && (
        <p className="font-manrope mt-3 max-w-lg text-[14px] leading-[1.55] text-muted">
          {product.description}
        </p>
      )}

      <ProductSpecifications specifications={specifications} />
      <ProductPurchaseActions product={product} actionsRef={actionsRef} />
    </div>
  );
}
