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
