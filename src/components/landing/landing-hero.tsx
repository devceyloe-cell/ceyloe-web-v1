import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LandingHeroBackground } from "@/components/landing/landing-hero-background";

export function LandingHero() {
  return (
    <section className="relative min-h-[calc(100vh-var(--site-header-height))] min-h-[640px] overflow-hidden bg-black text-white">
      <LandingHeroBackground />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" aria-hidden />

      <Container className="relative z-10 flex min-h-[calc(100vh-var(--site-header-height))] min-h-[640px] items-center py-16 lg:py-20">
        <div className="max-w-xl">
          <p className="font-manrope text-[11px] font-semibold uppercase tracking-[0.32em] text-rich-gold">
            Sri Lanka&apos;s Finest Treasures
          </p>

          <h1 className="font-caslon mt-6 text-[2.5rem] font-normal leading-[1.1] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
            <span className="hero-headline-glow text-white">Natural Ceylon</span>{" "}
            <span className="text-white">Gemstones</span>
          </h1>

          <p className="font-manrope mt-8 max-w-md text-[15px] leading-[1.75] text-white/90 sm:text-base">
            Exceptional gemstones sourced from Sri Lanka and curated in Australia.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/catalog"
              className="btn-stitch-gold inline-flex min-w-[200px] items-center justify-center px-8 py-4"
            >
              Explore Gemstones
            </Link>
            <Link
              href="/book"
              className="btn-stitch-ghost inline-flex min-w-[200px] items-center justify-center px-8 py-4"
            >
              Book a Private Appointment
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-manrope text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-rich-gold" strokeWidth={1.75} />
              Curated in Australia
            </span>
            <span className="text-white/35" aria-hidden>
              •
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-rich-gold" strokeWidth={1.75} />
              Sourced in Sri Lanka
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
