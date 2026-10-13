import type { GemstoneCategoryCard } from "@/data/gemstone-categories";
import { sapphireLandingCategories } from "@/data/gemstone-categories";

export type GemstoneHeroLayout = "stacked" | "banner";

export interface GemstoneTypePageConfig {
  slug: string;
  title: string;
  /** Catalog filter value */
  catalogCategory: string;
  image: string;
  /** stacked: three navy pills (sapphires). banner: one navy bar (spinels). */
  heroLayout: GemstoneHeroLayout;
  traits?: readonly [string, string, string];
  /** Single navy bar copy, e.g. "Vibrant. Rare. Remarkable." */
  bannerTagline?: string;
  /** Thin line + star under the title (spinels attachment) */
  showTitleDivider?: boolean;
  exploreLabel?: string;
  description: string;
  /** Optional colour / variety cards (sapphires) */
  subcategories?: GemstoneCategoryCard[];
}

const DEFAULT_TRAITS = ["Timeless", "Elegant", "Extraordinary"] as const;

export const gemstoneTypePages: Record<string, GemstoneTypePageConfig> = {
  sapphires: {
    slug: "sapphires",
    title: "Sapphires",
    catalogCategory: "sapphires",
    image: "/images/covers/sapphires-hero.jpg",
    heroLayout: "stacked",
    traits: DEFAULT_TRAITS,
    exploreLabel: "Explore our finest sapphire collection.",
    description:
      "Discover Ceylon sapphires by colour — blue, pink, yellow, padparadscha, teal and more.",
    subcategories: sapphireLandingCategories,
  },
  spinel: {
    slug: "spinel",
    title: "Spinels",
    catalogCategory: "spinel",
    image: "/images/covers/spinels.webp",
    heroLayout: "banner",
    bannerTagline: "Vibrant. Rare. Remarkable.",
    showTitleDivider: true,
    description: "Vivid reds, pinks and rare blues.",
  },
  garnet: {
    slug: "garnet",
    title: "Garnets",
    catalogCategory: "garnet",
    image: "/images/covers/garnets.webp",
    heroLayout: "banner",
    bannerTagline: "Rich colours. Timeless beauty.",
    showTitleDivider: true,
    description: "Tsavorite, rhodolite and fine colour varieties.",
  },
  topaz: {
    slug: "topaz",
    title: "Topaz",
    catalogCategory: "topaz",
    image: "/images/covers/topaz.webp",
    heroLayout: "banner",
    bannerTagline: "Rich colours. Timeless beauty.",
    showTitleDivider: true,
    description: "Imperial, blue and champagne tones.",
  },
  citrine: {
    slug: "citrine",
    title: "Citrine",
    catalogCategory: "citrine",
    image: "/images/covers/citrine.webp",
    heroLayout: "stacked",
    traits: DEFAULT_TRAITS,
    exploreLabel: "Explore our finest citrine collection.",
    description: "Warm golden and honey hues.",
  },
  tourmaline: {
    slug: "tourmaline",
    title: "Tourmaline",
    catalogCategory: "tourmaline",
    image: "/images/covers/other-gemstones.webp",
    heroLayout: "stacked",
    traits: DEFAULT_TRAITS,
    exploreLabel: "Explore our finest tourmaline collection.",
    description: "Paraíba, pink and multi-colour stones.",
  },
  zircon: {
    slug: "zircon",
    title: "Zircon",
    catalogCategory: "zircon",
    image: "/images/covers/other-gemstones.webp",
    heroLayout: "stacked",
    traits: DEFAULT_TRAITS,
    exploreLabel: "Explore our finest zircon collection.",
    description: "Brilliant blues and earth-mined fire.",
  },
  other: {
    slug: "other",
    title: "Other Gemstones",
    catalogCategory: "other",
    image: "/images/covers/other-gemstones.webp",
    heroLayout: "stacked",
    traits: DEFAULT_TRAITS,
    exploreLabel: "Explore our finest gemstone collection.",
    description: "Rare and exceptional finds beyond our core collections.",
  },
};

export const gemstoneTypeSlugs = Object.keys(gemstoneTypePages);

export function getGemstoneTypePage(slug: string): GemstoneTypePageConfig | null {
  return gemstoneTypePages[slug] ?? null;
}
