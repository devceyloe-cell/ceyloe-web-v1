import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { faqItems } from "@/data/faq-content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Ceyloe gemstones, shipping, custom jewellery, ethical sourcing, and returns.",
};

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-border bg-surface py-12 md:py-16">
        <Container>
          <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">FAQ</span>
          </nav>
          <h1 className="font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Answers about ordering, shipping, custom jewellery, and our ethically sourced
            gemstones from {siteConfig.name}.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="max-w-4xl">
          <FaqAccordion items={faqItems} />
          <p className="mt-10 text-center text-sm text-muted">
            Still have questions?{" "}
            <Link href="/contact" className="text-gold hover:underline">
              Contact us
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
