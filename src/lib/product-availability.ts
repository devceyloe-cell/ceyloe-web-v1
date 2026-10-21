import type { Product, ProductAvailability } from "@/types";

export const PRODUCT_AVAILABILITY_OPTIONS: {
  value: ProductAvailability;
  label: string;
}[] = [
  { value: "available", label: "Available" },
  { value: "sold_out", label: "Sold out" },
  { value: "hold", label: "Hold" },
];

export function normalizeAvailability(
  value: unknown,
  inStock?: boolean,
): ProductAvailability {
  if (value === "available" || value === "sold_out" || value === "hold") {
    return value;
  }
  if (typeof inStock === "boolean") {
    return inStock ? "available" : "sold_out";
  }
  return "available";
}

export function getProductAvailability(product: Pick<Product, "availability" | "inStock">): ProductAvailability {
  return normalizeAvailability(product.availability, product.inStock);
}

export function isProductPurchasable(product: Pick<Product, "availability" | "inStock">): boolean {
  return getProductAvailability(product) === "available";
}

export function withSyncedAvailability(
  product: Product,
  availability: ProductAvailability,
): Product {
  return {
    ...product,
    availability,
    inStock: availability === "available",
  };
}

export function availabilityLabel(status: ProductAvailability): string {
  switch (status) {
    case "sold_out":
      return "Sold out";
    case "hold":
      return "Hold";
    default:
      return "Available";
  }
}
