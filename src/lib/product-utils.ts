import type { Product } from "@/types";

export function parseCaratWeight(carat?: string): number | undefined {
  if (!carat) return undefined;
  const match = carat.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : undefined;
}

export function getProductCaratWeight(product: Product): number | undefined {
  return product.specs.caratWeight ?? parseCaratWeight(product.specs.carat);
}

export function getProductShape(product: Product): string | undefined {
  return product.specs.shape ?? product.specs.cut;
}

export function getFilterOptions(products: Product[]) {
  const colors = new Set<string>();
  const shapes = new Set<string>();
  const origins = new Set<string>();

  for (const p of products) {
    if (p.specs.color) colors.add(p.specs.color);
    const shape = getProductShape(p);
    if (shape) shapes.add(shape);
    if (p.specs.origin) origins.add(p.specs.origin);
  }

  return {
    colors: [...colors].sort(),
    shapes: [...shapes].sort(),
    origins: [...origins].sort(),
  };
}

export type CatalogBounds = {
  minPrice: number;
  maxPrice: number;
  minCarat: number;
  maxCarat: number;
};

/** Min/max price and carat from the current product selection. */
export function getCatalogBounds(products: Product[]): CatalogBounds | null {
  if (products.length === 0) return null;

  let minPrice = Infinity;
  let maxPrice = -Infinity;
  let minCarat = Infinity;
  let maxCarat = -Infinity;
  let hasCarat = false;

  for (const p of products) {
    if (Number.isFinite(p.price)) {
      minPrice = Math.min(minPrice, p.price);
      maxPrice = Math.max(maxPrice, p.price);
    }
    const carat = getProductCaratWeight(p);
    if (carat !== undefined && Number.isFinite(carat)) {
      hasCarat = true;
      minCarat = Math.min(minCarat, carat);
      maxCarat = Math.max(maxCarat, carat);
    }
  }

  if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) return null;

  return {
    minPrice: Math.floor(minPrice),
    maxPrice: Math.ceil(maxPrice),
    minCarat: hasCarat ? Math.floor(minCarat * 100) / 100 : 0,
    maxCarat: hasCarat ? Math.ceil(maxCarat * 100) / 100 : 0,
  };
}
