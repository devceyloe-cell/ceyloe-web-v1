"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/about/fade-in";
import { educationCta } from "@/data/education-content";

export function EducationCta() {
  return (
    <section
      className="relative overflow-hidden bg-[#0B0B0B]"
      aria-labelledby="education-cta-heading"
    >
      <div className="grid lg:min-h-[300px] lg:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)] xl:min-h-[320px]">
        <div className="relative z-10 flex items-center px-[var(--margin-mobile)] py-10 md:px-[var(--margin-desktop)] md:py-12 lg:py-14 lg:pr-6">
          <FadeIn className="max-w-[440px]">
            <h2
              id="education-cta-heading"
              className="font-caslon text-[32px] font-normal leading-tight !text-white md:text-[36px]"
            >
              {educationCta.title}
            </h2>
            <p className="font-manrope mt-3 text-[14px] leading-[1.55] text-white/85 md:text-[15px]">
              {educationCta.description}
            </p>
            <Link
              href={educationCta.buttonHref}
              className="font-manrope mt-6 inline-flex h-12 items-center justify-center gap-2 bg-[#C89B3C] px-8 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:scale-[1.03] hover:bg-[#B8872F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]"
            >
              {educationCta.buttonLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>

        <div className="relative h-[240px] w-full md:h-[280px] lg:h-auto lg:min-h-full">
          <Image
            src={educationCta.image}
            alt={educationCta.imageAlt}
            fill
            loading="lazy"
            className="object-cover object-[center_40%]"
            sizes="(max-width: 1024px) 100vw, 48vw"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[48%] bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/75 to-transparent lg:w-[55%]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 bg-gradient-to-b from-[#0B0B0B] to-transparent lg:hidden"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
