import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutJourney } from "@/components/about/about-journey";
import { AboutTeam } from "@/components/about/about-team";
import { AboutValues } from "@/components/about/about-values";
import { AboutCta } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Ceyloe was founded with a passion for sharing the beauty of natural Sri Lankan gemstones with Australia — quality, honesty, transparency and personalised service.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutJourney />
      <AboutTeam />
      <AboutValues />
      <AboutCta />
    </>
  );
}
