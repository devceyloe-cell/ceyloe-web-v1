import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutJourney } from "@/components/about/about-journey";
import { AboutTeam } from "@/components/about/about-team";
import { AboutValues } from "@/components/about/about-values";
import { AboutCta } from "@/components/about/about-cta";
import { getAboutTeam } from "@/lib/mongodb/about-team";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Ceyloe was founded with a passion for sharing the beauty of natural Sri Lankan gemstones with Australia — quality, honesty, transparency and personalised service.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const [team, heroImages] = await Promise.all([getAboutTeam(), getHeroImages()]);

  return (
    <>
      <AboutHero imageOverride={heroImages.about} />
      <AboutJourney />
      <AboutTeam section={team} />
      <AboutValues />
      <AboutCta />
    </>
  );
}
