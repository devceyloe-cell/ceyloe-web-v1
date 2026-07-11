"use client";

import { FadeIn } from "@/components/about/fade-in";
import { PrimaryButton, SecondaryButton } from "@/components/about/primary-button";
import { contactCta } from "@/data/contact-content";

export function ContactCta() {
  return (
    <section
      className="border-t border-white/10 bg-[#080808] px-[var(--margin-mobile)] py-12 md:px-[var(--margin-desktop)] md:py-14 lg:py-16"
      aria-labelledby="contact-cta-heading"
    >
      <FadeIn className="mx-auto max-w-3xl text-center">
        <h2
          id="contact-cta-heading"
          className="font-caslon text-[clamp(1.35rem,3.8vw,2.35rem)] font-normal leading-tight !text-white"
        >
          {contactCta.title}
        </h2>
        <p className="font-manrope mx-auto mt-3 max-w-xl text-[14px] leading-[1.55] text-white/85 md:text-[15px]">
          {contactCta.description}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryButton href="/gemstones">Explore Gemstones</PrimaryButton>
          <SecondaryButton href="/book">Book Appointment</SecondaryButton>
        </div>
      </FadeIn>
    </section>
  );
}
