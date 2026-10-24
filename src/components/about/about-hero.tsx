import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { WhiteCoverHeroLayout } from "@/components/layout/white-cover-hero-layout";
import { resolveHeroCopy } from "@/lib/hero/use-hero-copy";
import type { HeroOverrideRaw } from "@/lib/hero/content";

const NAVY = "#004B69";
const GOLD = "#C09A4A";

export function AboutHero({
  imageOverride,
  contentOverride,
}: {
  imageOverride?: string;
  contentOverride?: HeroOverrideRaw;
}) {
  const hero = resolveHeroCopy(
    {
      image: "/images/covers/our-story.webp",
      title: "Our Story",
      description:
        "From our family mines in Sri Lanka to you in Australia. A journey of passion, heritage and trust.",
    },
    contentOverride ?? imageOverride,
  );

  return (
    <WhiteCoverHeroLayout image={hero.image} ariaLabelledBy="about-hero-title">
      <Logo size="hero" className="!w-[clamp(160px,12vw,200px)]" />

      <h1
        id="about-hero-title"
        className="font-bell mt-5 text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-left lg:mt-6 xl:mt-5"
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

      <Link
        href="#journey-heading"
        className="font-poppins mt-5 inline-flex min-h-[44px] min-w-[220px] items-center justify-center rounded-none px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 lg:mt-6 lg:min-h-[48px] lg:min-w-[240px] xl:mt-5"
        style={{ backgroundColor: NAVY }}
      >
        Our Journey
      </Link>
    </WhiteCoverHeroLayout>
  );
}
