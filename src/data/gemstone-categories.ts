import { images } from "@/config/images";
import { stitchImages } from "@/config/stitch-images";

export interface GemstoneCategoryCard {
  id: string;
  title: string;
  description?: string;
  href: string;
  image: string;
  featured?: boolean;
}

const covers = {
  blue: "/images/covers/cards/blue-sapphires.webp",
  pink: "/images/covers/cards/pink-sapphires.webp",
  yellow: "/images/covers/cards/yellow-sapphires.webp",
  teal: "/images/covers/cards/teal-sapphires.webp",
  parti: "/images/covers/parti-sapphires.webp",
  padparadscha: "/images/covers/cards/padparadscha.webp",
  allSapphires: "/images/covers/cards/all-sapphires.webp",
  other: "/images/covers/cards/other-gemstones.webp",
} as const;

/** Top-level gemstone landing categories. */
export const gemstoneLandingCategories: GemstoneCategoryCard[] = [
  {
    id: "sapphire",
    title: "Sapphire",
    description: "Ceylon blues, pinks, yellows and rare padparadscha",
    href: "/gemstones/sapphires",
    image: images.categories.sapphires,
    featured: true,
  },
  {
    id: "spinel",
    title: "Spinel",
    description: "Vivid reds, pinks and rare blues",
    href: "/gemstones/spinel",
    image: images.categories.spinel,
  },
  {
    id: "garnet",
    title: "Garnet",
    description: "Tsavorite, rhodolite and fine colour varieties",
    href: "/gemstones/garnet",
    image: images.categories.garnet,
  },
  {
    id: "topaz",
    title: "Topaz",
    description: "Imperial, blue and champagne tones",
    href: "/gemstones/topaz",
    image: stitchImages.emerald,
  },
  {
    id: "citrine",
    title: "Citrine",
    description: "Warm golden and honey hues",
    href: "/gemstones/citrine",
    image: stitchImages.productTsavorite,
  },
  {
    id: "tourmaline",
    title: "Tourmaline",
    description: "Paraíba, pink and multi-colour stones",
    href: "/gemstones/tourmaline",
    image: stitchImages.ruby,
  },
  {
    id: "zircon",
    title: "Zircon",
    description: "Brilliant blues and earth-mined fire",
    href: "/gemstones/zircon",
    image: images.categories.zircon,
  },
  {
    id: "other",
    title: "Other Gemstones",
    description: "Rare and exceptional finds beyond our core collections",
    href: "/gemstones/other",
    image: covers.other,
  },
  {
    id: "all",
    title: "View All Gemstones",
    description: "Browse the complete curated collection",
    href: "/catalog",
    image: "/images/covers/cards/all-gemstones.webp",
    featured: true,
  },
];

/** Sapphire colour / variety landing categories. */
export const sapphireLandingCategories: GemstoneCategoryCard[] = [
  {
    id: "blue",
    title: "Blue Sapphire",
    href: "/catalog?category=sapphires&color=blue",
    image: covers.blue,
  },
  {
    id: "pink",
    title: "Pink Sapphire",
    href: "/catalog?category=sapphires&color=pink",
    image: covers.pink,
  },
  {
    id: "yellow",
    title: "Yellow Sapphire",
    href: "/catalog?category=sapphires&color=yellow",
    image: covers.yellow,
  },
  {
    id: "white",
    title: "White Sapphire",
    href: "/catalog?category=sapphires&color=white",
    image: covers.allSapphires,
  },
  {
    id: "teal",
    title: "Teal Sapphire",
    href: "/catalog?category=sapphires&color=teal",
    image: covers.teal,
  },
  {
    id: "parti",
    title: "Parti Sapphire",
    href: "/catalog?category=sapphires&color=parti",
    image: covers.parti,
  },
  {
    id: "padparadscha",
    title: "Padparadscha Sapphire",
    href: "/catalog?category=sapphires&color=padparadscha",
    image: covers.padparadscha,
  },
  {
    id: "green",
    title: "Green Sapphire",
    href: "/catalog?category=sapphires&color=green",
    image: covers.other,
  },
  {
    id: "purple",
    title: "Purple Sapphire",
    href: "/catalog?category=sapphires&color=purple",
    image: covers.pink,
  },
  {
    id: "star",
    title: "Star Sapphire",
    href: "/catalog?category=sapphires&color=star",
    image: covers.blue,
  },
  {
    id: "all-sapphires",
    title: "View All Sapphires",
    description: "Browse every sapphire in our collection",
    href: "/catalog?category=sapphires",
    image: covers.allSapphires,
    featured: true,
  },
];
