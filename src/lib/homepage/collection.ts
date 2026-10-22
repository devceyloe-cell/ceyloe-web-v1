export type HomepageCollectionItem = {
  id: string;
  name: string;
  href: string;
  image: string;
};

export type HomepageCollection = {
  eyebrow: string;
  title: string;
  exploreLabel: string;
  items: HomepageCollectionItem[];
  updatedAt?: string;
};

export const DEFAULT_HOMEPAGE_COLLECTION: HomepageCollection = {
  eyebrow: "Our Collection",
  title: "Discover Our Finest Gems",
  exploreLabel: "Explore",
  items: [
    {
      id: "sapphire",
      name: "Sapphire Collection",
      href: "/gemstones/sapphires",
      image: "/images/covers/cards/sapphires.webp",
    },
    {
      id: "spinel",
      name: "Spinel Collection",
      href: "/gemstones/spinel",
      image: "/images/covers/cards/spinels.webp",
    },
    {
      id: "garnet",
      name: "Garnet Collection",
      href: "/gemstones/garnet",
      image: "/images/covers/cards/garnets.webp",
    },
    {
      id: "other",
      name: "Other Gemstones",
      href: "/gemstones/other",
      image: "/images/covers/cards/other-gemstones.webp",
    },
  ],
};

export function normalizeHomepageCollection(
  input: Partial<HomepageCollection> | null | undefined,
): HomepageCollection {
  const base = DEFAULT_HOMEPAGE_COLLECTION;
  const items = Array.isArray(input?.items)
    ? input!.items
        .map((item, index) => ({
          id: String(item?.id || `item-${index + 1}`),
          name: String(item?.name || "").trim(),
          href: String(item?.href || "").trim() || "/",
          image: String(item?.image || "").trim(),
        }))
        .filter((item) => item.name && item.image)
    : base.items;

  return {
    eyebrow: String(input?.eyebrow || base.eyebrow).trim() || base.eyebrow,
    title: String(input?.title || base.title).trim() || base.title,
    exploreLabel: String(input?.exploreLabel || base.exploreLabel).trim() || base.exploreLabel,
    items: items.length > 0 ? items : base.items,
    updatedAt: input?.updatedAt,
  };
}
