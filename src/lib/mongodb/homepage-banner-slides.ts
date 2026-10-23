import { revalidateTag, unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb/client";
import {
  DEFAULT_HOMEPAGE_BANNER_SLIDES,
  normalizeHomepageBannerSlides,
  validateBannerSlideCount,
  type HomepageBannerSlides,
} from "@/lib/homepage/banner-slides";

const SETTINGS_KEY = "homepage-banner-slides";
const CACHE_TAG = "homepage-banner-slides";
const REVALIDATE_SECONDS = 60;

async function fetchHomepageBannerSlides(): Promise<HomepageBannerSlides> {
  try {
    const db = await getDb();
    if (!db) return DEFAULT_HOMEPAGE_BANNER_SLIDES;

    const doc = await db.collection("site_settings").findOne({ key: SETTINGS_KEY });
    if (!doc) return DEFAULT_HOMEPAGE_BANNER_SLIDES;

    return normalizeHomepageBannerSlides(doc as Partial<HomepageBannerSlides>);
  } catch {
    return DEFAULT_HOMEPAGE_BANNER_SLIDES;
  }
}

export const getHomepageBannerSlides = unstable_cache(
  fetchHomepageBannerSlides,
  [CACHE_TAG],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] },
);

export async function saveHomepageBannerSlides(
  input: Partial<HomepageBannerSlides>,
): Promise<{ slides: HomepageBannerSlides | null; error?: string }> {
  const db = await getDb();
  if (!db) return { slides: null, error: "MongoDB is not configured." };

  const normalized = normalizeHomepageBannerSlides({
    ...input,
    updatedAt: new Date().toISOString(),
  });

  const countError = validateBannerSlideCount(normalized.slides);
  if (countError) return { slides: null, error: countError };

  await db.collection("site_settings").updateOne(
    { key: SETTINGS_KEY },
    {
      $set: {
        key: SETTINGS_KEY,
        slides: normalized.slides,
        updatedAt: normalized.updatedAt,
      },
    },
    { upsert: true },
  );

  revalidateTag(CACHE_TAG, "max");
  return { slides: normalized };
}
