import { LandingHero } from "@/components/landing/landing-hero";
import { LandingValueBar } from "@/components/landing/landing-value-bar";
import { LandingGemstones } from "@/components/landing/landing-gemstones";
import { LandingQuality } from "@/components/landing/landing-quality";
import { LandingBespoke } from "@/components/landing/landing-bespoke";
import { LandingStory } from "@/components/landing/landing-story";
import { LandingTestimonials } from "@/components/landing/landing-testimonials";
import { LandingAppointmentCta } from "@/components/landing/landing-appointment-cta";
import { facebookReviews } from "@/data/facebook-reviews";
import { getHomepageCollection } from "@/lib/mongodb/homepage-collection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const collection = await getHomepageCollection();

  return (
    <>
      <LandingHero />
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
