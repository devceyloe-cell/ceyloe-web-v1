import dynamic from "next/dynamic";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingValueBar } from "@/components/landing/landing-value-bar";
import { LandingGemstones } from "@/components/landing/landing-gemstones";
import { LandingQuality } from "@/components/landing/landing-quality";
import { LandingBespoke } from "@/components/landing/landing-bespoke";
import { LandingStory } from "@/components/landing/landing-story";
import { LandingAppointmentCta } from "@/components/landing/landing-appointment-cta";
import { googleReviews, googleReviewStats } from "@/data/google-reviews";
import { getHomepageCollection } from "@/lib/mongodb/homepage-collection";
import { getHomepageBannerSlides } from "@/lib/mongodb/homepage-banner-slides";

const LandingTestimonials = dynamic(() =>
  import("@/components/landing/landing-testimonials").then((m) => m.LandingTestimonials),
);

export const revalidate = 60;

export default async function HomePage() {
  const [collection, banner] = await Promise.all([
    getHomepageCollection(),
    getHomepageBannerSlides(),
  ]);

  return (
    <>
      <LandingHero images={banner.slides.map((s) => s.image)} />
      <LandingValueBar />
      <LandingGemstones collection={collection} />
      <LandingQuality />
      <LandingBespoke />
      <LandingStory />
      <LandingTestimonials testimonials={googleReviews} stats={googleReviewStats} />
      <LandingAppointmentCta />
    </>
  );
}
