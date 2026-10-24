import type { WebCoverContent } from "@/config/web-covers";

/** Per-page hero overrides saved in Mongo (image + optional copy). */
export type HeroContentOverride = {
  image?: string;
  /** Optional eyebrow above the title */
  eyebrow?: string;
  /** Title — use a newline for a second title line */
  title?: string;
  description?: string;
};

/** Legacy storage was a bare image URL string. */
export type HeroOverrideRaw = string | HeroContentOverride;

export type HeroContentOverrides = Record<string, HeroOverrideRaw>;

export function normalizeHeroOverride(
  raw: HeroOverrideRaw | null | undefined,
): HeroContentOverride {
  if (!raw) return {};
  if (typeof raw === "string") {
    const image = raw.trim();
    return image ? { image } : {};
  }
  return {
    image: raw.image?.trim() || undefined,
    eyebrow: raw.eyebrow?.trim() || undefined,
    title: raw.title?.trim() || undefined,
    description: raw.description?.trim() || undefined,
  };
}

export function heroOverrideImage(raw: HeroOverrideRaw | null | undefined): string | undefined {
  return normalizeHeroOverride(raw).image;
}

export function titleToLines(title?: string): string[] | undefined {
  if (!title?.trim()) return undefined;
  const lines = title
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines : undefined;
}

/** Merge Mongo override onto a static web cover (catalog heroes). */
export function mergeCoverWithOverride(
  base: WebCoverContent,
  raw?: HeroOverrideRaw | null,
): WebCoverContent {
  const o = normalizeHeroOverride(raw);
  if (!o.image && !o.title && !o.description && !o.eyebrow) return base;

  const titleLines = titleToLines(o.title) ?? base.titleLines;
  return {
    ...base,
    image: o.image || base.image,
    eyebrow: o.eyebrow ?? base.eyebrow,
    titleLines,
    title: o.title ? undefined : base.title,
    description: o.description ?? base.description,
  };
}

export function normalizeAllOverrides(
  input: HeroContentOverrides | null | undefined,
): Record<string, HeroContentOverride> {
  const out: Record<string, HeroContentOverride> = {};
  if (!input) return out;
  for (const [key, value] of Object.entries(input)) {
    const normalized = normalizeHeroOverride(value);
    if (normalized.image || normalized.title || normalized.description || normalized.eyebrow) {
      out[key] = normalized;
    }
  }
  return out;
}
