import { images } from "@/config/images";
import { mainNavigation } from "@/config/navigation";

export const siteConfig = {
  name: "Ceyloe",
  tagline: "Kalgoorlie Gems, Perth Gemstones & WA Jewellery",
  description:
    "Kalgoorlie gems and jewellery from Ceyloe’s Hannan Street office, plus Perth gems and Ceylon sapphires across WA — ethically sourced, certified, with private appointments and Australia-wide delivery.",
  /** Canonical public URL — never use *.vercel.app for SEO (sitemap/robots/JSON-LD). */
  url: (() => {
    const fallback = "https://www.ceyloe.com";
    const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? fallback).trim().replace(/\/$/, "");
    try {
      const host = new URL(raw.includes("://") ? raw : `https://${raw}`).hostname;
      if (!host || /\.vercel\.app$/i.test(host)) return fallback;
      return raw.includes("://") ? raw : `https://${raw}`;
    } catch {
      return fallback;
    }
  })(),
  locale: "en_AU",
  seo: {
    keywords: [
      "Kalgoorlie gems",
      "Kalgoorlie jewellery",
      "Kalgoorlie jewelry",
      "Perth gems",
      "gemstones Perth",
      "Perth jewellery",
      "Ceylon sapphire Perth",
      "gemstones Kalgoorlie",
      "jewellery Kalgoorlie WA",
      "buy sapphire Perth",
      "bespoke jewellery Perth",
      "natural gemstones Western Australia",
      "Ceyloe gemstones",
    ],
  },
  contact: {
    phone: "0449 938 172",
    phoneInternational: "+61 449 938 172",
    email: "info@ceyloe.com",
    whatsapp: "61449938172",
    headOffice: {
      label: "Head Office",
      lines: ["273 Hannan Street", "Kalgoorlie, WA"],
      streetAddress: "273 Hannan Street",
      addressLocality: "Kalgoorlie",
      addressRegion: "WA",
      postalCode: "6430",
      addressCountry: "AU",
    },
    miningOffice: {
      label: "Mining and Production",
      lines: ["2/200, Peellawatta, Big City", "Minuwangoda", "Sri Lanka"],
    },
    /** Local SEO markets — Kalgoorlie is HQ; Perth is a primary service area. */
    serviceAreas: ["Kalgoorlie", "Perth", "Western Australia", "Australia"] as const,
  },
  social: {
    instagram: "https://www.instagram.com/ceyloegemstones/",
    facebook: "https://www.facebook.com/ceyloegemstone/",
  },
  links: {
    terms: "https://ceyloe.co.nz/terms-conditions/",
    privacy: "/contact",
    shipping: "/transparency",
    returns: "/returns",
    shopifyAuth: "https://shopify.com/authentication",
    perth: "/perth",
    kalgoorlie: "/kalgoorlie",
  },
  nav: mainNavigation.map(({ label, href }) => ({ label, href })),
  footerNav: {
    company: [
      { label: "Gemstones", href: "/gemstones" },
      { label: "Jewellery", href: "/catalog?category=jewellery" },
      { label: "Kalgoorlie Gems", href: "/kalgoorlie" },
      { label: "Perth Gems", href: "/perth" },
      { label: "Our Process", href: "/heritage" },
      { label: "Contact", href: "/contact" },
      { label: "Education", href: "/journal" },
    ],
    service: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Policy", href: "/transparency" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Terms & Conditions", href: "https://ceyloe.co.nz/terms-conditions/" },
      { label: "Privacy Policy", href: "/contact" },
      { label: "Custom Jewelry", href: "/custom-jewelry" },
      { label: "Book Appointment", href: "/book" },
    ],
  },
  categories: [
    { name: "Sapphires", slug: "sapphires", image: images.categories.sapphires, accent: "sapphire" as const },
    { name: "Spinel", slug: "spinel", image: images.categories.spinel, accent: "sapphire" as const },
    { name: "Garnet", slug: "garnet", image: images.categories.garnet, accent: "emerald" as const },
    { name: "Zircon", slug: "zircon", image: images.categories.zircon, accent: "emerald" as const },
    { name: "Jewellery", slug: "jewellery", image: images.categories.jewellery, accent: "emerald" as const },
  ],
} as const;
