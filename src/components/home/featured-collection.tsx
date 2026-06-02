import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { Container } from "@/components/ui/container";
import type { Product } from "@/types";

interface FeaturedCollectionProps {
  eyebrow?: string;
  title: string;
  products: Product[];
  viewAllHref: string;
}

export function FeaturedCollection({ eyebrow, title, products, viewAllHref }: FeaturedCollectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            )}
            <h2 className="font-display text-2xl font-light tracking-tight text-heading sm:text-3xl md:text-4xl">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllHref}
            className="text-xs uppercase tracking-widest text-primary underline-offset-4 hover:text-gold hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
