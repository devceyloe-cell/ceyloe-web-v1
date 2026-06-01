import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { AboutSectionBlock } from "@/components/about/about-section-block";
import {
  aboutClosing,
  aboutPageIntro,
  aboutSections,
} from "@/data/about-content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how Ceyloe ethically sources, mines, and hand-cuts gemstones from Sri Lanka — our story, vision, and process.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-surface py-12 md:py-16">
        <Container>
          <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{aboutPageIntro.breadcrumb}</span>
          </nav>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-sapphire-light">
            {siteConfig.name}
          </p>
          <h1 className="mt-3 font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {aboutPageIntro.tagline}
          </h1>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="space-y-20 md:space-y-28">
          {aboutSections.map((section, index) => (
            <AboutSectionBlock
              key={section.id}
              section={section}
              reverse={index % 2 === 1}
            />
          ))}
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-20">
        <Container>
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted sm:text-lg">
            {aboutClosing}
          </p>
        </Container>
      </section>
    </>
  );
}
