import { images } from "@/config/images";

export const siteConfig = {
  name: "Ceyloe",
  tagline: "Exquisite Gemstones from Sri Lanka",
  description:
    "Discover ethically sourced, certified gemstones and fine jewellery. From sapphires to spinel, each stone carries a story of heritage and craftsmanship.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ceyloe.com",
  contact: {
    email: "hello@ceyloe.com",
    phone: "+94 77 000 0000",
    whatsapp: "94770000000",
    address: "Colombo, Sri Lanka",
  },
  social: {
    instagram: "https://instagram.com/ceyloe",
    facebook: "https://facebook.com/ceyloe",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/catalog" },
    { label: "Certifications", href: "/certifications" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  categories: [
    { name: "Sapphires", slug: "sapphires", image: images.categories.sapphires },
    { name: "Spinel", slug: "spinel", image: images.categories.spinel },
    { name: "Garnet", slug: "garnet", image: images.categories.garnet },
    { name: "Zircon", slug: "zircon", image: images.categories.zircon },
    { name: "Jewellery", slug: "jewellery", image: images.categories.jewellery },
  ],
} as const;
