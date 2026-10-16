"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FadeIn } from "@/components/about/fade-in";
import { EducationLandingHero } from "@/components/journal/education-landing-hero";
import { educationHero } from "@/data/education-content";

interface EducationHeroProps {
  onSearchChange?: (query: string) => void;
  searchValue?: string;
  imageOverride?: string;
}

export function EducationHero({ onSearchChange, searchValue, imageOverride }: EducationHeroProps) {
  const [localQuery, setLocalQuery] = useState("");
  const query = searchValue ?? localQuery;

  const handleChange = (value: string) => {
    if (searchValue === undefined) setLocalQuery(value);
    onSearchChange?.(value);
  };

  const placeholder = useMemo(() => educationHero.searchPlaceholder, []);

  return (
    <>
      <EducationLandingHero imageOverride={imageOverride} />
      <section className="border-b border-border bg-white px-[var(--margin-mobile)] py-6 md:px-[var(--margin-desktop)] md:py-8">
        <FadeIn className="mx-auto max-w-[720px]">
          <label className="relative block">
            <span className="sr-only">Search education topics</span>
            <input
              type="search"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className="font-poppins h-12 w-full rounded-none border border-border bg-white py-3 pr-12 pl-5 text-[13px] text-[#222222] outline-none placeholder:text-[#888888] focus-visible:ring-2 focus-visible:ring-[#C89B3C]"
            />
            <Search className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#888888]" />
          </label>
        </FadeIn>
      </section>
    </>
  );
}
