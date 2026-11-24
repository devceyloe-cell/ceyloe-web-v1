import { getDb } from "@/lib/mongodb/client";

const COLLECTION = "rate_limits";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type RateLimitDoc = {
  key: string;
  count: number;
  windowStart: number;
  updatedAt: string;
};

/**
 * Fixed-window rate limit stored in MongoDB.
 * Fails open (allows) if Mongo is unavailable so login isn't bricked.
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  try {
    const db = await getDb();
    if (!db) {
      return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
    }

    const now = Date.now();
    const collection = db.collection<RateLimitDoc>(COLLECTION);
    await collection.createIndex({ key: 1 }, { unique: true });

    const existing = await collection.findOne({ key });
    if (!existing || now - existing.windowStart >= windowMs) {
      await collection.updateOne(
        { key },
        {
          $set: {
            key,
            count: 1,
            windowStart: now,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true },
      );
      return {
        allowed: true,
        remaining: Math.max(0, limit - 1),
        retryAfterSeconds: Math.ceil(windowMs / 1000),
      };
    }

    if (existing.count >= limit) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((existing.windowStart + windowMs - now) / 1000),
      );
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    await collection.updateOne(
      { key },
      {
        $inc: { count: 1 },
        $set: { updatedAt: new Date().toISOString() },
      },
    );

    return {
      allowed: true,
      remaining: Math.max(0, limit - existing.count - 1),
      retryAfterSeconds: Math.ceil((existing.windowStart + windowMs - now) / 1000),
    };
  } catch (err) {
    console.warn("[rate-limit] failed open:", err instanceof Error ? err.message : err);
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }
}

export function getRequestIp(request: { headers: Headers }): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

export const ADMIN_RATE_LIMITS = {
  login: { limit: 5, windowMs: 15 * 60 * 1000 },
  verifyOtp: { limit: 10, windowMs: 15 * 60 * 1000 },
  resendOtp: { limit: 3, windowMs: 15 * 60 * 1000 },
  forgotPassword: { limit: 5, windowMs: 15 * 60 * 1000 },
  resetPassword: { limit: 5, windowMs: 15 * 60 * 1000 },
} as const;
