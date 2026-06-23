import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { RecommendWizard } from "@/components/forms/recommend-wizard";
import { getAllProductsForFilters } from "@/services/product-service";
import { getFilterOptions } from "@/lib/product-utils";

export const metadata: Metadata = {
  title: "AI Gemstone Recommendations",
  description: "Get personalised gemstone recommendations based on your preferences and budget.",
};

export const dynamic = "force-dynamic";

export default async function RecommendPage() {
  const products = await getAllProductsForFilters();
  const { colors, shapes } = getFilterOptions(products);

  return (
    <div className="section-bg">
      <section className="border-b border-border bg-surface-elevated py-12 md:py-16">
        <Container>
          <h1 className="font-display text-4xl font-light sm:text-5xl">Find Your Perfect Gemstone</h1>
          <p className="mt-4 max-w-xl text-muted">
            Answer a few questions and our AI will recommend gemstones that match your preferences, budget, and occasion.
          </p>
        </Container>
      </section>
      <Container className="py-12 md:py-20">
        <RecommendWizard colors={colors} shapes={shapes} />
      </Container>
    </div>
  );
}
