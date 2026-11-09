import { images } from "@/config/images";
import { mainNavigation } from "@/config/navigation";

export const siteConfig = {
  name: "Ceyloe",
  tagline: "Ceylon Gemstones for Perth & Western Australia",
  description:
    "Buy certified Ceylon gemstones in Perth and WA — ethically sourced sapphires, spinel and more from Sri Lanka, curated in Australia with private appointments and Australia-wide delivery.",
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
      "gemstones Perth",
      "Ceylon sapphire Perth",
      "buy sapphire Perth",
      "gemstone dealer Perth WA",
      "unheated blue sapphire Australia",
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
    /** Primary market for local SEO — no invented Perth street address. */
    serviceAreas: ["Perth", "Western Australia", "Australia"] as const,
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
  },
  nav: mainNavigation.map(({ label, href }) => ({ label, href })),
  footerNav: {
    company: [
      { label: "Gemstones", href: "/gemstones" },
      { label: "Jewellery", href: "/catalog?category=jewellery" },
      { label: "Gemstones in Perth", href: "/perth" },
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
