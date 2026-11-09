import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutJourney } from "@/components/about/about-journey";
import { AboutTeam } from "@/components/about/about-team";
import { AboutValues } from "@/components/about/about-values";
import { AboutCta } from "@/components/about/about-cta";
import { getAboutTeam } from "@/lib/mongodb/about-team";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export const metadata: Metadata = {
  title: "Our Story | Ceylon Gemstones for Perth & Australia",
  description:
    "Ceyloe connects Sri Lanka’s finest gemstones with Perth and Western Australia — quality, honesty, transparency and personalised service from Kalgoorlie, WA.",
  alternates: { canonical: "/about" },
};

export const revalidate = 60;

export default async function AboutPage() {
  const [team, heroImages] = await Promise.all([getAboutTeam(), getHeroImages()]);

  return (
    <>
      <AboutHero contentOverride={heroImages.about} />
      <AboutJourney />
      <AboutTeam section={team} />
      <AboutValues />
      <AboutCta />
    </>
  );
}
