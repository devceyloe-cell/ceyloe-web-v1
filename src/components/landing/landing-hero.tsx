import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";

/** PDF page 1 / designer attachment palette */
const NAVY = "#004B69";
const GOLD = "#C09A4A";
const BTN_SECONDARY = "#7A8F9A";
const HERO_IMAGE = "/images/covers/blue-s.webp";

/**
 * Homepage hero — PDF page 1 (1920×800): Natural Ceylon Gemstones.
 */
export function LandingHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-white"
      aria-labelledby="home-hero-title"
    >
      <div className="relative mx-auto aspect-[1920/800] w-full max-w-[1440px]">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            quality={95}
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-contain object-right"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-white via-white/95 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex h-full items-start px-[var(--margin-mobile)] pt-8 pb-10 md:px-[var(--margin-desktop)] md:pt-10 lg:pt-12 xl:pt-14">
          <div className="max-w-[520px] text-left lg:pl-[2%]">
            <Logo size="hero" className="!w-[clamp(160px,12vw,200px)]" />

            <p
              className="font-poppins mt-5 text-[clamp(12px,0.8vw,14px)] font-normal uppercase leading-none tracking-[0.18em] lg:mt-6 xl:mt-5"
              style={{ color: NAVY }}
            >
              Sri Lanka&apos;s Finest Treasures
            </p>

            <h1
              id="home-hero-title"
              className="font-bell mt-2 text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-left lg:mt-2.5"
              style={{ color: GOLD }}
            >
              <span className="block">Natural Ceylon</span>
              <span className="block">Gemstones</span>
            </h1>

            <p
              className="font-poppins mt-3 max-w-[460px] text-[clamp(13px,0.9vw,15px)] font-normal leading-[1.5] text-left lg:mt-3.5"
              style={{ color: NAVY }}
            >
              Exceptional natural Ceylon gemstones sourced from Sri Lanka and curated
              in Australia.
            </p>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-3 lg:mt-6 xl:mt-5">
              <Link
                href="/gemstones"
                className="font-poppins inline-flex min-h-[44px] min-w-[190px] items-center justify-center rounded-none px-6 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 lg:min-h-[46px]"
                style={{ backgroundColor: NAVY }}
              >
                Explore Gemstones
              </Link>
              <Link
                href="/book"
                className="font-poppins inline-flex min-h-[44px] min-w-[240px] items-center justify-center rounded-none border px-6 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 lg:min-h-[46px]"
                style={{ backgroundColor: BTN_SECONDARY, borderColor: NAVY }}
              >
                Book a Private Appointment
              </Link>
            </div>

            <p
              className="font-poppins mt-4 flex items-center gap-2 text-[clamp(12px,0.85vw,14px)] font-normal tracking-[0.02em] lg:mt-5 xl:mt-4"
              style={{ color: NAVY }}
            >
              {/* Filled pin matching designer attachment (navy + white center) */}
              <svg
                className="h-[15px] w-[11px] shrink-0"
                viewBox="0 0 12 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 0C2.686 0 0 2.686 0 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.314-2.686-6-6-6Z"
                  fill={NAVY}
                />
                <circle cx="6" cy="6" r="2.25" fill="white" />
              </svg>
              <span>
                Curated in Australia{" "}
                <span className="mx-1 opacity-50" aria-hidden>
                  |
                </span>{" "}
                Sourced in Sri Lanka
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
