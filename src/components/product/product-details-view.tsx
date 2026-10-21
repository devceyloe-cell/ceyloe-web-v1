"use client";

import { useRef } from "react";
import { ProductBreadcrumbs } from "@/components/product/product-breadcrumbs";
import { ProductMediaGallery } from "@/components/product/product-media-gallery";
import { ProductInformation } from "@/components/product/product-information";
import { ProductTrustBenefits } from "@/components/product/product-trust-benefits";
import { ProductHighlights } from "@/components/product/product-highlights";
import { ProductVideo } from "@/components/product/product-video";
import { SimilarProducts } from "@/components/product/similar-products";
import { ConsultationBanner } from "@/components/product/consultation-banner";
import { StickyProductActionBar } from "@/components/product/sticky-product-action-bar";
import type { ProductSpecification } from "@/data/product-detail-content";
import type { Product } from "@/types";

interface ProductDetailsViewProps {
  product: Product;
  typeLabel: string;
  specifications: ProductSpecification[];
  similarProducts: Product[];
  productUrl: string;
  checkoutCancelled?: boolean;
}

export function ProductDetailsView({
  product,
  typeLabel,
  specifications,
  similarProducts,
  productUrl,
  checkoutCancelled,
}: ProductDetailsViewProps) {
  const actionsRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="section-bg">
        <div className="mx-auto max-w-[1280px] px-[var(--margin-mobile)] py-8 md:px-[var(--margin-desktop)] md:py-10 lg:py-12">
          <ProductBreadcrumbs title={product.title} category={product.category} />

          {checkoutCancelled && (
            <div className="mb-6 border border-border bg-surface-elevated px-5 py-4 font-manrope text-sm text-muted">
              Checkout was cancelled. You can try again or contact us if you need help with this
              gemstone.
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:gap-10 xl:gap-12">
            <ProductMediaGallery
              images={product.images}
              title={product.title}
              videoUrl={product.videoUrl}
              poster={product.image}
              product={product}
            />
            <ProductInformation
              product={product}
              typeLabel={typeLabel}
              specifications={specifications}
              actionsRef={actionsRef}
            />
          </div>
        </div>
      </div>

      <ProductTrustBenefits />
      <ProductHighlights product={product} />

      {product.videoUrl && (
        <section className="bg-white px-[var(--margin-mobile)] py-12 md:px-[var(--margin-desktop)] md:py-14">
          <div className="mx-auto max-w-[900px]">
            <h2 className="font-caslon mb-6 text-center text-[28px] text-[#1a1a1a] md:text-[32px]">
              Gemstone Video
            </h2>
            <ProductVideo
              variant="section"
              showHeading={false}
              videoUrl={product.videoUrl}
              poster={product.image}
              title={product.title}
            />
          </div>
        </section>
      )}

      <SimilarProducts products={similarProducts} category={product.category} />
      <ConsultationBanner productTitle={product.title} productUrl={productUrl} />
      <div className="h-20" aria-hidden />
      <StickyProductActionBar
        product={product}
        productUrl={productUrl}
        sentinelRef={actionsRef}
      />
    </>
  );
}
