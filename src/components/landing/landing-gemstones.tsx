import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { HomepageCollection } from "@/lib/homepage/collection";

export function LandingGemstones({ collection }: { collection: HomepageCollection }) {
  const count = Math.max(collection.items.length, 1);
  const mobileCols = Math.min(count, 2);
  const tabletCols = Math.min(count, 3);
  const desktopCols = Math.min(count, 8);

  return (
    <section id="collection" className="bg-[#141414] py-10 text-white md:py-12">
      <Container className="flex flex-col items-center">
        <div className="mb-8 w-full max-w-3xl px-1 text-center md:mb-12">
          <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.28em] text-rich-gold">
            {collection.eyebrow}
          </p>
          {collection.title ? (
            <h2 className="font-caslon mx-auto mt-3 text-[1.65rem] font-normal leading-snug !text-white sm:text-2xl md:text-3xl">
              {collection.title}
            </h2>
          ) : null}
        </div>

        <style>{`
          #collection .collection-grid {
            display: grid;
            width: 100%;
            justify-items: center;
            column-gap: 1rem;
            row-gap: 2rem;
            grid-template-columns: repeat(${mobileCols}, minmax(0, 1fr));
          }
          @media (min-width: 640px) {
            #collection .collection-grid {
              column-gap: 1.25rem;
              row-gap: 2.5rem;
              grid-template-columns: repeat(${tabletCols}, minmax(0, 1fr));
            }
          }
          @media (min-width: 1024px) {
            #collection .collection-grid {
              column-gap: 1.5rem;
              row-gap: 2rem;
              grid-template-columns: repeat(${desktopCols}, minmax(0, 1fr));
            }
          }
        `}</style>

        <div className="collection-grid mx-auto">
          {collection.items.map((gem) => (
            <Link
              key={gem.id}
              href={gem.href}
              className="group flex w-full min-w-0 max-w-[11.5rem] flex-col items-center justify-center text-center"
            >
              <div className="relative mx-auto mb-3 aspect-square w-full max-w-[160px] overflow-hidden rounded-full border border-white/10 bg-black md:mb-4">
                <Image
                  src={gem.image}
                  alt={gem.name}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 14vw"
                />
              </div>
              <h3 className="font-caslon mx-auto max-w-[11rem] text-center text-sm leading-snug !text-white sm:text-base">
                {gem.name}
              </h3>
              <span className="font-manrope mx-auto mt-2 inline-flex items-center justify-center gap-1 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-rich-gold">
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
