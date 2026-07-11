"use client";

import { FadeIn } from "@/components/about/fade-in";
import { SectionTitle } from "@/components/about/section-title";
import { contactHero } from "@/data/contact-content";

export function ContactHero() {
  return (
    <section
      className="relative overflow-hidden bg-[#0B0B0B]"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-[1280px] px-[var(--margin-mobile)] py-12 md:px-[var(--margin-desktop)] md:py-14 lg:py-16">
        <FadeIn className="mx-auto max-w-[640px] text-center">
          <SectionTitle
            as="h1"
            id="contact-heading"
            title={contactHero.title}
            align="center"
            tone="light"
            titleClassName="!text-[40px] md:!text-[46px] lg:!text-[48px]"
          />
          <p className="font-manrope mt-5 text-[14px] leading-[1.6] text-white/88 md:text-[15px]">
            {contactHero.introduction}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
