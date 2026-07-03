import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { images } from "@/config/images";

export function LandingStory() {
  return (
    <section className="bg-[#f8f8f8] py-[var(--section-padding)]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:pr-8">
            <p className="font-manrope text-[11px] font-semibold uppercase tracking-[0.28em] text-rich-gold">
              Our Story
            </p>
            <h2 className="font-caslon mt-4 text-4xl font-normal leading-tight text-heading md:text-5xl">
              A Legacy of Passion and <span className="italic text-rich-gold">Integrity</span>
            </h2>
            <div className="mt-6 h-px w-14 bg-rich-gold/60" />

            <p className="font-manrope mt-8 text-base leading-relaxed text-muted">
              For decades, Ceyloe has connected Sri Lanka&apos;s finest gemstone heritage with
              collectors and jewellers across the world. From our mining office in Minuwangoda to
              our head office in Kalgoorlie, we uphold transparency, expertise, and a deep respect
              for the earth&apos;s rarest treasures.
            </p>

            <Link
              href="/about"
              className="font-manrope mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-rich-gold transition-colors hover:text-heading"
            >
              Read Our Story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-gray">
            <Image
              src={images.about.main}
              alt="Sri Lankan landscape — Ceyloe gemstone heritage"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
