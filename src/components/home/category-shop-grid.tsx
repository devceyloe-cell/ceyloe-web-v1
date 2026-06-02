import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";

const accentBar = {
  sapphire: "group-hover:ring-2 group-hover:ring-primary/60",
  emerald: "group-hover:ring-2 group-hover:ring-emerald/60",
};

export function CategoryShopGrid() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <Container>
        <div className="mb-10 text-center md:mb-14">
          <h2 className="font-display text-3xl font-light tracking-tight text-heading sm:text-4xl">
            Shop by Collection
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Explore our curated gemstone categories, each representing centuries of Sri Lankan heritage.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {siteConfig.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/catalog?category=${category.slug}`}
              className={cn(
                "group relative aspect-[3/4] overflow-hidden bg-surface-elevated ring-0 transition-all",
                accentBar[category.accent],
              )}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                <h3 className="font-display text-lg font-light text-heading sm:text-xl">{category.name}</h3>
                <span className="mt-2 inline-block text-[10px] uppercase tracking-[0.2em] text-muted underline-offset-4 group-hover:text-gold group-hover:underline">
                  Shop now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
