import { Logo } from "@/components/layout/logo";
import { WhiteCoverHeroLayout } from "@/components/layout/white-cover-hero-layout";
import { BrowseCollectionButton } from "@/components/gemstones/browse-collection-button";
import { resolveHeroCopy } from "@/lib/hero/use-hero-copy";
import type { HeroOverrideRaw } from "@/lib/hero/content";

const NAVY = "#004B69";
const GOLD = "#C09A4A";

export function GemstonesLandingHero({
  imageOverride,
  contentOverride,
}: {
  imageOverride?: string;
  contentOverride?: HeroOverrideRaw;
}) {
  const hero = resolveHeroCopy(
    {
      image: "/images/covers/gemstones-hero-hq.webp",
      title: "Gemstones",
      description: "Discover a world of rare, natural and exceptional beauty.",
      eyebrow: "Explore Our",
    },
    contentOverride ?? imageOverride,
  );

  return (
    <WhiteCoverHeroLayout
      image={hero.image}
      ariaLabelledBy="gemstones-landing-title"
      variant="wide"
    >
      <Logo size="hero" className="!w-[clamp(160px,12vw,200px)]" />

      {hero.eyebrow ? (
        <p
          className="font-poppins mt-5 text-[clamp(12px,0.8vw,14px)] font-normal uppercase leading-none tracking-[0.18em] lg:mt-6 xl:mt-5"
          style={{ color: NAVY }}
        >
          {hero.eyebrow}
        </p>
      ) : null}

      <h1
        id="gemstones-landing-title"
        className="font-bell mt-2 text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-left lg:mt-2.5"
        style={{ color: GOLD }}
      >
        {hero.titleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      {hero.description ? (
        <p
          className="font-poppins mt-3 max-w-[460px] text-[clamp(13px,0.9vw,15px)] font-normal leading-[1.5] text-left lg:mt-3.5"
          style={{ color: NAVY }}
        >
          {hero.description}
        </p>
      ) : null}

      <BrowseCollectionButton />
    </WhiteCoverHeroLayout>
  );
}