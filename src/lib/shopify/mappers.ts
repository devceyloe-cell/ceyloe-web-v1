import type { Product } from "@/types";

interface ShopifyMetafield {
  key: string;
  value: string;
}

interface ShopifyImage {
  url: string;
  altText: string | null;
}

interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: { edges: Array<{ node: ShopifyImage }> };
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  metafields: (ShopifyMetafield | null)[];
}

function getMetafield(metafields: (ShopifyMetafield | null)[], key: string): string | undefined {
  return metafields.find((m) => m?.key === key)?.value;
}

export function mapShopifyProduct(node: ShopifyProductNode): Product {
  const images = node.images.edges.map((e) => e.node.url);
  const featured = node.featuredImage?.url ?? images[0] ?? "";

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    currency: node.priceRange.minVariantPrice.currencyCode,
    category: node.productType.toLowerCase() || "gemstones",
    image: featured,
    images: images.length ? images : [featured],
    featured: node.tags.includes("featured"),
    specs: {
      carat: getMetafield(node.metafields, "carat"),
      color: getMetafield(node.metafields, "color"),
      clarity: getMetafield(node.metafields, "clarity"),
      cut: getMetafield(node.metafields, "cut"),
      origin: getMetafield(node.metafields, "origin") ?? "Sri Lanka",
      treatment: getMetafield(node.metafields, "treatment"),
      certification: getMetafield(node.metafields, "certification"),
    },
    inStock: node.availableForSale,
  };
}

export type { ShopifyProductNode };
