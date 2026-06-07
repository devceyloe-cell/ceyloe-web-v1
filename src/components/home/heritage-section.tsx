import Image from "next/image";
import Link from "next/link";
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
    <section className="relative overflow-hidden border-y border-border bg-surface-elevated">
      <Container className="relative z-10 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
            <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>

          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted">{eyebrow}</p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight text-heading sm:text-3xl md:text-4xl">
              {title}
            </h2>
            <div className="mt-6 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-sm font-light leading-relaxed text-muted sm:text-base">
                  {p}
                </p>
              ))}
            </div>
            <Link href={cta.href} className="link-arrow mt-8 text-heading">
              {cta.label} →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
