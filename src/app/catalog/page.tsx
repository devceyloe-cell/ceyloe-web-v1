import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CompareBar } from "@/components/compare/compare-bar";
import {
  getProducts,
  getProductCategories,
  getAllProductsForFilters,
} from "@/services/product-service";
import { getFilterOptions } from "@/lib/product-utils";
import type { CatalogFilters as Filters } from "@/types";

export const metadata: Metadata = {
  title: "Gemstone Catalog",
  description: "Browse our collection of certified, ethically sourced gemstones from Sri Lanka.",
};

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

  return (
    <div className="section-bg">
      <Container className="py-12 md:py-20">
        <SectionHeading
          eyebrow="Collection"
          title="Loose Gemstones & Jewellery"
          description={`${products.length} exceptional pieces available`}
          align="left"
        />

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
