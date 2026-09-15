import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CompareBar } from "@/components/compare/compare-bar";
import { CatalogLandingHero } from "@/components/catalog/catalog-landing-hero";
import {
  getProducts,
  getProductCategories,
  getAllProductsForFilters,
} from "@/services/product-service";
import { getFilterOptions } from "@/lib/product-utils";
import { PRODUCT_CATEGORIES } from "@/config/product-categories";
import { getCatalogCoverKey, getWebCover } from "@/config/web-covers";
import type { CatalogFilters as Filters } from "@/types";

export const metadata: Metadata = {
  title: "Gemstone Catalog",
  description: "Browse our collection of certified, ethically sourced gemstones from Sri Lanka.",
};

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    color?: string;
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

  const filters: Filters = {
    category: params.category,
    color: params.color,
    shape: params.shape,
    origin: params.origin,
    sort: (params.sort as Filters["sort"]) ?? "featured",
    search: params.search,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minCarat: params.minCarat ? Number(params.minCarat) : undefined,
    maxCarat: params.maxCarat ? Number(params.maxCarat) : undefined,
  };

  const [products, categories, allProducts] = await Promise.all([
    getProducts(filters),
    getProductCategories(),
    getAllProductsForFilters(),
  ]);

  const filterOptions = getFilterOptions(allProducts);
  const cover = getWebCover(getCatalogCoverKey(filters.category, filters.color));
  const back = getCatalogBackLink(filters);
  const categoryLabel =
    PRODUCT_CATEGORIES.find((c) => c.value === filters.category)?.label ??
    (filters.category ? titleCase(filters.category) : "Gemstones");

  return (
    <div className="bg-white">
      <CatalogLandingHero
        cover={cover}
        description={
          cover.description ??
          `${products.length} exceptional ${categoryLabel.toLowerCase()} available`
        }
      />
      <Container className="py-12 md:py-20">
        <Link
          href={back.href}
          className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {back.label}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Suspense fallback={<div className="h-40 animate-pulse bg-surface-elevated" />}>
              <CatalogFilters categories={categories} {...filterOptions} />
            </Suspense>
          </aside>

          <div>
            <ProductGrid products={products} />
          </div>
        </div>
      </Container>
      <CompareBar />
    </div>
  );
}
