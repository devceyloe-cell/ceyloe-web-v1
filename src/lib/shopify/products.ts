import { isShopifyConfigured } from "@/config/env";
import { shopifyFetch } from "./client";
import { mapShopifyProduct, type ShopifyProductNode } from "./mappers";
import { PRODUCT_BY_HANDLE_QUERY, PRODUCTS_QUERY } from "./queries";
import type { Product } from "@/types";

interface ProductsResponse {
  products: { edges: Array<{ node: ShopifyProductNode }> };
}

interface ProductResponse {
  product: ShopifyProductNode | null;
}

export async function fetchShopifyProducts(limit = 50): Promise<Product[]> {
  if (!isShopifyConfigured()) return [];

  const data = await shopifyFetch<ProductsResponse>(PRODUCTS_QUERY, { first: limit });
  return data.products.edges.map((edge) => mapShopifyProduct(edge.node));
}

export async function fetchShopifyProductByHandle(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) return null;

  const data = await shopifyFetch<ProductResponse>(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data.product ? mapShopifyProduct(data.product) : null;
}
