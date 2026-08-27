import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import type { GemstoneTypePageConfig } from "@/data/gemstone-type-pages";

const NAVY = "#004B69";
const GOLD = "#C09A4A";

function TitleDivider() {
  return (
    <div className="mt-4 flex max-w-[220px] items-center gap-2 lg:mt-5" aria-hidden>
      <span className="h-px flex-1" style={{ backgroundColor: NAVY }} />
      <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 shrink-0" fill={NAVY}>
        <path d="M8 0l1.8 5.4L15 7l-5.2 1.8L8 14l-1.8-5.2L1 7l5.2-1.6L8 0z" />
      </svg>
      <span className="h-px flex-1" style={{ backgroundColor: NAVY }} />
    </div>
  );
}

interface GemstoneTypeLandingHeroProps {
  config: GemstoneTypePageConfig;
}

/**
 * Shared white cover hero for /gemstones/[type] pages.
 */
export function GemstoneTypeLandingHero({ config }: GemstoneTypeLandingHeroProps) {
  const titleId = `${config.slug}-hero-title`;
  const exploreHref = `#${config.slug}-collection`;

  return (
    <section
      className="relative isolate overflow-hidden bg-white"
      aria-labelledby={titleId}
    >
      <div className="relative h-[clamp(300px,32vw,520px)] w-full">
        <div className="absolute inset-0 z-0" aria-hidden>
          <Image
            src={config.image}
            alt=""
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-right"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[58%] bg-gradient-to-r from-white via-white/95 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-start px-[var(--margin-mobile)] pt-8 pb-10 md:px-[var(--margin-desktop)] md:pt-10 lg:pt-12 xl:pt-14">
          <div className="max-w-[520px] text-left lg:pl-[2%]">
            <Logo size="hero" className="!w-[clamp(160px,12vw,200px)]" />

            <h1
              id={titleId}
              className="font-bell mt-5 text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-left lg:mt-6 xl:mt-5"
              style={{ color: GOLD }}
            >
              {config.title}
            </h1>

            {config.showTitleDivider ? <TitleDivider /> : null}

            {config.heroLayout === "banner" && config.bannerTagline ? (
              <p
                className="font-poppins mt-5 inline-flex min-h-[40px] items-center px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white sm:min-h-[44px] sm:px-6 sm:text-[12px] lg:mt-6"
                style={{ backgroundColor: NAVY }}
              >
                {config.bannerTagline}
              </p>
            ) : null}

            {config.heroLayout === "stacked" && config.traits ? (
              <ul className="mt-4 flex flex-col gap-2 lg:mt-5">
                {config.traits.map((label) => (
                  <li key={label}>
                    <span
                      className="font-poppins inline-flex min-h-[36px] min-w-[160px] items-center justify-center px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:min-w-[180px]"
                      style={{ backgroundColor: NAVY }}
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {config.exploreLabel ? (
              <p
                className="font-poppins mt-5 text-[clamp(13px,0.9vw,15px)] font-normal leading-[1.5] lg:mt-6"
                style={{ color: NAVY }}
              >
                <Link href={exploreHref} className="transition-opacity hover:opacity-80">
                  {config.exploreLabel}
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
