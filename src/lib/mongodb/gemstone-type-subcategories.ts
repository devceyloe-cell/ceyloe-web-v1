import { revalidateTag, unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb/client";
import {
  getDefaultSubcategories,
  normalizeTypeSubcategories,
  type GemstoneTypeSubcategories,
} from "@/lib/gemstones/type-subcategories";

const REVALIDATE_SECONDS = 60;

function settingsKey(type: string) {
  return `gemstone-subcategories-${type}`;
}

function cacheTag(type: string) {
  return `gemstone-subcategories-${type}`;
}

async function fetchTypeSubcategories(type: string): Promise<GemstoneTypeSubcategories | null> {
  const defaults = getDefaultSubcategories(type);
  if (!defaults) return null;

  try {
    const db = await getDb();
    if (!db) return defaults;

    const doc = await db.collection("site_settings").findOne({ key: settingsKey(type) });
    if (!doc) return defaults;

    return normalizeTypeSubcategories(type, doc as Partial<GemstoneTypeSubcategories>);
  } catch {
    return defaults;
  }
}

export async function getTypeSubcategories(
  type: string,
): Promise<GemstoneTypeSubcategories | null> {
  const defaults = getDefaultSubcategories(type);
  if (!defaults) return null;

  const cached = unstable_cache(
    () => fetchTypeSubcategories(type),
    [cacheTag(type)],
    { revalidate: REVALIDATE_SECONDS, tags: [cacheTag(type)] },
  );

  return cached();
}

export async function saveTypeSubcategories(
  type: string,
  input: Partial<GemstoneTypeSubcategories>,
): Promise<GemstoneTypeSubcategories | null> {
  const db = await getDb();
  if (!db) return null;

  const normalized = normalizeTypeSubcategories(type, {
    ...input,
    updatedAt: new Date().toISOString(),
  });
  if (!normalized) return null;

  await db.collection("site_settings").updateOne(
    { key: settingsKey(type) },
    {
      $set: {
        key: settingsKey(type),
        type: normalized.type,
        title: normalized.title,
        cards: normalized.cards,
        updatedAt: normalized.updatedAt,
      },
    },
    { upsert: true },
  );

  revalidateTag(cacheTag(type), "max");
  return normalized;
}
