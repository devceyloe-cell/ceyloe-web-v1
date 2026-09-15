import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CategoryCardGrid } from "@/components/gemstones/category-card-grid";
import { CollectionFilters } from "@/components/gemstones/collection-filters";
import { GemstoneTypeLandingHero } from "@/components/gemstones/gemstone-type-landing-hero";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CompareBar } from "@/components/compare/compare-bar";
import {
  gemstoneTypeSlugs,
  getGemstoneTypePage,
} from "@/data/gemstone-type-pages";
import { getProducts } from "@/services/product-service";
import type { CatalogFilters as Filters } from "@/types";

export const dynamic = "force-dynamic";

interface GemstoneTypePageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    minCarat?: string;
    maxCarat?: string;
  }>;
}

export function generateStaticParams() {
  return gemstoneTypeSlugs.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: GemstoneTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const config = getGemstoneTypePage(type);
  if (!config) return {};
  return {
    title: config.title,
    description: config.description,
  };
}

export default async function GemstoneTypePage({
  params,
  searchParams,
}: GemstoneTypePageProps) {
  const { type } = await params;
  const query = await searchParams;
  const config = getGemstoneTypePage(type);
  if (!config) notFound();

  const collectionId = `${config.slug}-collection`;
  const hasSubcategories = Boolean(config.subcategories?.length);

  const filters: Filters = {
    category: config.catalogCategory,
    sort: (query.sort as Filters["sort"]) ?? "featured",
    minPrice: query.minPrice ? Number(query.minPrice) : undefined,
    maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
    minCarat: query.minCarat ? Number(query.minCarat) : undefined,
    maxCarat: query.maxCarat ? Number(query.maxCarat) : undefined,
  };

  const products = hasSubcategories ? [] : await getProducts(filters);

  return (
    <div className="bg-white">
      <GemstoneTypeLandingHero config={config} />

      <Container id={collectionId} className="scroll-mt-28 py-12 md:py-20">
        <Link
          href="/gemstones"
          className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All Gemstones
        </Link>

        {hasSubcategories ? (
          <CategoryCardGrid categories={config.subcategories!} />
        ) : (
          <div>
            <div className="mb-8">
              <p className="font-poppins text-[11px] font-normal uppercase tracking-[0.18em] text-[#004B69]">
                Collection
              </p>
              <h2 className="font-bell mt-1 text-2xl font-bold uppercase tracking-[0.01em] text-[#C09A4A] md:text-3xl">
                {config.title}
              </h2>
              <p className="font-poppins mt-2 max-w-xl text-sm text-[#004B69]/80">
                {products.length} {products.length === 1 ? "gemstone" : "gemstones"} available
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <Suspense fallback={<div className="h-40 animate-pulse bg-surface-elevated" />}>
                  <CollectionFilters />
                </Suspense>
              </aside>
              <div>
                <ProductGrid products={products} />
              </div>
            </div>
          </div>
        )}
      </Container>
      {!hasSubcategories ? <CompareBar /> : null}
    </div>
  );
}
