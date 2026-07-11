"use client";

import { AboutContainer } from "@/components/about/about-container";
import { FadeIn } from "@/components/about/fade-in";
import { PrimaryButton, SecondaryButton } from "@/components/about/primary-button";
import { aboutCta } from "@/data/about-content";

export function AboutCta() {
  return (
    <section
      className="flex min-h-[220px] items-center border-t border-white/10 bg-[#080808] py-8 md:min-h-[240px] md:py-10 lg:min-h-[260px] lg:py-12"
      aria-labelledby="about-cta-heading"
    >
      <AboutContainer>
        <FadeIn className="mx-auto max-w-4xl text-center">
          <h2
            id="about-cta-heading"
            className="font-caslon whitespace-nowrap text-[clamp(1.15rem,4.2vw,2.5rem)] font-normal leading-tight !text-white"
          >
            {aboutCta.title}
          </h2>
          <p className="font-manrope mx-auto mt-2.5 max-w-xl text-[14px] leading-[1.5] text-white/85 md:text-[15px]">
            {aboutCta.description}
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
            <PrimaryButton href="/gemstones">Explore Gemstones</PrimaryButton>
            <SecondaryButton href="/book">Book Appointment</SecondaryButton>
          </div>
        </FadeIn>
      </AboutContainer>
    </section>
  );
}
