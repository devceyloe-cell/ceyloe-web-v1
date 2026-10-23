import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import {
  getHomepageBannerSlides,
  saveHomepageBannerSlides,
} from "@/lib/mongodb/homepage-banner-slides";
import type { HomepageBannerSlides } from "@/lib/homepage/banner-slides";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const slides = await getHomepageBannerSlides();
  return NextResponse.json({ slides, mongoConfigured: isMongoConfigured() });
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is required to save homepage banner slides." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as Partial<HomepageBannerSlides>;
  const { slides, error } = await saveHomepageBannerSlides(body);

  if (!slides) {
    return NextResponse.json({ error: error || "Could not save banner slides." }, { status: 400 });
  }

  return NextResponse.json({ slides });
}
