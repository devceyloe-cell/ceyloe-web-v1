import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires unsafe-inline for styles and unsafe-eval for development
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://js.afterpay.com https://*.afterpay.com https://cdn.sanity.io",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://cdn.shopify.com https://cdn.sanity.io https://static.afterpay.com https://*.afterpay.com https://ceyloe.com https://www.ceyloe.com",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://global-api.afterpay.com https://global-api-sandbox.afterpay.com https://*.afterpay.com https://*.mongodb.net https://cdn.sanity.io",
      "frame-src 'self' https://js.stripe.com https://*.afterpay.com https://portal.afterpay.com https://portal.sandbox.afterpay.com https://www.youtube.com https://www.youtube-nocookie.com",
      "media-src 'self' https://cdn.sanity.io https://ceyloe.com https://www.ceyloe.com https://www.youtube.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.afterpay.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const longCacheHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: longCacheHeaders,
      },
      {
        source: "/images/:path*",
        headers: longCacheHeaders,
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "ceyloe.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.ceyloe.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
