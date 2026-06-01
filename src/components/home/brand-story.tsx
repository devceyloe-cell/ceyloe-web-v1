import Image from "next/image";
import { Container } from "@/components/ui/container";
import type { BrandStory } from "@/types";

interface BrandStorySectionProps {
  content: BrandStory;
}

export function BrandStorySection({ content }: BrandStorySectionProps) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden border border-border">
            <Image
              src={content.image}
              alt={content.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Our Heritage
            </p>
            <h2 className="font-display text-3xl font-light tracking-tight sm:text-4xl md:text-5xl">
              {content.title}
            </h2>
            <div className="mt-6 h-px w-16 bg-gradient-to-r from-gold to-transparent" />
            <div className="mt-8 space-y-4">
              {content.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-muted sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
