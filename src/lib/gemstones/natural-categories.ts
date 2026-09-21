import type { GemstoneCategoryCard } from "@/data/gemstone-categories";

export type NaturalGemstonesSection = {
  eyebrow: string;
  title: string;
  description: string;
  categories: GemstoneCategoryCard[];
  updatedAt?: string;
};

/** Defaults matching the current /gemstones Natural Gemstones grid. */
export const DEFAULT_NATURAL_GEMSTONES: NaturalGemstonesSection = {
  eyebrow: "Collection",
  title: "Natural Gemstones",
  description:
    "Explore our carefully curated collection of natural gemstones, sourced from Sri Lanka and selected for their beauty, rarity and quality. Whether you're searching for a loose gemstone or planning a bespoke jewellery piece, begin your journey here.",
  categories: [
    {
      id: "sapphire",
      title: "Sapphire",
      description: "Ceylon blues, pinks, yellows and rare padparadscha",
      href: "/gemstones/sapphires",
      image: "/images/covers/cards/sapphires.webp",
      featured: true,
    },
    {
      id: "spinel",
      title: "Spinel",
      description: "Vivid reds, pinks and rare blues",
      href: "/gemstones/spinel",
      image: "/images/covers/cards/spinels.webp",
    },
    {
      id: "garnet",
      title: "Garnet",
      description: "Tsavorite, rhodolite and fine colour varieties",
      href: "/gemstones/garnet",
      image: "/images/covers/cards/garnets.webp",
    },
    {
      id: "topaz",
      title: "Topaz",
      description: "Imperial, blue and champagne tones",
      href: "/gemstones/topaz",
      image: "/images/stitch/emerald.jpg",
    },
    {
      id: "citrine",
      title: "Citrine",
      description: "Warm golden and honey hues",
      href: "/gemstones/citrine",
      image: "/images/stitch/product-tsavorite.jpg",
    },
    {
      id: "tourmaline",
      title: "Tourmaline",
      description: "Paraíba, pink and multi-colour stones",
      href: "/gemstones/tourmaline",
      image: "/images/stitch/ruby.jpg",
    },
    {
      id: "zircon",
      title: "Zircon",
      description: "Brilliant blues and earth-mined fire",
      href: "/gemstones/zircon",
      image: "/images/covers/cards/other-gemstones.webp",
    },
    {
      id: "other",
      title: "Other Gemstones",
      description: "Rare and exceptional finds beyond our core collections",
      href: "/gemstones/other",
      image: "/images/covers/cards/other-gemstones.webp",
    },
    {
      id: "all",
      title: "View All Gemstones",
      description: "Browse the complete curated collection",
      href: "/catalog",
      image: "/images/covers/cards/all-gemstones.webp",
      featured: true,
    },
  ],
};

/** Canonical routes for known Natural Gemstones category titles/ids. */
const KNOWN_CATEGORY_HREFS: Record<string, string> = {
  sapphire: "/gemstones/sapphires",
  sapphires: "/gemstones/sapphires",
  spinel: "/gemstones/spinel",
  spinels: "/gemstones/spinel",
  garnet: "/gemstones/garnet",
  garnets: "/gemstones/garnet",
  topaz: "/gemstones/topaz",
  citrine: "/gemstones/citrine",
  tourmaline: "/gemstones/tourmaline",
  zircon: "/gemstones/zircon",
  other: "/gemstones/other",
  all: "/catalog",
};

function resolveCategoryHref(id: string, title: string, href: string): string {
  const keyFromId = id.toLowerCase().trim();
  const keyFromTitle = title.toLowerCase().trim().replace(/\s+/g, "-");
  const known =
    KNOWN_CATEGORY_HREFS[keyFromId] ||
    KNOWN_CATEGORY_HREFS[keyFromTitle] ||
    KNOWN_CATEGORY_HREFS[keyFromTitle.replace(/s$/, "")];

  // Fix Sapphires (and other known types) when saved with a wrong generic route
  if (known && (!href || href === "/gemstones" || href === "/gemstones/")) {
    return known;
  }
  if (known && /^sapphires?$/i.test(title) && href !== known) {
    return known;
  }
  return href || known || "/gemstones";
}

export function normalizeNaturalGemstones(
  input: Partial<NaturalGemstonesSection> | null | undefined,
): NaturalGemstonesSection {
  const base = DEFAULT_NATURAL_GEMSTONES;
  const categories = Array.isArray(input?.categories)
    ? input!.categories
        .map((item, index) => {
          const id = String(item?.id || `category-${index + 1}`);
          const title = String(item?.title || "").trim();
          const rawHref = String(item?.href || "").trim();
          return {
            id,
            title,
            description: item?.description ? String(item.description).trim() : undefined,
            href: resolveCategoryHref(id, title, rawHref),
            image: String(item?.image || "").trim(),
            featured: Boolean(item?.featured),
          };
        })
        .filter((item) => item.title && item.image)
    : base.categories;

  return {
    eyebrow: String(input?.eyebrow || base.eyebrow).trim() || base.eyebrow,
    title: String(input?.title || base.title).trim() || base.title,
    description: String(input?.description ?? base.description).trim() || base.description,
    categories: categories.length > 0 ? categories : base.categories,
    updatedAt: input?.updatedAt,
  };
}
