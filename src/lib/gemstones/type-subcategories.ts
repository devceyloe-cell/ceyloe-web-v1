import type { GemstoneCategoryCard } from "@/data/gemstone-categories";
import { sapphireLandingCategories } from "@/data/gemstone-categories";
import { gemstoneTypePages } from "@/data/gemstone-type-pages";

export type GemstoneTypeSubcategories = {
  type: string;
  title: string;
  cards: GemstoneCategoryCard[];
  updatedAt?: string;
};

/** Types that show a second-level card grid (Natural Gemstones → Type → colour cards). */
export const EDITABLE_SUBCATEGORY_TYPES = ["sapphires"] as const;

export type EditableSubcategoryType = (typeof EDITABLE_SUBCATEGORY_TYPES)[number];

export function isEditableSubcategoryType(type: string): type is EditableSubcategoryType {
  return (EDITABLE_SUBCATEGORY_TYPES as readonly string[]).includes(type);
}

const DEFAULT_CARDS_BY_TYPE: Record<string, GemstoneCategoryCard[]> = {
  sapphires: sapphireLandingCategories,
};

export function getDefaultSubcategories(type: string): GemstoneTypeSubcategories | null {
  const page = gemstoneTypePages[type];
  const cards = DEFAULT_CARDS_BY_TYPE[type] ?? page?.subcategories;
  if (!page || !cards?.length) return null;

  return {
    type,
    title: `${page.title} colours`,
    cards: cards.map((c) => ({ ...c })),
  };
}

export function normalizeTypeSubcategories(
  type: string,
  input: Partial<GemstoneTypeSubcategories> | null | undefined,
): GemstoneTypeSubcategories | null {
  const defaults = getDefaultSubcategories(type);
  if (!defaults) return null;

  const cards = Array.isArray(input?.cards)
    ? input!.cards
        .map((item, index) => ({
          id: String(item?.id || `card-${index + 1}`),
          title: String(item?.title || "").trim(),
          description: item?.description ? String(item.description).trim() : undefined,
          href: String(item?.href || "").trim() || "/",
          image: String(item?.image || "").trim(),
          featured: Boolean(item?.featured),
        }))
        .filter((item) => item.title && item.image)
    : defaults.cards;

  return {
    type,
    title: String(input?.title || defaults.title).trim() || defaults.title,
    cards: cards.length > 0 ? cards : defaults.cards,
    updatedAt: input?.updatedAt,
  };
}
