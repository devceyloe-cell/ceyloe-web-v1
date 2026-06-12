import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { stitchImages } from "@/config/stitch-images";

const features = [
  {
    icon: "diamond",
    title: "Unrivalled Selection",
    text: "Choose from our exclusive design catalogue or create a unique concept.",
  },
  {
    icon: "edit_note",
    title: "Expert Curation",
    text: "Direct sourcing ensures you get the finest quality gemstones at the best value.",
  },
];

export function StitchBespoke() {
  return (
    <section className="bespoke-section relative overflow-hidden bg-deep-navy py-[var(--section-padding)] text-white">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <Image
          src={stitchImages.bespokeBg}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden
        />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-caslon mb-8 text-4xl italic md:text-5xl">
              CUSTOM <span className="not-italic">Made For You</span>
            </h2>

            <p className="mb-10 max-w-lg text-base leading-relaxed text-surface-dim md:text-lg">
              In an act of rebellion against the sea-of-same, we&apos;re fiercely passionate about connecting
              you with your very own piece of the extraordinary. Bespoke is the ultimate statement of style and
              personality.
            </p>

            <div className="mb-12 space-y-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <span className="material-symbols-outlined shrink-0 text-rich-gold">{feature.icon}</span>
                  <div>
                    <h4 className="label-caps mb-1 text-pale-gold">{feature.title}</h4>
                    <p className="text-sm text-surface-dim">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/custom-jewelry" className="btn-stitch-gold inline-block px-10 py-5">
              Start Your Journey
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="aspect-square border border-white/10 bg-white/5 p-1 backdrop-blur-md">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={stitchImages.bespokeRing}
                  alt="Custom gemstone ring handcrafted by Ceyloe"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                />
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 hidden h-40 w-40 border-b border-r border-rich-gold/40 md:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}
