import {
  normalizeHeroOverride,
  titleToLines,
  type HeroContentOverride,
  type HeroOverrideRaw,
} from "@/lib/hero/content";

/** Resolve display copy for white-cover heroes from optional Mongo overrides. */
export function resolveHeroCopy(
  defaults: {
    image: string;
    title: string | string[];
    description?: string;
    eyebrow?: string;
  },
  raw?: HeroOverrideRaw | null,
) {
  const o = normalizeHeroOverride(raw);
  const defaultLines = Array.isArray(defaults.title) ? defaults.title : [defaults.title];
  const titleLines = titleToLines(o.title) ?? defaultLines;

  return {
    image: o.image || defaults.image,
    eyebrow: o.eyebrow ?? defaults.eyebrow,
    titleLines,
    title: titleLines.join(" "),
    description: o.description ?? defaults.description,
    override: o,
  };
}

export type { HeroContentOverride };
