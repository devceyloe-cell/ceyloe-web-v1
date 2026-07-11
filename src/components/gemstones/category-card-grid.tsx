import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GemstoneCategoryCard } from "@/data/gemstone-categories";
import { cn } from "@/lib/utils";

interface CategoryCardGridProps {
  categories: GemstoneCategoryCard[];
  /** Button label on each card. Defaults to "Explore". */
  ctaLabel?: string;
}

export function CategoryCardGrid({ categories, ctaLabel = "Explore" }: CategoryCardGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => {
        const shortEyebrow =
          category.description && category.description.length <= 60 && !category.description.includes(".");

        return (
          <Link
            key={category.id}
            href={category.href}
            className={cn(
              "group relative min-h-[280px] overflow-hidden bg-[#2a2a2a] md:min-h-[320px]",
              category.featured && "sm:col-span-2 xl:col-span-1",
            )}
          >
            <Image
              src={category.image}
              alt={`${category.title} collection`}
              fill
              className="object-cover opacity-95 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent transition-colors duration-500 group-hover:from-black/65 group-hover:via-black/25" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              {shortEyebrow && (
                <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.2em] text-rich-gold">
                  {category.description}
                </p>
              )}
              <h2
                className={cn(
                  "font-caslon text-2xl !text-white md:text-3xl",
                  shortEyebrow && "mt-2",
                )}
              >
                {category.title}
              </h2>
              {category.description && !shortEyebrow && (
                <p className="font-manrope mt-3 max-w-sm text-sm leading-relaxed !text-white/95">
                  {category.description}
                </p>
              )}
              <span className="label-caps mt-4 inline-flex items-center gap-2 !text-rich-gold transition-all duration-300 group-hover:gap-3">
                {ctaLabel}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="pointer-events-none absolute inset-3 border border-white/0 transition-colors duration-500 group-hover:border-white/20" />
          </Link>
        );
      })}
    </div>
  );
}
