import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCardGrid } from "@/components/gemstones/category-card-grid";
import { GemstonesLandingHero } from "@/components/gemstones/gemstones-landing-hero";
import { getNaturalGemstones } from "@/lib/mongodb/natural-gemstones";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export const metadata: Metadata = {
  title: "Natural Gemstones | Buy Ceylon Sapphires in Perth & WA",
  description:
    "Explore certified natural Ceylon gemstones for Perth and Western Australia — sapphires, spinel, garnet and more, ethically sourced in Sri Lanka and curated by Ceyloe.",
  alternates: { canonical: "/gemstones" },
};

export const revalidate = 60;

export default async function GemstonesLandingPage() {
  const [section, heroImages] = await Promise.all([getNaturalGemstones(), getHeroImages()]);

  return (
    <div className="bg-white">
      <GemstonesLandingHero contentOverride={heroImages.gemstones} />

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
