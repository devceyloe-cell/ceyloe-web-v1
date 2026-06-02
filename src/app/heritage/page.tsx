import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { images } from "@/config/images";
import { aboutSections } from "@/data/about-content";

export const metadata: Metadata = {
  title: "Sri Lankan Heritage",
  description: "The story of Ceyloe — from ancient gem mining traditions to modern ethical sourcing.",
};

export default function HeritagePage() {
  return (
    <div className="section-bg">
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <Image src={images.about.main} alt="Sri Lankan heritage" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <Container className="relative z-10 pb-16 pt-32">
          <p className="text-xs uppercase tracking-[0.25em] text-white/70">Gemstones are our heritage</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-light text-white sm:text-5xl md:text-6xl">
            Two Thousand Years of Sri Lankan Gem Craft
          </h1>
        </Container>
      </section>
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-muted">
          <p>
            Sri Lanka — historically known as Ratna Deepa, the Island of Gems — has produced some of the world&apos;s
            finest sapphires for over two millennia. Kings, traders, and collectors have sought Ceylon stones for
            their exceptional colour, clarity, and durability.
          </p>
          <p>
            At Ceyloe, this heritage is not just history — it is our daily practice. Our mining and production team
            in Minuwangoda works directly with local miners, while our head office in Kalgoorlie, Australia serves
            clients worldwide with full transparency.
          </p>
        </div>
        <div className="mt-20 space-y-20">
          {aboutSections.map((section) => (
            <article key={section.id} className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">{section.eyebrow}</p>
                <h2 className="mt-3 font-display text-2xl font-light sm:text-3xl">{section.title}</h2>
                <div className="mt-6 space-y-4">
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted">{p}</p>
                  ))}
                </div>
              </div>
              {section.image && (
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
                  <Image src={section.image} alt={section.title} fill className="object-cover" sizes="50vw" />
                </div>
              )}
            </article>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/transparency" className="text-xs uppercase tracking-widest underline-offset-4 hover:underline">
            Learn about our mine-to-market process →
          </Link>
        </div>
      </Container>
    </div>
  );
}
