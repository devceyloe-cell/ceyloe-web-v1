import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSiteContent } from "@/services/content-service";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story behind Ceyloe — ethically sourced gemstones from the heart of Sri Lanka.",
};

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="border-b border-border bg-surface py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="About Ceyloe"
            title="A Legacy of Excellence"
            description="We take pride and joy in knowing each gemstone we offer."
          />
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="font-display text-3xl font-light sm:text-4xl">
                {content.brandStory.title}
              </h2>
              <div className="mt-6 h-px w-16 bg-gradient-to-r from-gold to-transparent" />
              <div className="mt-8 space-y-4">
                {content.brandStory.paragraphs.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-muted sm:text-lg">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-border">
              <Image
                src={content.brandStory.image}
                alt="Ceyloe gemstone sourcing"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Our Values"
            title="What Sets Us Apart"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Direct Sourcing",
                desc: "We work directly with Sri Lankan miners, eliminating middlemen and ensuring fair compensation.",
              },
              {
                title: "Full Transparency",
                desc: "Every treatment, origin, and certification detail is disclosed — no surprises, ever.",
              },
              {
                title: "Personal Service",
                desc: "From selection to setting, our gemologists guide you through every step of your journey.",
              },
            ].map((item) => (
              <div key={item.title} className="border border-border p-8">
                <h3 className="font-display text-xl font-light text-gold">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
