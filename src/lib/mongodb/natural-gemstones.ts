import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb/client";
import {
  DEFAULT_NATURAL_GEMSTONES,
  normalizeNaturalGemstones,
  type NaturalGemstonesSection,
} from "@/lib/gemstones/natural-categories";

const SETTINGS_KEY = "natural-gemstones";
const REVALIDATE_SECONDS = 60;

async function fetchNaturalGemstones(): Promise<NaturalGemstonesSection> {
  try {
    const db = await getDb();
    if (!db) return DEFAULT_NATURAL_GEMSTONES;

    const doc = await db.collection("site_settings").findOne({ key: SETTINGS_KEY });
    if (!doc) return DEFAULT_NATURAL_GEMSTONES;

    return normalizeNaturalGemstones(doc as Partial<NaturalGemstonesSection>);
  } catch {
    return DEFAULT_NATURAL_GEMSTONES;
  }
}

export const getNaturalGemstones = unstable_cache(
  fetchNaturalGemstones,
  ["natural-gemstones"],
  { revalidate: REVALIDATE_SECONDS, tags: ["natural-gemstones"] },
);

export async function saveNaturalGemstones(
  input: Partial<NaturalGemstonesSection>,
): Promise<NaturalGemstonesSection | null> {
  const db = await getDb();
  if (!db) return null;

  const normalized = normalizeNaturalGemstones({
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
        description: normalized.description,
        categories: normalized.categories,
        updatedAt: normalized.updatedAt,
      },
    },
    { upsert: true },
  );

  return normalized;
}
