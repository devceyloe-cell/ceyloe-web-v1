import { getDb } from "@/lib/mongodb/client";

const COLLECTION = "site_settings";
const DOC_ID = "hero_images";

/** Map of hero page key → uploaded image URL override */
export type HeroImageOverrides = Record<string, string>;

export async function getHeroImages(): Promise<HeroImageOverrides> {
  try {
    const db = await getDb();
    if (!db) return {};
    const doc = await db
      .collection<{ _id: string; overrides: HeroImageOverrides }>(COLLECTION)
      .findOne({ _id: DOC_ID });
    return doc?.overrides ?? {};
  } catch {
    return {};
  }
}

export async function saveHeroImages(overrides: HeroImageOverrides): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    await db
      .collection<{ _id: string; overrides: HeroImageOverrides }>(COLLECTION)
      .updateOne(
        { _id: DOC_ID },
        { $set: { overrides } },
        { upsert: true },
      );
    return true;
  } catch {
    return false;
  }
}
