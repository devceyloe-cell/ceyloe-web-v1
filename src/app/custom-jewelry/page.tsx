import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCardGrid } from "@/components/gemstones/category-card-grid";
import { bespokeLandingCards } from "@/data/bespoke-content";

export const metadata: Metadata = {
  title: "Bespoke Jewellery",
  description:
    "Create a one-of-a-kind jewellery piece with a natural gemstone from our collection — engagement rings, pendants, earrings and more.",
};

export default function CustomJewelryPage() {
  return (
    <div className="section-bg">
      <Container className="py-12 md:py-20">
        <SectionHeading
          eyebrow="Custom Design"
          title="Bespoke Jewellery"
          description="Create a one-of-a-kind jewellery piece with a natural gemstone from our collection. Whether you're dreaming of an engagement ring, pendant, earrings or another special piece, we'll work with you to bring your vision to life."
          align="left"
        />

        <CategoryCardGrid categories={bespokeLandingCards} />
      </Container>

      <section className="border-y border-border bg-[#f8f8f8] py-12 md:py-14">
        <Container>
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left md:gap-12">
            <div className="md:max-w-2xl">
              <h2 className="font-caslon text-2xl text-heading md:text-3xl">
                Have an idea in mind?
              </h2>
              <p className="font-manrope mt-2 text-sm leading-relaxed text-muted md:text-base">
                We&apos;re here to help you create a jewellery piece that&apos;s uniquely yours.
              </p>
            </div>

            <Link href="/book" className="btn-stitch-gold shrink-0 px-10 py-4">
              Book a Consultation
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
