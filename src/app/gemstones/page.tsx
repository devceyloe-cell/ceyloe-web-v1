import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCardGrid } from "@/components/gemstones/category-card-grid";
import { gemstoneLandingCategories } from "@/data/gemstone-categories";

export const metadata: Metadata = {
  title: "Natural Gemstones",
  description:
    "Explore our carefully curated collection of natural gemstones, sourced from Sri Lanka and selected for their beauty, rarity and quality.",
};

export default function GemstonesLandingPage() {
  return (
    <div className="section-bg">
      <Container className="py-12 md:py-20">
        <SectionHeading
          eyebrow="Collection"
          title="Natural Gemstones"
          description="Explore our carefully curated collection of natural gemstones, sourced from Sri Lanka and selected for their beauty, rarity and quality. Whether you're searching for a loose gemstone or planning a bespoke jewellery piece, begin your journey here."
          align="left"
        />

        <CategoryCardGrid categories={gemstoneLandingCategories} />
      </Container>
    </div>
  );
}
