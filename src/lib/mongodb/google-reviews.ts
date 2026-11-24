import { ObjectId } from "mongodb";
import { revalidateTag, unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb/client";
import {
  googleBusiness,
  googleReviewStats as staticStats,
  googleReviews as staticTestimonials,
} from "@/data/google-reviews";
import type { Testimonial } from "@/types";

const COLLECTION = "google_reviews";
const SETTINGS_KEY = "google-reviews";
const CACHE_TAG = "google-reviews";
const REVALIDATE_SECONDS = 60;

export type GoogleReviewDoc = {
  name: string;
  rating: number;
  dateLabel: string;
  text: string;
  textComplete: boolean;
  hasPhoto?: boolean;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GoogleReview = GoogleReviewDoc & { id: string };

export type GoogleReviewSettings = {
  name: string;
  address: string;
  platform: string;
  rating: number;
  reviewCount: number;
  sourceUrl: string;
  updatedAt?: string;
};

export type GoogleReviewInput = {
  name: string;
  rating: number;
  dateLabel: string;
  text?: string | null;
  textComplete?: boolean;
  hasPhoto?: boolean;
  sortOrder?: number;
  published?: boolean;
};

function toReview(doc: GoogleReviewDoc & { _id: ObjectId }): GoogleReview {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() };
}

function quoteFromReview(review: Pick<GoogleReviewDoc, "text" | "textComplete" | "hasPhoto">) {
  const text = review.text?.trim();
  if (!text) {
    if (review.hasPhoto) return "Shared photos from their visit.";
    return null;
  }
  return review.textComplete === false ? `${text.trimEnd()}…` : text;
}

export function reviewToTestimonial(review: GoogleReview): Testimonial | null {
  const quote = quoteFromReview(review);
  if (!quote) return null;
  return {
    id: review.id,
    name: review.name,
    location: `Google · ${review.dateLabel}`,
    quote,
    rating: review.rating,
    date: review.dateLabel,
  };
}

const DEFAULT_SETTINGS: GoogleReviewSettings = {
  name: googleBusiness.name,
  address: googleBusiness.address,
  platform: googleBusiness.platform,
  rating: googleBusiness.rating,
  reviewCount: googleBusiness.reviewCount,
  sourceUrl: googleBusiness.sourceUrl,
};

function normalizeSettings(input: Partial<GoogleReviewSettings> | null | undefined): GoogleReviewSettings {
  return {
    name: String(input?.name || DEFAULT_SETTINGS.name).trim() || DEFAULT_SETTINGS.name,
    address: String(input?.address || DEFAULT_SETTINGS.address).trim() || DEFAULT_SETTINGS.address,
    platform: String(input?.platform || "Google").trim() || "Google",
    rating: Math.min(5, Math.max(0, Number(input?.rating) || DEFAULT_SETTINGS.rating)),
    reviewCount: Math.max(0, Math.round(Number(input?.reviewCount) || 0)),
    sourceUrl: String(input?.sourceUrl || DEFAULT_SETTINGS.sourceUrl).trim() || DEFAULT_SETTINGS.sourceUrl,
    updatedAt: input?.updatedAt,
  };
}

export async function getGoogleReviewSettings(): Promise<GoogleReviewSettings> {
  try {
    const db = await getDb();
    if (!db) return DEFAULT_SETTINGS;
    const doc = await db.collection("site_settings").findOne({ key: SETTINGS_KEY });
    if (!doc) return DEFAULT_SETTINGS;
    return normalizeSettings(doc as Partial<GoogleReviewSettings>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveGoogleReviewSettings(
  input: Partial<GoogleReviewSettings>,
): Promise<GoogleReviewSettings | null> {
  const db = await getDb();
  if (!db) return null;
  const normalized = normalizeSettings({
    ...input,
    updatedAt: new Date().toISOString(),
  });
  await db.collection("site_settings").updateOne(
    { key: SETTINGS_KEY },
    {
      $set: {
        key: SETTINGS_KEY,
        name: normalized.name,
        address: normalized.address,
        platform: normalized.platform,
        rating: normalized.rating,
        reviewCount: normalized.reviewCount,
        sourceUrl: normalized.sourceUrl,
        updatedAt: normalized.updatedAt,
      },
    },
    { upsert: true },
  );
  revalidateTag(CACHE_TAG, "max");
  return normalized;
}

export async function listGoogleReviews(opts?: {
  publishedOnly?: boolean;
}): Promise<GoogleReview[]> {
  const db = await getDb();
  if (!db) return [];
  const filter = opts?.publishedOnly ? { published: true } : {};
  const docs = await db
    .collection<GoogleReviewDoc>(COLLECTION)
    .find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .toArray();
  return docs.map((d) => toReview(d as GoogleReviewDoc & { _id: ObjectId }));
}

export async function getGoogleReviewById(id: string): Promise<GoogleReview | null> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return null;
  const doc = await db.collection<GoogleReviewDoc>(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toReview(doc as GoogleReviewDoc & { _id: ObjectId }) : null;
}

function normalizeInput(input: GoogleReviewInput): Omit<GoogleReviewDoc, "createdAt" | "updatedAt"> {
  const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 5)));
  const name = String(input.name || "").trim();
  if (!name) throw new Error("Reviewer name is required");
  const dateLabel = String(input.dateLabel || "").trim() || "Recently";
  const text = String(input.text || "").trim();
  return {
    name,
    rating,
    dateLabel,
    text,
    textComplete: input.textComplete !== false,
    hasPhoto: Boolean(input.hasPhoto),
    sortOrder: typeof input.sortOrder === "number" ? input.sortOrder : 0,
    published: input.published !== false,
  };
}

export async function createGoogleReview(input: GoogleReviewInput): Promise<GoogleReview> {
  const db = await getDb();
  if (!db) throw new Error("MongoDB is not configured");
  const now = new Date().toISOString();
  const fields = normalizeInput(input);
  const count = await db.collection(COLLECTION).countDocuments();
  const doc: GoogleReviewDoc = {
    ...fields,
    sortOrder: typeof input.sortOrder === "number" ? input.sortOrder : count,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection<GoogleReviewDoc>(COLLECTION).insertOne(doc);
  revalidateTag(CACHE_TAG, "max");
  return { ...doc, id: result.insertedId.toString() };
}

export async function updateGoogleReview(
  id: string,
  input: GoogleReviewInput,
): Promise<GoogleReview | null> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return null;
  const fields = normalizeInput(input);
  const now = new Date().toISOString();
  await db.collection<GoogleReviewDoc>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...fields, updatedAt: now } },
  );
  revalidateTag(CACHE_TAG, "max");
  return getGoogleReviewById(id);
}

export async function deleteGoogleReview(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return false;
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  revalidateTag(CACHE_TAG, "max");
  return result.deletedCount > 0;
}

export async function seedGoogleReviewsIfEmpty(): Promise<{ seeded: boolean; count: number }> {
  const db = await getDb();
  if (!db) return { seeded: false, count: 0 };
  const existing = await db.collection(COLLECTION).countDocuments();
  if (existing > 0) return { seeded: false, count: existing };

  const now = new Date().toISOString();
  const docs: GoogleReviewDoc[] = staticTestimonials.map((t, index) => ({
    name: t.name,
    rating: t.rating,
    dateLabel: t.date || "Recently",
    text: t.quote.replace(/…$/, "").trim(),
    textComplete: !t.quote.endsWith("…"),
    sortOrder: index,
    published: true,
    createdAt: now,
    updatedAt: now,
  }));

  // Also seed rating-only reviews that were filtered out of testimonials
  if (docs.length === 0) {
    return { seeded: false, count: 0 };
  }

  await db.collection<GoogleReviewDoc>(COLLECTION).insertMany(docs);
  await saveGoogleReviewSettings({
    ...DEFAULT_SETTINGS,
    rating: staticStats.averageRating,
    reviewCount: staticStats.totalReviews,
    sourceUrl: staticStats.pageUrl,
  });
  revalidateTag(CACHE_TAG, "max");
  return { seeded: true, count: docs.length };
}

async function fetchStorefrontGoogleReviews(): Promise<{
  testimonials: Testimonial[];
  stats: { averageRating: number; totalReviews: number; pageUrl: string };
}> {
  try {
    const [reviews, settings] = await Promise.all([
      listGoogleReviews({ publishedOnly: true }),
      getGoogleReviewSettings(),
    ]);
    const testimonials = reviews
      .map(reviewToTestimonial)
      .filter((t): t is Testimonial => Boolean(t));

    if (testimonials.length === 0) {
      return {
        testimonials: staticTestimonials,
        stats: {
          averageRating: staticStats.averageRating,
          totalReviews: staticStats.totalReviews,
          pageUrl: staticStats.pageUrl,
        },
      };
    }

    return {
      testimonials,
      stats: {
        averageRating: settings.rating,
        totalReviews: settings.reviewCount || testimonials.length,
        pageUrl: settings.sourceUrl,
      },
    };
  } catch {
    return {
      testimonials: staticTestimonials,
      stats: {
        averageRating: staticStats.averageRating,
        totalReviews: staticStats.totalReviews,
        pageUrl: staticStats.pageUrl,
      },
    };
  }
}

export const getStorefrontGoogleReviews = unstable_cache(
  fetchStorefrontGoogleReviews,
  [CACHE_TAG],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] },
);
