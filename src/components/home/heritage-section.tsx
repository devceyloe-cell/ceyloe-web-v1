import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

interface HeritageSectionProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: string;
  cta: { label: string; href: string };
}

export function HeritageSection({ eyebrow, title, paragraphs, image, cta }: HeritageSectionProps) {
  return (
    <section className="relative overflow-hidden border-y border-border bg-background">
      <Container className="relative z-10 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-background">
            <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>

          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl font-light tracking-tight text-heading sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <div className="mt-6 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted sm:text-base">
                  {p}
                </p>
              ))}
            </div>
            <Link
              href={cta.href}
              className="mt-8 inline-flex items-center gap-2 border border-border px-6 py-3 text-xs uppercase tracking-widest text-heading transition-colors hover:border-gold hover:text-gold"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
