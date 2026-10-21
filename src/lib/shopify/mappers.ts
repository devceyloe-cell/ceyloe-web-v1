import type { Product } from "@/types";

interface ShopifyMetafield {
  key: string;
  value: string;
}

interface ShopifyImage {
  url: string;
  altText: string | null;
}

interface ShopifyVideoSource {
  url: string;
  mimeType: string;
}

interface ShopifyMediaNode {
  mediaContentType: string;
  sources?: ShopifyVideoSource[];
  embedUrl?: string;
  host?: string;
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
  media?: { edges: Array<{ node: ShopifyMediaNode }> };
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  metafields: (ShopifyMetafield | null)[];
}

function getMetafield(metafields: (ShopifyMetafield | null)[], key: string): string | undefined {
  return metafields.find((m) => m?.key === key)?.value;
}

function getVideoUrl(node: ShopifyProductNode): string | undefined {
  const metafieldVideo = getMetafield(node.metafields, "video_url");
  if (metafieldVideo) return metafieldVideo;

  for (const edge of node.media?.edges ?? []) {
    const media = edge.node;
    if (media.mediaContentType === "VIDEO" && media.sources?.length) {
      const mp4 =
        media.sources.find((source) => source.mimeType.includes("mp4")) ?? media.sources[0];
      return mp4.url;
    }
    if (media.mediaContentType === "EXTERNAL_VIDEO" && media.embedUrl) {
      return media.embedUrl;
    }
  }

  return undefined;
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
    videoUrl: getVideoUrl(node),
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
    availability: node.availableForSale ? "available" : "sold_out",
    inStock: node.availableForSale,
  };
}

export type { ShopifyProductNode };
