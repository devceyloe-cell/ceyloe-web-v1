import { images } from "@/config/images";

export const env = {
  shopify: {
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "",
    storefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
    apiVersion: process.env.SHOPIFY_API_VERSION ?? "2024-10",
    customerClientId: process.env.SHOPIFY_CUSTOMER_CLIENT_ID ?? "",
  },
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
    token: process.env.SANITY_API_READ_TOKEN ?? "",
  },
  hero: {
    videoUrl: process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "",
    posterUrl: process.env.NEXT_PUBLIC_HERO_POSTER_URL ?? images.hero.poster,
  },
  product: {
    /** Default: @Ceyloe.Gem.Stones channel showcase video */
    videoUrl:
      process.env.NEXT_PUBLIC_PRODUCT_VIDEO_URL ??
      "https://www.youtube.com/watch?v=LPNf_ZPPGXg",
  },
  mongodb: {
    uri: process.env.MONGODB_URI ?? "",
    dbName: process.env.MONGODB_DB_NAME ?? "ceyloe",
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  },
} as const;

export function isShopifyConfigured(): boolean {
  return Boolean(env.shopify.storeDomain && env.shopify.storefrontToken);
}

export function isSanityConfigured(): boolean {
  return Boolean(env.sanity.projectId);
}

export function isMongoConfigured(): boolean {
  return Boolean(env.mongodb.uri);
}

export function isStripeConfigured(): boolean {
  return Boolean(env.stripe.secretKey);
}
