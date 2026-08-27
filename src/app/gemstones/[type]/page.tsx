import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CategoryCardGrid } from "@/components/gemstones/category-card-grid";
import { GemstoneTypeLandingHero } from "@/components/gemstones/gemstone-type-landing-hero";
import {
  gemstoneTypeSlugs,
  getGemstoneTypePage,
} from "@/data/gemstone-type-pages";

interface GemstoneTypePageProps {
  params: Promise<{ type: string }>;
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

export default async function GemstoneTypePage({ params }: GemstoneTypePageProps) {
  const { type } = await params;
  const config = getGemstoneTypePage(type);
  if (!config) notFound();

  const catalogHref = `/catalog?category=${config.catalogCategory}`;
  const collectionId = `${config.slug}-collection`;

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

        {config.subcategories && config.subcategories.length > 0 ? (
          <CategoryCardGrid categories={config.subcategories} />
        ) : (
          <div className="border border-border bg-[#faf8f5] px-6 py-10 text-center md:px-10 md:py-14">
            <h2 className="font-caslon text-2xl text-heading md:text-3xl">{config.title}</h2>
            <p className="font-manrope mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base">
              {config.description}
            </p>
            <Link
              href={catalogHref}
              className="font-poppins mt-8 inline-flex min-h-[48px] min-w-[220px] items-center justify-center gap-2 bg-[#004B69] px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
            >
              Browse Collection
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
