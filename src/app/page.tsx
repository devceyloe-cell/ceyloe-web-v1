import { LandingHero } from "@/components/landing/landing-hero";
import { LandingValueBar } from "@/components/landing/landing-value-bar";
import { LandingGemstones } from "@/components/landing/landing-gemstones";
import { LandingQuality } from "@/components/landing/landing-quality";
import { LandingBespoke } from "@/components/landing/landing-bespoke";
import { LandingStory } from "@/components/landing/landing-story";
import { LandingTestimonials } from "@/components/landing/landing-testimonials";
import { LandingAppointmentCta } from "@/components/landing/landing-appointment-cta";
import { facebookReviews } from "@/data/facebook-reviews";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <LandingValueBar />
      <LandingGemstones />
      <LandingQuality />
      <LandingBespoke />
      <LandingStory />
      <LandingTestimonials testimonials={facebookReviews} />
      <LandingAppointmentCta />
    </>
  );
}
