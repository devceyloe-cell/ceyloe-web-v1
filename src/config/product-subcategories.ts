import { sapphireLandingCategories } from "@/data/gemstone-categories";
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/config/product-categories";

export type ProductSubcategoryOption = {
  value: string;
  label: string;
};

/**
 * Level-2 colour / variety under a stone category.
 *
 * Taxonomy:
 *   Sapphires → Blue, Pink, Yellow, … (sapphire-specific varieties)
 *   Spinel / Ruby / Garnet / … → Blue, Pink, Red, … (shared gem colours)
 *   Jewellery → no colour subcategory
 *
 * Catalog URL stays `/catalog?category={category}&color={subcategory}`.
 * Free-text `specs.color` remains for display labels (e.g. "Hot Pink").
 */

/** Shared level-2 colours for Spinel and other non-sapphire gems. */
export const SHARED_GEM_COLOR_SUBCATEGORIES: ProductSubcategoryOption[] = [
  { value: "blue", label: "Blue" },
  { value: "pink", label: "Pink" },
  { value: "yellow", label: "Yellow" },
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "purple", label: "Purple" },
  { value: "white", label: "White" },
  { value: "teal", label: "Teal" },
];

/** Preferred order for core sapphire colours (Blue, Pink, Yellow first). */
const SAPPHIRE_PRIMARY_ORDER = ["blue", "pink", "yellow"] as const;

function buildSapphireSubcategories(): ProductSubcategoryOption[] {
  const fromLanding = sapphireLandingCategories
    .filter((card) => card.id !== "all-sapphires")
    .map((card) => ({
      value: card.id,
      label: card.title.replace(/\s+Sapphire$/i, "").trim() || card.title,
    }));

  const byValue = new Map(fromLanding.map((o) => [o.value, o]));
  const ordered: ProductSubcategoryOption[] = [];

  for (const id of SAPPHIRE_PRIMARY_ORDER) {
    const opt = byValue.get(id);
    if (opt) {
      ordered.push(opt);
      byValue.delete(id);
    }
  }

  for (const opt of fromLanding) {
    if (byValue.has(opt.value)) {
      ordered.push(opt);
      byValue.delete(opt.value);
    }
  }

  return ordered;
}

/**
 * Optional per-category overrides for level-2 options.
 * Add a new stone here when it needs colours beyond the shared list.
 */
const CATEGORY_SUBCATEGORY_OVERRIDES: Partial<
  Record<ProductCategory, ProductSubcategoryOption[]>
> = {
  sapphires: buildSapphireSubcategories(),
  jewellery: [],
};

const GEMSTONE_CATEGORIES_USING_SHARED_COLORS: ProductCategory[] =
  PRODUCT_CATEGORIES.map((c) => c.value).filter(
    (value) => value !== "sapphires" && value !== "jewellery",
  );

function buildByCategory(): Record<string, ProductSubcategoryOption[]> {
  const map: Record<string, ProductSubcategoryOption[]> = {
    sapphires: CATEGORY_SUBCATEGORY_OVERRIDES.sapphires ?? [],
    jewellery: [],
  };

  for (const category of GEMSTONE_CATEGORIES_USING_SHARED_COLORS) {
    map[category] =
      CATEGORY_SUBCATEGORY_OVERRIDES[category] ?? SHARED_GEM_COLOR_SUBCATEGORIES;
  }

  return map;
}

const BY_CATEGORY = buildByCategory();

export function getSubcategoriesForCategory(
  category: string,
): ProductSubcategoryOption[] {
  return BY_CATEGORY[category] ?? [];
}

/** True when this stone category supports a level-2 colour/variety picker. */
export function categoryHasSubcategories(category: string): boolean {
  return getSubcategoriesForCategory(category).length > 0;
}

export function isValidSubcategory(
  category: string,
  slug: string | null | undefined,
): boolean {
  if (!slug) return false;
  const normalized = slug.trim().toLowerCase();
  return getSubcategoriesForCategory(category).some((o) => o.value === normalized);
}

export function getSubcategoryLabel(
  category: string,
  slug: string | null | undefined,
): string | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return getSubcategoriesForCategory(category).find((o) => o.value === normalized)
    ?.label;
}

/** Catalog URL for a category + optional colour subcategory. */
export function getCatalogHrefForCategorySubcategory(
  category: string,
  subcategory?: string | null,
): string {
  const params = new URLSearchParams();
  params.set("category", category);
  if (subcategory?.trim()) {
    params.set("color", subcategory.trim().toLowerCase());
  }
  return `/catalog?${params.toString()}`;
}
