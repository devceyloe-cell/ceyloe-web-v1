# Ceyloe — Luxury Gemstone Website

Modern headless ecommerce website for Ceyloe, built with **Next.js 15**, **Shopify Storefront API**, and **Sanity CMS**.

## Architecture

```
src/
├── app/                    # Next.js App Router (pages + BFF API routes)
│   ├── api/                # Backend-for-Frontend layer
│   ├── catalog/            # Gemstone catalog with filters
│   ├── products/[handle]/  # Product detail pages
│   ├── certifications/     # Trust & certification page
│   ├── about/              # Brand story
│   └── contact/            # Contact & consultation
├── components/             # UI components by feature
│   ├── layout/             # Header, Footer
│   ├── home/               # Hero, Featured, Testimonials
│   ├── catalog/            # Product grid, filters
│   ├── product/            # Gallery, specs
│   └── ui/                 # Design system primitives
├── config/                 # Site config & env helpers
├── data/mock/              # Fallback data (works without API keys)
├── lib/
│   ├── shopify/            # Shopify Storefront API client
│   └── sanity/             # Sanity CMS client
├── services/               # Business logic layer (abstracts data sources)
└── types/                  # Shared TypeScript types
```

## Data Flow

```
Browser → Next.js Pages (SSR) → Services Layer → Shopify / Sanity / Mock Data
Browser → /api/* (BFF)        → Services Layer → Shopify / Sanity / Mock Data
```

The **services layer** automatically falls back to mock data when Shopify or Sanity credentials are not configured, so the site works out of the box for development.

## Getting Started

```bash
cd ceyloe-web
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connecting Shopify

1. Create a Shopify store (or use existing)
2. Enable Storefront API access token in Shopify Admin → Settings → Apps
3. Add credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_...
   ```
4. Add product metafields for gemstone specs: `carat`, `color`, `clarity`, `cut`, `origin`, `treatment`, `certification`

## Connecting Sanity CMS

1. Create a project at [sanity.io](https://sanity.io)
2. Add credentials to `.env.local`
3. Define schemas for `siteSettings`, `testimonial`, and `certification` document types
4. Content will replace mock data automatically

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion |
| Backend (BFF) | Next.js API Routes |
| Commerce | Shopify Storefront API |
| CMS | Sanity |
| Hosting | Vercel (recommended) |

## Design

- **Colors:** Deep black (#0A0A0A) + luxury gold (#C9A227)
- **Typography:** Playfair Display (headings) + Inter (body)
- **Mobile-first:** Responsive from 360px viewport