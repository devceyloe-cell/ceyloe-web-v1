"use client";

import { FadeIn } from "@/components/about/fade-in";
import { SectionTitle } from "@/components/about/section-title";
import { aboutHero } from "@/data/about-content";
import { WebCoverHero } from "@/components/layout/web-cover-hero";
import { webCovers } from "@/config/web-covers";

export function AboutHero() {
  return (
    <>
      <WebCoverHero id="about-hero" {...webCovers.ourStory} />
      <section className="bg-[#0B0B0B] px-[var(--margin-mobile)] py-10 md:px-[var(--margin-desktop)] md:py-12">
        <FadeIn className="mx-auto max-w-[720px]">
          <SectionTitle
            as="h2"
            id="our-story-heading"
            title={aboutHero.title}
            tone="light"
            titleClassName="!text-[32px] md:!text-[36px]"
          />
          <p className="font-manrope mt-4 text-[14px] leading-[1.55] text-white/90 md:text-[15px]">
            {aboutHero.introduction}
          </p>
        </FadeIn>
      </section>
    </>
  );
}
