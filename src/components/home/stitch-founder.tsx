import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { stitchImages } from "@/config/stitch-images";

export function StitchFounder() {
  return (
    <section className="overflow-hidden bg-stone-gray py-[var(--section-padding)]">
      <Container>
        <div className="grid items-center gap-14 md:gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-28">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-gray sm:aspect-[3/2] lg:aspect-[4/3]">
            <Image
              src={stitchImages.founder}
              alt="Fine Ceylon gemstone on gemology reference book with expert inspection"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
            <div className="absolute bottom-6 left-6 z-10 border border-rich-gold/60 bg-white/95 px-5 py-3 shadow-lg backdrop-blur-sm md:bottom-8 md:left-8">
              <p className="font-manrope text-[10px] font-bold uppercase tracking-[0.12em] text-rich-gold">
                Since 1985
              </p>
              <p className="mt-0.5 font-caslon text-base italic text-deep-navy">Ceylon gemstone heritage</p>
            </div>
          </div>

          <div className="w-full max-w-xl lg:max-w-none lg:pl-4 xl:pl-8">
            <p className="subheading-caps tracking-[0.28em] text-rich-gold">The Curator</p>

            <h2 className="font-caslon mt-5 text-4xl leading-tight md:text-5xl lg:mt-6 lg:text-[3.25rem]">
              MEET <span className="italic text-rich-gold">Our Heritage</span>
            </h2>

            <div className="mt-8 h-px w-16 bg-rich-gold" />

            <blockquote className="mt-10 border-l-2 border-rich-gold/50 pl-6 font-caslon text-xl italic leading-relaxed text-on-surface-variant md:text-2xl">
              &ldquo;Every individual deserves a piece of the Earth&apos;s history that reflects their unique
              soul.&rdquo;
            </blockquote>

            <p className="mt-10 text-base leading-relaxed text-on-surface-variant md:text-lg">
              Combining deep knowledge of gemstones, direct-to-source purchasing, and a truly custom design
              process, Ceyloe connects Sri Lankan heritage with collectors worldwide — from our mining office in
              Minuwangoda to our head office in Kalgoorlie.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link href="/book" className="btn-stitch-gold inline-flex items-center gap-2">
                Book a Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/heritage"
                className="font-manrope text-xs font-bold uppercase tracking-[0.1em] text-deep-navy underline decoration-rich-gold decoration-2 underline-offset-4 transition-colors hover:text-rich-gold"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
