import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import {
  createGoogleReview,
  getGoogleReviewSettings,
  listGoogleReviews,
  saveGoogleReviewSettings,
  seedGoogleReviewsIfEmpty,
  type GoogleReviewInput,
  type GoogleReviewSettings,
} from "@/lib/mongodb/google-reviews";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  await seedGoogleReviewsIfEmpty();
  const [reviews, settings] = await Promise.all([
    listGoogleReviews(),
    getGoogleReviewSettings(),
  ]);
  return NextResponse.json({ reviews, settings });
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));

  if (body && typeof body === "object" && body.action === "saveSettings") {
    const settings = await saveGoogleReviewSettings(body.settings as Partial<GoogleReviewSettings>);
    if (!settings) {
      return NextResponse.json({ error: "Could not save settings" }, { status: 500 });
    }
    return NextResponse.json({ settings });
  }

  try {
    const review = await createGoogleReview(body as GoogleReviewInput);
    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create review" },
      { status: 400 },
    );
  }
}
