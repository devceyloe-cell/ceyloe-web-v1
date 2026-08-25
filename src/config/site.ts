import { images } from "@/config/images";
import { mainNavigation } from "@/config/navigation";

export const siteConfig = {
  name: "Ceyloe",
  tagline: "Precious Gemstones & Custom Jewellery",
  description:
    "Bringing you some of Earth's finest precious gemstones — ethically sourced, certified, and curated for collectors and bespoke jewellery lovers worldwide.",
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
    privacy: "/contact",
    shipping: "/transparency",
    returns: "/returns",
    shopifyAuth: "https://shopify.com/authentication",
  },
  nav: mainNavigation.map(({ label, href }) => ({ label, href })),
  footerNav: {
    company: [
      { label: "Gemstones", href: "/gemstones" },
      { label: "Jewellery", href: "/catalog?category=jewellery" },
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
