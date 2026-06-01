import { mockProducts } from "@/data/mock/products";
import { isShopifyConfigured } from "@/config/env";
import {
  fetchShopifyProductByHandle,
  fetchShopifyProducts,
} from "@/lib/shopify/products";
import type { CatalogFilters, Product } from "@/types";

function applyFilters(products: Product[], filters: CatalogFilters): Product[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "featured":
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
    default:
      break;
  }

  return result;
}

export async function getProducts(filters: CatalogFilters = {}): Promise<Product[]> {
  let products: Product[];

  if (isShopifyConfigured()) {
    products = await fetchShopifyProducts();
  } else {
    products = mockProducts;
  }

  return applyFilters(products, filters);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (isShopifyConfigured()) {
    const product = await fetchShopifyProductByHandle(handle);
    if (product) return product;
  }

  return mockProducts.find((p) => p.handle === handle) ?? null;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await getProducts({ sort: "featured" });
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getProductCategories(): Promise<string[]> {
  const products = await getProducts();
  return [...new Set(products.map((p) => p.category))];
}
