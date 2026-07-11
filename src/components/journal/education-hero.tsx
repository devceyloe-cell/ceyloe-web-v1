"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { FadeIn } from "@/components/about/fade-in";
import { educationHero } from "@/data/education-content";

interface EducationHeroProps {
  onSearchChange?: (query: string) => void;
  searchValue?: string;
}

export function EducationHero({ onSearchChange, searchValue }: EducationHeroProps) {
  const [localQuery, setLocalQuery] = useState("");
  const query = searchValue ?? localQuery;

  const handleChange = (value: string) => {
    if (searchValue === undefined) setLocalQuery(value);
    onSearchChange?.(value);
  };

  const placeholder = useMemo(() => educationHero.searchPlaceholder, []);

  return (
    <section
      className="relative overflow-hidden bg-[#0B0B0B]"
      aria-labelledby="education-heading"
    >
      <div className="grid lg:min-h-[420px] lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] xl:min-h-[460px]">
        <div className="relative z-10 flex items-center px-[var(--margin-mobile)] py-10 md:px-[var(--margin-desktop)] md:py-12 lg:py-14 lg:pr-4">
          <FadeIn className="w-full max-w-[480px]">
            <h1
              id="education-heading"
              className="font-caslon text-[36px] font-normal leading-[1.15] !text-white md:text-[42px] lg:text-[46px]"
            >
              {educationHero.title}
            </h1>
            <div className="mt-3 h-px w-10 bg-[#C89B3C]" aria-hidden />
            <p className="font-manrope mt-4 max-w-[420px] text-[14px] leading-[1.55] text-white/88 md:text-[15px]">
              {educationHero.description}
            </p>

            <label className="relative mt-7 block max-w-[420px]">
              <span className="sr-only">Search education topics</span>
              <input
                type="search"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                className="font-manrope h-12 w-full rounded-full border-0 bg-white py-3 pr-12 pl-5 text-[13px] text-[#222222] shadow-sm outline-none placeholder:text-[#888888] focus-visible:ring-2 focus-visible:ring-[#C89B3C]"
              />
              <Search
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#888888]"
                strokeWidth={1.75}
                aria-hidden
              />
            </label>
          </FadeIn>
        </div>

        <div className="relative h-[260px] w-full md:h-[320px] lg:h-auto lg:min-h-full">
          <Image
            src={educationHero.image}
            alt={educationHero.imageAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 54vw"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[42%] bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/70 to-transparent lg:w-[50%]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 bg-gradient-to-b from-[#0B0B0B] to-transparent lg:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-[#0B0B0B]/40 to-transparent lg:hidden"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
