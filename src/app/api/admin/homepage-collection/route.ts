import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import {
  getHomepageCollection,
  saveHomepageCollection,
} from "@/lib/mongodb/homepage-collection";
import type { HomepageCollection } from "@/lib/homepage/collection";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const collection = await getHomepageCollection();
  return NextResponse.json({ collection, mongoConfigured: isMongoConfigured() });
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is required to save homepage collection." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as Partial<HomepageCollection>;
  const saved = await saveHomepageCollection(body);

  if (!saved) {
    return NextResponse.json({ error: "Could not save collection." }, { status: 500 });
  }

  return NextResponse.json({ collection: saved });
}
