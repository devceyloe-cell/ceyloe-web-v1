"use client";

import { AboutContainer } from "@/components/about/about-container";
import { FadeIn } from "@/components/about/fade-in";
import { SectionTitle } from "@/components/about/section-title";
import { ImageCard } from "@/components/about/image-card";
import { aboutJourney } from "@/data/about-content";

export function AboutJourney() {
  return (
    <section
      className="bg-[#F8F6F2] py-8 md:py-10 lg:py-12"
      aria-labelledby="journey-heading"
    >
      <AboutContainer>
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8 lg:min-h-[380px] lg:max-h-[450px]">
          <FadeIn>
            <SectionTitle as="h2" id="journey-heading" title={aboutJourney.title} />
            <p className="font-manrope mt-3.5 max-w-md text-[14px] leading-[1.55] text-[#555555] md:text-[15px]">
              {aboutJourney.description}
            </p>
          </FadeIn>

          <FadeIn delay={0.06}>
            <ImageCard
              src={aboutJourney.image}
              alt={aboutJourney.imageAlt}
              className="aspect-[16/9] h-[280px] w-full shadow-[0_10px_28px_rgba(0,0,0,0.1)] md:h-[300px] lg:h-[320px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </FadeIn>
        </div>
      </AboutContainer>
    </section>
  );
}
