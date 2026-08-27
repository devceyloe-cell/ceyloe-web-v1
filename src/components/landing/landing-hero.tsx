import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Logo } from "@/components/layout/logo";

/** PDF page 1 / designer attachment palette */
const NAVY = "#004B69";
const GOLD = "#C09A4A";
const BTN_SECONDARY = "#7A8F9A";
const HERO_IMAGE = "/images/covers/home-hero.webp";

/**
 * Homepage hero — PDF page 1 (1920×800): Natural Ceylon Gemstones.
 */
export function LandingHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-white"
      aria-labelledby="home-hero-title"
    >
      <div className="relative mx-auto w-full max-w-[1920px] min-h-[clamp(420px,41.67vw,800px)] lg:h-[800px]">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] sm:object-[70%_center] lg:object-right"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-white via-white/92 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex h-full min-h-[clamp(420px,41.67vw,800px)] items-center px-[var(--margin-mobile)] py-14 md:px-[var(--margin-desktop)] lg:h-[800px] lg:py-0">
          <div className="max-w-[560px] text-left lg:pl-[2%]">
            <Logo size="hero" />

            <p
              className="font-poppins mt-[clamp(32px,3vw,48px)] text-[clamp(13px,1vw,16px)] font-normal uppercase leading-none tracking-[0.18em]"
              style={{ color: NAVY }}
            >
              Sri Lanka&apos;s Finest Treasures
            </p>

            <h1
              id="home-hero-title"
              className="font-bell mt-[clamp(10px,1vw,14px)] text-[clamp(32px,3.8vw,58px)] font-bold uppercase leading-[1.05] tracking-[0.01em] text-left"
              style={{ color: GOLD }}
            >
              <span className="block">Natural Ceylon</span>
              <span className="block">Gemstones</span>
            </h1>

            <p
              className="font-poppins mt-[clamp(14px,1.2vw,18px)] max-w-[460px] text-[clamp(14px,1vw,16px)] font-normal leading-[1.55] text-left"
              style={{ color: NAVY }}
            >
              Exceptional natural Ceylon gemstones sourced from Sri Lanka and curated
              in Australia.
            </p>

            <div className="mt-[clamp(22px,2.2vw,32px)] flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-3">
              <Link
                href="/gemstones"
                className="font-poppins inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-none px-7 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                Explore Gemstones
              </Link>
              <Link
                href="/book"
                className="font-poppins inline-flex min-h-[48px] min-w-[250px] items-center justify-center rounded-none border px-7 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: BTN_SECONDARY, borderColor: NAVY }}
              >
                Book a Private Appointment
              </Link>
            </div>

            <p
              className="font-poppins mt-[clamp(20px,2vw,28px)] flex items-center gap-2 text-[clamp(13px,0.95vw,15px)] font-normal tracking-[0.02em]"
              style={{ color: NAVY }}
            >
              <MapPin className="h-[15px] w-[15px] shrink-0" strokeWidth={2} aria-hidden />
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
