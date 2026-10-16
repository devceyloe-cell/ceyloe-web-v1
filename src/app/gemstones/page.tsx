import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCardGrid } from "@/components/gemstones/category-card-grid";
import { GemstonesLandingHero } from "@/components/gemstones/gemstones-landing-hero";
import { getNaturalGemstones } from "@/lib/mongodb/natural-gemstones";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export const metadata: Metadata = {
  title: "Natural Gemstones",
  description:
    "Explore our carefully curated collection of natural gemstones, sourced from Sri Lanka and selected for their beauty, rarity and quality.",
};

export const revalidate = 60;

export default async function GemstonesLandingPage() {
  const [section, heroImages] = await Promise.all([getNaturalGemstones(), getHeroImages()]);

  return (
    <div className="bg-white">
      <GemstonesLandingHero imageOverride={heroImages.gemstones} />

      <Container id="natural-gemstones" className="scroll-mt-28 py-12 md:py-16">
        <SectionHeading
          titleId="natural-gemstones-heading"
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          align="left"
        />

        <CategoryCardGrid categories={section.categories} />
      </Container>
    </div>
  );
}
