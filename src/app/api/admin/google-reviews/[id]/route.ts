import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import {
  deleteGoogleReview,
  updateGoogleReview,
  type GoogleReviewInput,
} from "@/lib/mongodb/google-reviews";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = await requireAuth();
  if (authError) return authError;
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as GoogleReviewInput;
  try {
    const review = await updateGoogleReview(id, body);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ review });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update review" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authError = await requireAuth();
  if (authError) return authError;
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const ok = await deleteGoogleReview(id);
  if (!ok) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
