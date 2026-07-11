"use client";

import Image from "next/image";
import { FadeIn } from "@/components/about/fade-in";
import { SectionTitle } from "@/components/about/section-title";
import { aboutHero } from "@/data/about-content";

export function AboutHero() {
  return (
    <section
      className="relative overflow-hidden bg-[#0B0B0B]"
      aria-labelledby="our-story-heading"
    >
      <div className="grid lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:min-h-[480px] xl:min-h-[520px]">
        {/* Text */}
        <div className="relative z-10 flex items-center px-[var(--margin-mobile)] py-10 md:px-[var(--margin-desktop)] md:py-12 lg:py-14 lg:pr-6">
          <FadeIn className="max-w-[420px] md:max-w-[480px]">
            <SectionTitle
              as="h1"
              id="our-story-heading"
              title={aboutHero.title}
              tone="light"
              titleClassName="!text-[42px] md:!text-[46px] lg:!text-[48px]"
            />
            <p className="font-manrope mt-4 text-[14px] leading-[1.55] text-white/90 md:text-[15px]">
              {aboutHero.introduction}
            </p>
          </FadeIn>
        </div>

        {/* Photo — fills section height, left fade merges into dark panel */}
        <div className="relative h-[280px] w-full md:h-[340px] lg:h-auto lg:min-h-full">
          <Image
            src={aboutHero.image}
            alt={aboutHero.imageAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[40%] bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/65 to-transparent lg:w-[48%]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-14 bg-gradient-to-b from-[#0B0B0B] to-transparent lg:hidden"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
