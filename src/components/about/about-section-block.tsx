import Image from "next/image";
import type { AboutSection } from "@/data/about-content";
import { cn } from "@/lib/utils";

interface AboutSectionBlockProps {
  section: AboutSection;
  reverse?: boolean;
}

export function AboutSectionBlock({ section, reverse = false }: AboutSectionBlockProps) {
  return (
    <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={cn(reverse && "lg:order-2")}>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
          {section.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl font-light tracking-tight text-foreground sm:text-4xl">
          {section.title}
        </h2>
        <div className="mt-5 h-px w-16 bg-gradient-to-r from-sapphire/40 via-gold to-transparent" />
        <div className="mt-8 space-y-4">
          {section.paragraphs.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-muted sm:text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {section.image && (
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden border border-border",
            reverse && "lg:order-1",
          )}
        >
          <Image
            src={section.image}
            alt={section.imageAlt ?? section.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      )}
    </article>
  );
}
