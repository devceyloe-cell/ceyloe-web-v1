import Image from "next/image";
import { Container } from "@/components/ui/container";
import { HeroTypingText } from "@/components/home/hero-typing-text";
import { stitchImages } from "@/config/stitch-images";

const HERO_EYEBROW = "Fine Ceylon Gemstones & Custom Creations";

export function StitchHero() {
  return (
    <section className="relative min-h-screen min-h-[700px] overflow-hidden">
      <Image
        src={stitchImages.hero}
        alt="Handcrafted gold ring with moss agate on velvet"
        fill
        unoptimized
        className="object-cover object-right"
        priority
        sizes="100vw"
      />

      {/* Light left vignette — keeps text readable without darkening the whole image */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

      <Container className="relative z-10 flex min-h-screen min-h-[700px] items-center py-28">
        <div className="max-w-xl text-white">
          <HeroTypingText text={HERO_EYEBROW} />

          <h1 className="hero-headline-glow font-caslon mt-5 text-[2.25rem] font-normal leading-[1.2] tracking-[-0.02em] text-white sm:text-5xl sm:leading-[1.15] lg:text-[3.25rem]">
            Crafted for Those Who{" "}
            <span className="italic">Appreciate Rarity</span>
          </h1>

          <div className="mt-7 h-px w-14 bg-white/35" aria-hidden />

          <p className="font-manrope mt-8 max-w-md text-[15px] leading-[1.75] text-white/90 sm:text-base">
            From breathtaking sapphires to handcrafted jewellery, we offer timeless treasures
            designed to reflect your unique style. Explore our collection or create a bespoke
            masterpiece that will be cherished for generations.
          </p>
        </div>
      </Container>
    </section>
  );
}
