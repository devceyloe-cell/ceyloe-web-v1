import { Logo } from "@/components/layout/logo";
import { WhiteCoverHeroLayout } from "@/components/layout/white-cover-hero-layout";
import { BrowseCollectionButton } from "@/components/gemstones/browse-collection-button";

/** Attachment / PDF page 2 palette — aligned with homepage cover styles */
const NAVY = "#004B69";
const GOLD = "#C09A4A";
const HERO_ART = "/images/covers/gemstones-hero-hq.webp";

/**
 * /gemstones hero — white PDF page 2 benchmark (Explore Our Gemstones).
 */
export function GemstonesLandingHero({ imageOverride }: { imageOverride?: string }) {
  return (
    <WhiteCoverHeroLayout
      image={imageOverride || HERO_ART}
      ariaLabelledBy="gemstones-landing-title"
      variant="wide"
    >
      <Logo size="hero" className="!w-[clamp(160px,12vw,200px)]" />

      <p
        className="font-poppins mt-5 text-[clamp(12px,0.8vw,14px)] font-normal uppercase leading-none tracking-[0.18em] lg:mt-6 xl:mt-5"
        style={{ color: NAVY }}
      >
        Explore Our
      </p>

      <h1
        id="gemstones-landing-title"
        className="font-bell mt-2 text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-left lg:mt-2.5"
        style={{ color: GOLD }}
      >
        Gemstones
      </h1>

      <p
        className="font-poppins mt-3 max-w-[460px] text-[clamp(13px,0.9vw,15px)] font-normal leading-[1.5] text-left lg:mt-3.5"
        style={{ color: NAVY }}
      >
        Discover a world of rare, natural and exceptional beauty.
      </p>

      <BrowseCollectionButton />
    </WhiteCoverHeroLayout>
  );
}
