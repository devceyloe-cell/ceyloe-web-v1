import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";

export function CategoryShopGrid() {
  return (
    <section className="bg-surface py-16 md:py-24">
      <Container>
        <div className="mb-10 text-center md:mb-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
            Explore Collections
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight text-heading sm:text-3xl md:text-4xl">
            Shop by Gemstone
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {siteConfig.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/catalog?category=${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-surface-elevated"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                <h3 className="text-base font-medium text-white sm:text-lg">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
