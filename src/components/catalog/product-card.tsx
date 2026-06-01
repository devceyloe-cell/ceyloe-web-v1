import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col border border-border bg-surface transition-all duration-300 hover:border-gold/30"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-elevated">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.specs.certification && (
          <div className="absolute left-3 top-3">
            <Badge variant="sapphire">{product.specs.certification}</Badge>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="text-xs uppercase tracking-widest text-muted">Sold</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-widest text-muted">{product.category}</p>
        <h3 className="mt-1 font-display text-base font-light text-foreground transition-colors group-hover:text-gold sm:text-lg">
          {product.title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.specs.carat && (
            <span className="text-xs text-muted">{product.specs.carat}</span>
          )}
          {product.specs.color && (
            <span className="text-xs text-muted">&middot; {product.specs.color}</span>
          )}
        </div>
        <p className="mt-auto pt-4 text-lg font-medium text-gold">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
