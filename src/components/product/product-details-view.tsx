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
      <div className="section-bg max-w-[100vw] overflow-x-clip">
        <div className="mx-auto w-full min-w-0 max-w-[1280px] px-4 py-6 sm:px-[var(--margin-mobile)] sm:py-8 md:px-[var(--margin-desktop)] md:py-10 lg:py-12">
          <ProductBreadcrumbs
            title={product.title}
            category={product.category}
            subcategory={product.subcategory}
          />

          {checkoutCancelled && (
            <div className="mb-6 border border-border bg-surface-elevated px-4 py-3 font-manrope text-sm text-muted sm:px-5 sm:py-4">
              Checkout was cancelled. You can try again or contact us if you need help with this
              gemstone.
            </div>
          )}

          <div className="grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:gap-10 xl:gap-12">
            <div className="min-w-0">
              <ProductMediaGallery
                images={product.images}
                title={product.title}
                videoUrl={product.videoUrl}
                poster={product.image}
                product={product}
              />
            </div>
            <div className="min-w-0">
              <ProductInformation
                product={product}
                typeLabel={typeLabel}
                specifications={specifications}
                actionsRef={actionsRef}
              />
            </div>
          </div>
        </div>
      </div>

      <ProductTrustBenefits />
      <ProductHighlights product={product} />

      <section className="overflow-x-hidden bg-white px-4 py-10 sm:px-[var(--margin-mobile)] sm:py-12 md:px-[var(--margin-desktop)] md:py-14">
        <div className="mx-auto w-full min-w-0 max-w-[900px]">
          <h2 className="font-caslon mb-5 text-center text-[24px] text-[#1a1a1a] sm:mb-6 sm:text-[28px] md:text-[32px]">
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

      <SimilarProducts
        products={similarProducts}
        category={product.category}
        subcategory={product.subcategory}
      />
      <ConsultationBanner productTitle={product.title} productUrl={productUrl} />
      {/* Room for sticky mobile action bar + safe area */}
      <div className="h-24 sm:h-20" aria-hidden />
      <StickyProductActionBar
        product={product}
        productUrl={productUrl}
        sentinelRef={actionsRef}
      />
    </>
  );
}
