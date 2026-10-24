import { revalidateTag, unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb/client";
import {
  normalizeAllOverrides,
  type HeroContentOverride,
  type HeroContentOverrides,
  type HeroOverrideRaw,
} from "@/lib/hero/content";

const COLLECTION = "site_settings";
const DOC_ID = "hero_images";
const CACHE_TAG = "hero-images";
const REVALIDATE_SECONDS = 60;

/** @deprecated Prefer HeroContentOverrides — kept for call-site compatibility. */
export type HeroImageOverrides = HeroContentOverrides;

async function fetchHeroImages(): Promise<HeroContentOverrides> {
  try {
    const db = await getDb();
    if (!db) return {};
    const doc = await db
      .collection<{ _id: string; overrides: HeroContentOverrides }>(COLLECTION)
      .findOne({ _id: DOC_ID });
    return normalizeAllOverrides(doc?.overrides);
  } catch {
    return {};
  }
}

export const getHeroImages = unstable_cache(fetchHeroImages, [CACHE_TAG], {
  revalidate: REVALIDATE_SECONDS,
  tags: [CACHE_TAG],
});

export async function saveHeroImages(overrides: HeroContentOverrides): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;

    const normalized = normalizeAllOverrides(overrides);

    await db
      .collection<{ _id: string; overrides: Record<string, HeroContentOverride> }>(COLLECTION)
      .updateOne(
        { _id: DOC_ID },
        { $set: { overrides: normalized } },
        { upsert: true },
      );

    revalidateTag(CACHE_TAG, "max");
    return true;
  } catch {
    return false;
  }
}

export function getHeroOverride(
  overrides: HeroContentOverrides,
  key: string,
): HeroOverrideRaw | undefined {
  return overrides[key];
}
