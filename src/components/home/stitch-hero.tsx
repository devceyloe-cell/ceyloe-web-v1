import Link from "next/link";
import { Container } from "@/components/ui/container";
import { HeroTypingText } from "@/components/home/hero-typing-text";
import { StitchHeroBackground } from "@/components/home/stitch-hero-background";

const HERO_EYEBROW = "Fine Ceylon Gemstones & Custom Creations";

export function StitchHero() {
  return (
    <section className="relative min-h-screen min-h-[700px] overflow-hidden bg-black">
      <StitchHeroBackground />

      {/* Light left vignette — keeps text readable without darkening the whole image */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

      <Container className="relative z-10 flex min-h-screen min-h-[700px] items-center py-28">
        <div className="max-w-xl text-white">
          <HeroTypingText text={HERO_EYEBROW} />

          <h1 className="hero-headline-glow font-caslon mt-5 text-[2.25rem] font-normal leading-[1.2] tracking-[-0.02em] text-white sm:text-5xl sm:leading-[1.15] lg:text-[3.25rem]">
            Rare by Nature.{" "}
            <span className="italic">Treasured for Generations.</span>
          </h1>

          <div className="mt-7 h-px w-14 bg-white/35" aria-hidden />

          <p className="font-manrope mt-8 max-w-md text-[15px] leading-[1.75] text-white/90 sm:text-base">
            From our family-owned mines in Sri Lanka to your collection, discover exceptional
            natural gemstones and bespoke jewellery designed to become tomorrow&apos;s heirlooms.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="/catalog" className="btn-stitch-gold inline-flex items-center justify-center px-10 py-4 text-center sm:min-w-[220px]">
              Explore Gemstone
            </Link>
            <Link
              href="/book"
              className="btn-stitch-ghost inline-flex items-center justify-center px-10 py-4 text-center sm:min-w-[220px]"
            >
              Book a Private Viewing
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
