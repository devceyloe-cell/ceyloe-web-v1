import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { HomepageCollection } from "@/lib/homepage/collection";

export function LandingGemstones({ collection }: { collection: HomepageCollection }) {
  return (
    <section id="collection" className="bg-[#141414] py-10 text-white md:py-12">
      <Container>
        <div className="mb-8 px-1 text-center md:mb-12">
          <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.28em] text-rich-gold">
            {collection.eyebrow}
          </p>
          <h2 className="font-caslon mt-3 text-[1.65rem] font-normal leading-snug !text-white sm:text-2xl md:text-3xl">
            {collection.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-8">
          {collection.items.map((gem) => (
            <Link
              key={gem.id}
              href={gem.href}
              className="group flex min-w-0 flex-col items-center text-center"
            >
              <div className="relative mb-3 aspect-square w-full max-w-[160px] overflow-hidden rounded-full border border-white/10 bg-black md:mb-4 md:max-w-none">
                <Image
                  src={gem.image}
                  alt={gem.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 14vw"
                />
              </div>
              <h3 className="font-caslon max-w-[11rem] text-sm leading-snug !text-white sm:text-base md:max-w-none md:text-base">
                {gem.name}
              </h3>
              <span className="font-manrope mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-rich-gold">
                {collection.exploreLabel}
                <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
