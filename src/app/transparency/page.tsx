import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

const steps = [
  {
    step: "01",
    title: "Ethical Mining",
    description:
      "Gemstones are extracted through traditional pit mining in Sri Lanka's gem-bearing gravels. We work directly with miners, ensuring fair wages and responsible practices.",
  },
  {
    step: "02",
    title: "Sorting & Grading",
    description:
      "At our Minuwangoda production office, rough stones are sorted, graded, and assessed for colour, clarity, and potential cut yield.",
  },
  {
    step: "03",
    title: "Precision Cutting",
    description:
      "Master cutters shape each stone to maximise brilliance and colour. Treatment history is documented at every stage.",
  },
  {
    step: "04",
    title: "Independent Certification",
    description:
      "Premium stones are sent to GIA or equivalent laboratories for independent grading, confirming authenticity and treatment disclosure.",
  },
  {
    step: "05",
    title: "Photography & Listing",
    description:
      "Each gemstone is photographed in natural light — as close as possible to how it appears in person — before being listed for sale.",
  },
  {
    step: "06",
    title: "Secure Delivery",
    description:
      "Insured, tracked shipping from our Kalgoorlie head office to clients worldwide, with full documentation included.",
  },
];

export const metadata: Metadata = {
  title: "Mine to Market Transparency",
  description: "Follow the journey of a Ceyloe gemstone from Sri Lankan mines to your collection.",
};

export default function TransparencyPage() {
  return (
    <div className="section-bg">
      <section className="border-b border-border bg-surface-elevated py-12 md:py-16">
        <Container>
          <h1 className="font-display text-4xl font-light sm:text-5xl">Mine to Market</h1>
          <p className="mt-4 max-w-xl text-muted">
            Full transparency at every step — from {siteConfig.contact.miningOffice.lines[2]} to your door.
          </p>
        </Container>
      </section>
      <Container className="py-16 md:py-24">
        <div className="space-y-12">
          {steps.map((item) => (
            <div key={item.step} className="grid gap-6 border-b border-border pb-12 md:grid-cols-[80px_1fr]">
              <span className="font-display text-3xl font-light text-muted">{item.step}</span>
              <div>
                <h2 className="font-display text-2xl font-light">{item.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-6">
          <Link href="/certifications" className="text-xs uppercase tracking-widest underline-offset-4 hover:underline">
            Our certifications →
          </Link>
          <Link href="/heritage" className="text-xs uppercase tracking-widest underline-offset-4 hover:underline">
            Sri Lankan heritage →
          </Link>
        </div>
      </Container>
    </div>
  );
}
