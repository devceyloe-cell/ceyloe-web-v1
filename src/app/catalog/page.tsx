import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CatalogLandingHero } from "@/components/catalog/catalog-landing-hero";
import { FineJewelleryHero } from "@/components/catalog/fine-jewellery-hero";
import {
  deriveCatalogView,
  loadAllProducts,
} from "@/services/product-service";
import { getFilterOptions, getCatalogBounds } from "@/lib/product-utils";
import { PRODUCT_CATEGORIES } from "@/config/product-categories";
import { getCatalogCoverKey, getWebCover } from "@/config/web-covers";
import type { CatalogFilters as Filters } from "@/types";
import { mergeCoverWithOverride } from "@/lib/hero/content";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export const metadata: Metadata = {
  title: "Gemstone Catalog | Ceylon Stones for Perth & WA",
  description:
    "Browse certified, ethically sourced Ceylon gemstones available to buyers in Perth and Western Australia — sapphires, spinel, garnet and more.",
  alternates: { canonical: "/catalog" },
};

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    color?: string | string[];
    shape?: string;
    origin?: string;
    sort?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    minCarat?: string;
    maxCarat?: string;
  }>;
}

function normalizeColorParam(color?: string | string[]): string | string[] | undefined {
  if (!color) return undefined;
  const list = (Array.isArray(color) ? color : [color])
    .map((c) => c.trim())
    .filter(Boolean);
  if (list.length === 0) return undefined;
  if (list.length === 1) return list[0];
  return list;
}

function titleCase(value: string) {
  return value
    .split(/[\s-_]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getCatalogBackLink(filters: Filters) {
  if (filters.category === "sapphires") {
    return { href: "/gemstones/sapphires", label: "Sapphire varieties" };
  }
  return { href: "/gemstones", label: "All gemstones" };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const baseFilters: Filters = {
    category: params.category,
    color: normalizeColorParam(params.color),
    shape: params.shape,
    origin: params.origin,
    sort: (params.sort as Filters["sort"]) || undefined,
    search: params.search,
  };

  const filters: Filters = {
    ...baseFilters,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minCarat: params.minCarat ? Number(params.minCarat) : undefined,
    maxCarat: params.maxCarat ? Number(params.maxCarat) : undefined,
  };

  const [allProducts, heroImages] = await Promise.all([loadAllProducts(), getHeroImages()]);
  const { products, selectionProducts, categories } = deriveCatalogView(
    allProducts,
    filters,
    baseFilters,
  );

  const filterOptions = getFilterOptions(selectionProducts);
  const bounds = getCatalogBounds(selectionProducts);
  const coverKey = getCatalogCoverKey(filters.category, filters.color);
  const cover = mergeCoverWithOverride(getWebCover(coverKey), heroImages[coverKey]);
  const back = getCatalogBackLink(filters);
  const categoryLabel =
    PRODUCT_CATEGORIES.find((c) => c.value === filters.category)?.label ??
    (filters.category ? titleCase(filters.category) : "Gemstones");

  const isJewellery = filters.category === "jewellery";

  return (
    <div className="bg-white">
      {isJewellery ? (
        <FineJewelleryHero contentOverride={heroImages.fineJewellery} />
      ) : (
        <CatalogLandingHero
          cover={cover}
          description={
            cover.description ??
            `${products.length} exceptional ${categoryLabel.toLowerCase()} available`
          }
        />
      )}

      {/* Scroll anchor target for the "Shop Jewellery" button */}
      <div id="jewellery-collection" />

      <Container className="py-12 md:py-20">
        {!isJewellery && (
          <Link
            href={back.href}
            className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {back.label}
          </Link>
        )}

        <div
          className={
            isJewellery ? undefined : "grid gap-10 lg:grid-cols-[280px_1fr]"
          }
        >
          {!isJewellery ? (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <Suspense fallback={<div className="h-40 animate-pulse bg-surface-elevated" />}>
                <CatalogFilters categories={categories} {...filterOptions} bounds={bounds} />
              </Suspense>
            </aside>
          ) : null}

          <div>
            <ProductGrid products={products} />
          </div>
        </div>
      </Container>
    </div>
  );
}
