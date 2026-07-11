import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { howItWorksSteps } from "@/data/bespoke-content";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how Ceyloe creates your custom jewellery — from gemstone selection to the finished piece.",
};

export default function HowItWorksPage() {
  return (
    <div className="section-bg">
      <Container className="py-12 md:py-20">
        <Link
          href="/custom-jewelry"
          className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Bespoke Jewellery
        </Link>

        <SectionHeading
          eyebrow="Bespoke Process"
          title="How It Works"
          description="From gemstone selection to the finished piece, we guide you through every step of creating jewellery that is uniquely yours."
          align="left"
        />

        <ol className="space-y-8 md:space-y-10">
          {howItWorksSteps.map((item) => (
            <li
              key={item.step}
              className="grid gap-4 border-t border-border pt-8 md:grid-cols-[120px_1fr] md:gap-10"
            >
              <p className="font-manrope text-sm font-semibold uppercase tracking-[0.2em] text-rich-gold">
                Step {item.step}
              </p>
              <div>
                <h2 className="font-caslon text-2xl text-heading md:text-3xl">{item.title}</h2>
                <p className="font-manrope mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-manrope text-sm text-muted">
            Ready to begin? Choose a gemstone or book a consultation.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gemstones"
              className="btn-stitch-ghost inline-flex items-center gap-2 px-6 py-3"
            >
              Choose Your Gemstone
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/book" className="btn-stitch-gold inline-flex px-6 py-3">
              Book a Consultation
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
