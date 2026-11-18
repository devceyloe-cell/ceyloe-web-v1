/** Brand prefix shown to customers. */
export const PRODUCT_SKU_PREFIX = "CEY-";

/** First auto-assigned number per category (display: CEY-SAP-10001). */
export const PRODUCT_SKU_START = 10001;

/** Short category codes for readable SKUs. */
export const PRODUCT_SKU_CATEGORY_CODES: Record<string, string> = {
  sapphires: "SAP",
  ruby: "RUB",
  spinel: "SPI",
  garnet: "GAR",
  topaz: "TOP",
  citrine: "CIT",
  tourmaline: "TOU",
  zircon: "ZIR",
  other: "OTH",
  jewellery: "JWL",
};

export function skuCategoryCode(category: string | undefined | null): string {
  const key = String(category || "")
    .trim()
    .toLowerCase();
  if (PRODUCT_SKU_CATEGORY_CODES[key]) return PRODUCT_SKU_CATEGORY_CODES[key];
  const letters = key.replace(/[^a-z]/g, "").slice(0, 3).toUpperCase();
  return letters || "GEN";
}

/** Strip brand prefix only (CEY-). */
export function stripBrandPrefix(value: string | undefined | null): string {
  return String(value || "")
    .trim()
    .replace(/^CEY-+/i, "")
    .trim();
}

/**
 * Normalize stored SKU core to CATEGORY-NUMBER (e.g. SAP-10001).
 * Accepts: "10001", "SAP-10001", "CEY-SAP-10001", "CEY-10001".
 */
export function normalizeProductSku(
  value: string | undefined | null,
  category?: string | null,
): string | undefined {
  const raw = stripBrandPrefix(value);
  if (!raw) return undefined;

  const catMatch = raw.match(/^([A-Za-z]{2,4})-(\d+)$/);
  if (catMatch) {
    return `${catMatch[1].toUpperCase()}-${catMatch[2]}`;
  }

  if (/^\d+$/.test(raw)) {
    return `${skuCategoryCode(category)}-${raw}`;
  }

  // Keep custom non-numeric cores, but attach category when missing
  if (!raw.includes("-") && category) {
    return `${skuCategoryCode(category)}-${raw}`;
  }
  return raw;
}

/** Display SKU with brand + category, e.g. CEY-SAP-10001 */
export function formatProductSku(
  value: string | undefined | null,
  category?: string | null,
): string | undefined {
  const core = normalizeProductSku(value, category);
  if (!core) return undefined;
  return `${PRODUCT_SKU_PREFIX}${core}`;
}

export function parseSkuParts(
  value: string | undefined | null,
): { code: string; number: number } | null {
  const core = stripBrandPrefix(value);
  const match = core.match(/^([A-Za-z]{2,4})-(\d+)$/) || core.match(/^(\d+)$/);
  if (!match) return null;
  if (match.length === 2) {
    const n = Number(match[1]);
    return Number.isFinite(n) ? { code: "", number: n } : null;
  }
  const n = Number(match[2]);
  return Number.isFinite(n) ? { code: match[1].toUpperCase(), number: n } : null;
}

/** Next number for a category given existing stored cores. */
export function nextSkuNumberForCategory(
  category: string | undefined | null,
  existingCores: Array<string | undefined | null>,
): number {
  const code = skuCategoryCode(category);
  let max = PRODUCT_SKU_START - 1;
  for (const raw of existingCores) {
    const parts = parseSkuParts(raw);
    if (!parts) continue;
    // Count plain numbers or matching category codes toward this series
    if (parts.code && parts.code !== code) continue;
    if (parts.number > max) max = parts.number;
  }
  return max + 1;
}

export function buildSkuCore(category: string | undefined | null, n: number): string {
  return `${skuCategoryCode(category)}-${n}`;
}

/** Number-only part for admin input (without category code). */
export function skuNumberOnly(value: string | undefined | null): string {
  const parts = parseSkuParts(value);
  if (parts) return String(parts.number);
  const raw = stripBrandPrefix(value);
  const tail = raw.split("-").pop() || raw;
  return tail;
}
