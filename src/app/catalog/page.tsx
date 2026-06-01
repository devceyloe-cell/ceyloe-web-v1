import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductGrid } from "@/components/catalog/product-grid";
import { getProducts, getProductCategories } from "@/services/product-service";
import type { CatalogFilters as Filters } from "@/types";

export const metadata: Metadata = {
  title: "Gemstone Catalog",
  description: "Browse our collection of certified, ethically sourced gemstones from Sri Lanka.",
};

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const filters: Filters = {
    category: params.category,
    sort: (params.sort as Filters["sort"]) ?? "featured",
    search: params.search,
  };

  const [products, categories] = await Promise.all([
    getProducts(filters),
    getProductCategories(),
  ]);

  return (
    <Container className="py-12 md:py-20">
      <SectionHeading
        eyebrow="Collection"
        title="Gemstone Catalog"
        description={`${products.length} exceptional stones available`}
      />

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Suspense fallback={<div className="h-40 animate-pulse bg-surface" />}>
            <CatalogFilters categories={categories} />
          </Suspense>
        </aside>

        <ProductGrid products={products} />
      </div>
    </Container>
  );
}
