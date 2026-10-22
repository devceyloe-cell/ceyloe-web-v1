import { revalidateTag, unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb/client";
import {
  DEFAULT_HOMEPAGE_COLLECTION,
  normalizeHomepageCollection,
  type HomepageCollection,
} from "@/lib/homepage/collection";

const SETTINGS_KEY = "homepage-collection";
const CACHE_TAG = "homepage-collection";
const REVALIDATE_SECONDS = 60;

async function fetchHomepageCollection(): Promise<HomepageCollection> {
  try {
    const db = await getDb();
    if (!db) return DEFAULT_HOMEPAGE_COLLECTION;

    const doc = await db.collection("site_settings").findOne({ key: SETTINGS_KEY });
    if (!doc) return DEFAULT_HOMEPAGE_COLLECTION;

    return normalizeHomepageCollection(doc as Partial<HomepageCollection>);
  } catch {
    return DEFAULT_HOMEPAGE_COLLECTION;
  }
}

export const getHomepageCollection = unstable_cache(
  fetchHomepageCollection,
  [CACHE_TAG],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] },
);

export async function saveHomepageCollection(
  input: Partial<HomepageCollection>,
): Promise<HomepageCollection | null> {
  const db = await getDb();
  if (!db) return null;

  const normalized = normalizeHomepageCollection({
    ...input,
    updatedAt: new Date().toISOString(),
  });

  await db.collection("site_settings").updateOne(
    { key: SETTINGS_KEY },
    {
      $set: {
        key: SETTINGS_KEY,
        eyebrow: normalized.eyebrow,
        title: normalized.title,
        exploreLabel: normalized.exploreLabel,
        items: normalized.items,
        updatedAt: normalized.updatedAt,
      },
    },
    { upsert: true },
  );

  revalidateTag(CACHE_TAG, "max");
  return normalized;
}
