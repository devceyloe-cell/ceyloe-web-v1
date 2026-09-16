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
      id: "blue-sapphire",
      name: "Blue Sapphire",
      href: "/catalog?category=sapphires&color=blue",
      image: "/images/covers/cards/sapphires.webp",
    },
    {
      id: "padparadscha",
      name: "Padparadscha Sapphire",
      href: "/catalog?category=sapphires&color=padparadscha",
      image: "/images/stitch/sapphire.jpg",
    },
    {
      id: "pink-sapphire",
      name: "Pink Sapphire",
      href: "/catalog?category=sapphires&color=pink",
      image: "/images/stitch/ruby.jpg",
    },
    {
      id: "spinel",
      name: "Spinel",
      href: "/catalog?category=spinel",
      image: "/images/covers/cards/spinels.webp",
    },
    {
      id: "garnet",
      name: "Garnet",
      href: "/catalog?category=garnet",
      image: "/images/covers/cards/garnets.webp",
    },
    {
      id: "fine-gemstones",
      name: "Fine Gemstones",
      href: "/gemstones",
      image: "/images/stitch/all-gems.jpg",
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
