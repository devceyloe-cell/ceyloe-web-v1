import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="border-y border-border bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Featured"
          title="Exceptional Gemstones"
          description="Hand-selected stones of extraordinary quality, ready for your next masterpiece."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group flex flex-col border border-border bg-background transition-all duration-300 hover:border-gold/30"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-elevated">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {product.specs.certification && (
                  <div className="absolute left-3 top-3">
            <Badge variant="sapphire">{product.specs.certification}</Badge>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs uppercase tracking-widest text-muted">
                  {product.category}
                </p>
                <h3 className="mt-1 font-display text-lg font-light text-foreground transition-colors group-hover:text-gold">
                  {product.title}
                </h3>
                {product.specs.carat && (
                  <p className="mt-1 text-sm text-muted">{product.specs.carat}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-lg font-medium text-gold">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gold transition-colors hover:text-gold-light"
          >
            View Full Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
