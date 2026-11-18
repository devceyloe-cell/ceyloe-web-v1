import type { GemstoneSpec, Product } from "@/types";
import type { ProductSpecification } from "@/data/product-detail-content";
import { getCatalogHrefForCategorySubcategory } from "@/config/product-subcategories";
import { getProductShape } from "@/lib/product-utils";
import { formatProductSku } from "@/lib/product-sku";

function nonEmpty(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function buildProductSpecifications(product: Product): ProductSpecification[] {
  const { specs } = product;
  const shape = getProductShape(product);
  const sku = formatProductSku(product.sku, product.category);
  const certification = nonEmpty(specs.certification);
  const certificateNumber = nonEmpty(specs.certificateNumber);
  const certificationUrl = nonEmpty(product.certificationUrl);

  const rows: ProductSpecification[] = [
    { label: "SKU", value: sku ?? "" },
    { label: "Weight", value: nonEmpty(specs.carat) ?? "" },
    { label: "Shape", value: nonEmpty(shape) ?? "" },
    { label: "Dimensions", value: nonEmpty(specs.dimensions) ?? "" },
    { label: "Colour", value: nonEmpty(specs.color) ?? "" },
    { label: "Clarity", value: nonEmpty(specs.clarity) ?? "" },
    { label: "Treatment", value: nonEmpty(specs.treatment) ?? "" },
    { label: "Origin", value: nonEmpty(specs.origin) ?? "" },
    { label: "Certification", value: certification ?? "" },
    { label: "Certificate number", value: certificateNumber ?? "" },
    {
      label: "Certification URL",
      value: certificationUrl ? "View certificate" : "",
      href: certificationUrl,
    },
  ];

  return rows.filter((row) => Boolean(row.value));
}

export function getProductTypeLabel(product: Product): string {
  const color = product.specs.color;
  const category = product.category.replace(/-/g, " ");
  if (category.toLowerCase().includes("sapphire")) {
    return color ? `Natural ${color} Sapphire` : "Natural Sapphire";
  }
  return `Natural ${category}`.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getCategoryHref(category: string, subcategory?: string | null): string {
  if (subcategory?.trim()) {
    return getCatalogHrefForCategorySubcategory(category, subcategory);
  }
  if (category === "sapphires") return "/gemstones/sapphires";
  return `/catalog?category=${encodeURIComponent(category)}`;
}

export function getCategoryLabel(category: string): string {
  if (category === "sapphires") return "Sapphires";
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getSimilarSectionTitle(category: string): string {
  if (category === "sapphires") return "Similar Sapphires";
  return `Similar ${getCategoryLabel(category)}`;
}

/** Score products for similarity to the current gemstone. */
export function scoreSimilarProduct(current: Product, candidate: Product): number {
  if (candidate.handle === current.handle || !candidate.inStock) return -1;
  let score = 0;
  if (candidate.category === current.category) score += 5;
  if (
    current.subcategory &&
    candidate.subcategory?.toLowerCase() === current.subcategory.toLowerCase()
  ) {
    score += 4;
  } else if (
    current.specs.color &&
    candidate.specs.color?.toLowerCase() === current.specs.color.toLowerCase()
  ) {
    score += 4;
  }
  const currentShape = getProductShape(current);
  const candidateShape = getProductShape(candidate);
  if (currentShape && candidateShape?.toLowerCase() === currentShape.toLowerCase()) {
    score += 3;
  }
  if (
    current.specs.origin &&
    candidate.specs.origin?.toLowerCase() === current.specs.origin.toLowerCase()
  ) {
    score += 2;
  }
  const priceDiff = Math.abs(candidate.price - current.price) / Math.max(current.price, 1);
  if (priceDiff <= 0.35) score += 2;
  else if (priceDiff <= 0.7) score += 1;
  return score;
}

export type { GemstoneSpec };
