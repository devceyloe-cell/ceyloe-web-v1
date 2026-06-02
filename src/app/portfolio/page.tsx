import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { portfolioItems } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Ring Gallery & Portfolio",
  description: "Browse our custom sapphire rings and fine jewelry portfolio.",
};

export default function PortfolioPage() {
  return (
    <div className="section-bg">
      <section className="border-b border-border bg-surface-elevated py-12 md:py-16">
        <Container>
          <h1 className="font-display text-4xl font-light sm:text-5xl">Ring Gallery</h1>
          <p className="mt-4 max-w-xl text-muted">
            Explore our portfolio of custom sapphire rings and fine jewelry — each piece crafted around an exceptional natural gemstone.
          </p>
        </Container>
      </section>
      <Container className="py-12 md:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <article key={item.id} className="group overflow-hidden bg-surface">
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-elevated">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-widest text-muted">{item.category}</p>
                <h2 className="mt-1 font-display text-lg font-light">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
                {item.stone && (
                  <p className="mt-3 text-xs text-muted">{item.stone} · {item.metal}</p>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/custom-jewelry" className="text-xs uppercase tracking-widest underline-offset-4 hover:underline">
            Start your custom design →
          </Link>
        </div>
      </Container>
    </div>
  );
}
