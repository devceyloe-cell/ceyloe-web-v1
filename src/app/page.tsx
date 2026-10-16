import dynamic from "next/dynamic";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingValueBar } from "@/components/landing/landing-value-bar";
import { LandingGemstones } from "@/components/landing/landing-gemstones";
import { LandingQuality } from "@/components/landing/landing-quality";
import { LandingBespoke } from "@/components/landing/landing-bespoke";
import { LandingStory } from "@/components/landing/landing-story";
import { LandingAppointmentCta } from "@/components/landing/landing-appointment-cta";
import { facebookReviews } from "@/data/facebook-reviews";
import { getHomepageCollection } from "@/lib/mongodb/homepage-collection";
import { getHeroImages } from "@/lib/mongodb/hero-images";

const LandingTestimonials = dynamic(() =>
  import("@/components/landing/landing-testimonials").then((m) => m.LandingTestimonials),
);

export const revalidate = 60;

export default async function HomePage() {
  const [collection, heroImages] = await Promise.all([
    getHomepageCollection(),
    getHeroImages(),
  ]);

  return (
    <>
      <LandingHero imageOverride={heroImages.home} />
      <LandingValueBar />
      <LandingGemstones collection={collection} />
      <LandingQuality />
      <LandingBespoke />
      <LandingStory />
      <LandingTestimonials testimonials={facebookReviews} />
      <LandingAppointmentCta />
    </>
  );
}
