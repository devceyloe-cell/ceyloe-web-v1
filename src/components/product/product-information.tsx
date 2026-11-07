"use client";

import { Price } from "@/components/ui/price";
import { ProductPurchaseActions } from "@/components/product/product-purchase-actions";
import { ProductSpecifications } from "@/components/product/product-specifications";
import type { ProductSpecification } from "@/data/product-detail-content";
import {
  getProductAvailability,
  shouldShowAvailabilityInsteadOfPrice,
} from "@/lib/product-availability";
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
  const status = getProductAvailability(product);
  const showStatusPrice = shouldShowAvailabilityInsteadOfPrice(product);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col overflow-x-clip lg:pt-1">
      <p className="font-manrope text-[11px] font-semibold tracking-[0.2em] text-rich-gold uppercase">
        {typeLabel}
      </p>
      <h1 className="font-caslon mt-2 break-words text-[24px] leading-tight text-heading sm:text-[28px] md:text-[34px] lg:text-[36px]">
        {product.title}
      </h1>
      {product.specs.origin && (
        <p className="font-manrope mt-1.5 text-[13px] text-muted sm:text-[14px]">{product.specs.origin}</p>
      )}

      <p className="font-caslon mt-4 text-[24px] text-rich-gold sm:text-[26px] md:text-[30px]">
        {showStatusPrice ? (status === "hold" ? "Hold" : "Sold Out") : <Price amount={product.price} />}
      </p>

      {product.description && (
        <p className="font-manrope mt-3 max-w-lg text-[13px] leading-[1.55] text-muted sm:text-[14px]">
          {product.description}
        </p>
      )}

      <ProductSpecifications specifications={specifications} />
      <ProductPurchaseActions product={product} actionsRef={actionsRef} />
    </div>
  );
}
