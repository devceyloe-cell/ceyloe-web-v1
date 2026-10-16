"use client";

import { useMemo, useState } from "react";
import { FadeIn, Stagger, StaggerItem } from "@/components/about/fade-in";
import { EducationCard } from "@/components/journal/education-card";
import { EducationHero } from "@/components/journal/education-hero";
import { EducationCta } from "@/components/journal/education-cta";
import { educationTopics } from "@/data/education-content";

export function EducationPage({ imageOverride }: { imageOverride?: string }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return educationTopics;
    return educationTopics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="bg-[#F7F4EF]">
      <EducationHero searchValue={query} onSearchChange={setQuery} imageOverride={imageOverride} />

      <section
        id="education-topics"
        className="scroll-mt-28 px-[var(--margin-mobile)] py-12 md:px-[var(--margin-desktop)] md:py-14 lg:py-16"
      >
        <div className="mx-auto max-w-[1280px]">
          {filtered.length === 0 ? (
            <FadeIn className="py-16 text-center">
              <p className="font-manrope text-[15px] text-[#555555]">
                No topics match “{query}”. Try another search.
              </p>
            </FadeIn>
          ) : (
            <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-9">
              {filtered.map((topic) => (
                <StaggerItem key={topic.id}>
                  <EducationCard topic={topic} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      <EducationCta />
    </div>
  );
}
