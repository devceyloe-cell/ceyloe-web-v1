import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function CategoryShowcase() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Our Designs"
          title="Curated Collections"
          description="Explore our finest gemstone categories, each representing centuries of Sri Lankan heritage."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {siteConfig.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/catalog?category=${category.slug}`}
              className="group relative overflow-hidden border border-border bg-surface transition-all duration-500 hover:border-gold/40"
            >
              <div className="aspect-square overflow-hidden bg-surface-elevated">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="border-t border-border p-4 text-center">
                <h3 className="text-sm font-medium uppercase tracking-widest text-foreground transition-colors group-hover:text-gold">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
