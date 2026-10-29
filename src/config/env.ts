import { images } from "@/config/images";

export const env = {
  analytics: {
    /** Google Analytics 4 Measurement ID (G-XXXXXXXXXX) */
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  },
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
  afterpay: {
    /** Merchant ID from https://hub.afterpay.com/ */
    merchantId: process.env.AFTERPAY_MERCHANT_ID ?? process.env.NEXT_PUBLIC_AFTERPAY_MERCHANT_ID ?? "1202585",
    /** Secret Key from Afterpay Hub — server only, never expose to the client */
    secretKey: process.env.AFTERPAY_SECRET_KEY ?? "",
    /** Use sandbox API when true */
    sandbox: process.env.AFTERPAY_SANDBOX === "true",
    /** Merchant region: AU | NZ | US | CA | GB */
    countryCode: (
      process.env.AFTERPAY_COUNTRY_CODE ??
      process.env.NEXT_PUBLIC_AFTERPAY_COUNTRY_CODE ??
      "AU"
    ).toUpperCase(),
    /** Must match the Afterpay merchant account currency */
    currency: (
      process.env.AFTERPAY_CURRENCY ??
      process.env.NEXT_PUBLIC_AFTERPAY_CURRENCY ??
      "AUD"
    ).toUpperCase(),
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
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function isAfterpayConfigured(): boolean {
  return Boolean(env.afterpay.merchantId.trim() && env.afterpay.secretKey.trim());
}
