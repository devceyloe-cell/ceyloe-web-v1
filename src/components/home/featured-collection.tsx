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
    <section className="border-b border-border py-16 md:py-24">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.15em] text-muted">{eyebrow}</p>
            )}
            <h2 className="text-2xl font-medium tracking-tight text-heading sm:text-3xl md:text-4xl">
              {title}
            </h2>
          </div>
          <Link href={viewAllHref} className="link-arrow text-heading">
            View all →
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
