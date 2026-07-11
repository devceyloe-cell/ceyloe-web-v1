"use client";

import Image from "next/image";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/fade-in";
import { SectionTitle } from "@/components/about/section-title";
import { ValueCard } from "@/components/about/value-card";
import { aboutValues, aboutValuesImage } from "@/data/about-content";

export function AboutValues() {
  return (
    <section
      className="relative overflow-hidden bg-[#080808]"
      aria-labelledby="values-heading"
    >
      <div className="relative grid lg:min-h-[420px] lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] xl:min-h-[460px]">
        {/* Image — flush left corner, fades out into dark */}
        <div className="relative h-[280px] w-full md:h-[340px] lg:h-auto lg:min-h-full">
          <Image
            src={aboutValuesImage.src}
            alt={aboutValuesImage.alt}
            fill
            loading="lazy"
            className="object-cover object-[center_28%]"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          {/* Soft left vignette so the corner feels grounded */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[18%] bg-gradient-to-r from-[#080808]/35 to-transparent"
            aria-hidden
          />
          {/* Primary fade — right edge dissolves into section */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[50%] bg-gradient-to-l from-[#080808] via-[#080808]/80 to-transparent lg:w-[58%]"
            aria-hidden
          />
          {/* Mobile stack fades */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 bg-gradient-to-t from-[#080808] to-transparent lg:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 bg-gradient-to-b from-[#080808] to-transparent lg:hidden"
            aria-hidden
          />
        </div>

        {/* Title + values */}
        <div className="relative z-10 flex flex-col justify-center px-[var(--margin-mobile)] py-10 md:px-[var(--margin-desktop)] md:py-12 lg:py-14 lg:pl-4 lg:pr-[var(--margin-desktop)]">
          <FadeIn>
            <SectionTitle
              as="h2"
              id="values-heading"
              title="Our Values"
              align="center"
              tone="light"
            />
          </FadeIn>

          <Stagger className="mt-8 grid w-full grid-cols-1 gap-8 sm:mt-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
            {aboutValues.map((value, index) => (
              <StaggerItem key={value.id} className="h-full">
                <ValueCard
                  title={value.title}
                  description={value.description}
                  icon={value.icon}
                  showDivider={index > 0}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
