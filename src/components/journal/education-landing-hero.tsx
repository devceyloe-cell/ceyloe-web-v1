import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { WhiteCoverHeroLayout } from "@/components/layout/white-cover-hero-layout";

const NAVY = "#004B69";
const GOLD = "#C09A4A";
const HERO_ART = "/images/covers/education.webp";

export function EducationLandingHero({ imageOverride }: { imageOverride?: string }) {
  return (
    <WhiteCoverHeroLayout image={imageOverride || HERO_ART} ariaLabelledBy="education-hero-title">
      <Logo size="hero" className="!w-[clamp(160px,12vw,200px)]" />

      <h1
        id="education-hero-title"
        className="font-bell mt-5 text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-left lg:mt-6 xl:mt-5"
        style={{ color: GOLD }}
      >
        Education
      </h1>

      <p
        className="font-poppins mt-3 max-w-[460px] text-[clamp(13px,0.9vw,15px)] font-normal leading-[1.5] text-left lg:mt-3.5"
        style={{ color: NAVY }}
      >
        Learn, discover and be inspired by the world of gemstones.
      </p>

      <Link
        href="#education-topics"
        className="font-poppins mt-5 inline-flex min-h-[44px] min-w-[220px] items-center justify-center rounded-none px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 lg:mt-6 lg:min-h-[48px] lg:min-w-[240px] xl:mt-5"
        style={{ backgroundColor: NAVY }}
      >
        Explore Articles
      </Link>
    </WhiteCoverHeroLayout>
  );
}
