import { images } from "@/config/images";

export const siteConfig = {
  name: "Ceyloe",
  tagline: "We take Pride & Joy Knowing Gem",
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
    facebook: "https://facebook.com/ceyloe",
  },
  links: {
    terms: "https://ceyloe.co.nz/terms-conditions/",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/catalog" },
    { label: "Certifications", href: "/certifications" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  footerNav: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Instagram", href: "/instagram" },
  ],
  categories: [
    { name: "Sapphires", slug: "sapphires", image: images.categories.sapphires },
    { name: "Spinel", slug: "spinel", image: images.categories.spinel },
    { name: "Garnet", slug: "garnet", image: images.categories.garnet },
    { name: "Zircon", slug: "zircon", image: images.categories.zircon },
    { name: "Jewellery", slug: "jewellery", image: images.categories.jewellery },
  ],
} as const;
