import { images } from "@/config/images";

export const siteConfig = {
  name: "Ceyloe",
  tagline: "Specialists in Fine Natural Gemstones",
  description:
    "Discover ethically sourced, certified gemstones and fine jewellery. From sapphires to spinel, each stone carries a story of heritage and craftsmanship.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ceyloe.com",
  contact: {
    phone: "0449 938 172",
    phoneInternational: "+61 449 938 172",
    whatsapp: "61449938172",
    headOffice: {
      label: "Head Office",
      lines: ["Kalgoorlie WA", "Australia"],
    },
    miningOffice: {
      label: "Mining and Production",
      lines: ["2/200, Peellawatta, Big City", "Minuwangoda", "Sri Lanka"],
    },
  },
  social: {
    instagram: "https://www.instagram.com/ceyloegemstones/",
    facebook: "https://www.facebook.com/ceyloegemstone/",
  },
  links: {
    terms: "https://ceyloe.co.nz/terms-conditions/",
    shipping: "/transparency",
    shopifyAuth: "https://shopify.com/authentication",
  },
  nav: [
    { label: "Loose Gemstones", href: "/catalog" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Journal", href: "/journal" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerNav: [
    { label: "Loose Gemstones", href: "/catalog" },
    { label: "Ring Gallery", href: "/portfolio" },
    { label: "Custom Jewelry", href: "/custom-jewelry" },
    { label: "AI Recommendations", href: "/recommend" },
    { label: "Compare Gems", href: "/compare" },
    { label: "Book Appointment", href: "/book" },
    { label: "Wholesale / Trade", href: "/wholesale" },
    { label: "Heritage", href: "/heritage" },
    { label: "Mine to Market", href: "/transparency" },
    { label: "Reviews", href: "/reviews" },
    { label: "Account", href: "/account" },
    { label: "Journal", href: "/journal" },
    { label: "Certifications", href: "/certifications" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Instagram", href: "/instagram" },
  ],
  categories: [
    { name: "Sapphires", slug: "sapphires", image: images.categories.sapphires, accent: "sapphire" as const },
    { name: "Spinel", slug: "spinel", image: images.categories.spinel, accent: "sapphire" as const },
    { name: "Garnet", slug: "garnet", image: images.categories.garnet, accent: "emerald" as const },
    { name: "Zircon", slug: "zircon", image: images.categories.zircon, accent: "emerald" as const },
    { name: "Jewellery", slug: "jewellery", image: images.categories.jewellery, accent: "emerald" as const },
  ],
} as const;
