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
    href: "/catalog?category=spinel",
    image: images.categories.spinel,
  },
  {
    id: "garnet",
    title: "Garnet",
    description: "Tsavorite, rhodolite and fine colour varieties",
    href: "/catalog?category=garnet",
    image: images.categories.garnet,
  },
  {
    id: "topaz",
    title: "Topaz",
    description: "Imperial, blue and champagne tones",
    href: "/catalog?category=topaz",
    image: stitchImages.emerald,
  },
  {
    id: "citrine",
    title: "Citrine",
    description: "Warm golden and honey hues",
    href: "/catalog?category=citrine",
    image: stitchImages.productTsavorite,
  },
  {
    id: "tourmaline",
    title: "Tourmaline",
    description: "Paraíba, pink and multi-colour stones",
    href: "/catalog?category=tourmaline",
    image: stitchImages.ruby,
  },
  {
    id: "zircon",
    title: "Zircon",
    description: "Brilliant blues and earth-mined fire",
    href: "/catalog?category=zircon",
    image: images.categories.zircon,
  },
  {
    id: "other",
    title: "Other Gemstones",
    description: "Rare and exceptional finds beyond our core collections",
    href: "/catalog?category=other",
    image: stitchImages.allGems,
  },
  {
    id: "all",
    title: "View All Gemstones",
    description: "Browse the complete curated collection",
    href: "/catalog",
    image: stitchImages.allGems,
    featured: true,
  },
];

/** Sapphire colour / variety landing categories. */
export const sapphireLandingCategories: GemstoneCategoryCard[] = [
  {
    id: "blue",
    title: "Blue Sapphire",
    href: "/catalog?category=sapphires&color=blue",
    image: images.categories.sapphires,
  },
  {
    id: "pink",
    title: "Pink Sapphire",
    href: "/catalog?category=sapphires&color=pink",
    image: stitchImages.ruby,
  },
  {
    id: "yellow",
    title: "Yellow Sapphire",
    href: "/catalog?category=sapphires&color=yellow",
    image: "/images/Sapphires/05-3.jpg",
  },
  {
    id: "white",
    title: "White Sapphire",
    href: "/catalog?category=sapphires&color=white",
    image: stitchImages.sapphire,
  },
  {
    id: "teal",
    title: "Teal Sapphire",
    href: "/catalog?category=sapphires&color=teal",
    image: "/images/Sapphires/14-2_web-1.jpg",
  },
  {
    id: "parti",
    title: "Parti Sapphire",
    href: "/catalog?category=sapphires&color=parti",
    image: stitchImages.allGems,
  },
  {
    id: "padparadscha",
    title: "Padparadscha Sapphire",
    href: "/catalog?category=sapphires&color=padparadscha",
    image: "/images/Sapphires/1112023001-9.jpg",
  },
  {
    id: "green",
    title: "Green Sapphire",
    href: "/catalog?category=sapphires&color=green",
    image: stitchImages.emerald,
  },
  {
    id: "purple",
    title: "Purple Sapphire",
    href: "/catalog?category=sapphires&color=purple",
    image: stitchImages.sapphire,
  },
  {
    id: "star",
    title: "Star Sapphire",
    href: "/catalog?category=sapphires&color=star",
    image: stitchImages.productSapphire,
  },
  {
    id: "all-sapphires",
    title: "View All Sapphires",
    description: "Browse every sapphire in our collection",
    href: "/catalog?category=sapphires",
    image: stitchImages.allGems,
    featured: true,
  },
];
