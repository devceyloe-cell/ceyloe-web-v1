import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCardGrid } from "@/components/gemstones/category-card-grid";
import { GemstonesLandingHero } from "@/components/gemstones/gemstones-landing-hero";
import { getNaturalGemstones } from "@/lib/mongodb/natural-gemstones";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export const metadata: Metadata = {
  title: "Natural Gemstones | Kalgoorlie Gems & Perth Gems",
  description:
    "Explore Kalgoorlie gems and Perth gems from Ceyloe — certified Ceylon sapphires, spinel, garnet and more, ethically sourced in Sri Lanka and curated in WA.",
  keywords: [
    "Kalgoorlie gems",
    "Perth gems",
    "natural gemstones WA",
    "Ceylon sapphire Australia",
  ],
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
