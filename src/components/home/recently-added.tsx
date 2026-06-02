import { ProductCard } from "@/components/catalog/product-card";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import type { Product } from "@/types";

interface RecentlyAddedProps {
  products: Product[];
}

export function RecentlyAdded({ products }: RecentlyAddedProps) {
  if (products.length === 0) return null;

  return (
    <section className="section-bg-alt py-16 md:py-24">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Just arrived</p>
            <h2 className="font-display text-2xl font-light tracking-tight sm:text-3xl md:text-4xl">
              Recently Added Gems
            </h2>
          </div>
          <Link href="/catalog?sort=newest" className="text-xs uppercase tracking-widest underline-offset-4 hover:underline">
            View all new arrivals
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
