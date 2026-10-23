import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import {
  getTypeSubcategories,
  saveTypeSubcategories,
} from "@/lib/mongodb/gemstone-type-subcategories";
import {
  isEditableSubcategoryType,
  type GemstoneTypeSubcategories,
} from "@/lib/gemstones/type-subcategories";

type RouteContext = { params: Promise<{ type: string }> };

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { type } = await context.params;
  if (!isEditableSubcategoryType(type)) {
    return NextResponse.json({ error: "Unknown gemstone type" }, { status: 404 });
  }

  const section = await getTypeSubcategories(type);
  if (!section) {
    return NextResponse.json({ error: "No subcategory cards for this type" }, { status: 404 });
  }

  return NextResponse.json({ section, mongoConfigured: isMongoConfigured() });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is required to save subcategory cards." },
      { status: 503 },
    );
  }

  const { type } = await context.params;
  if (!isEditableSubcategoryType(type)) {
    return NextResponse.json({ error: "Unknown gemstone type" }, { status: 404 });
  }

  const body = (await request.json()) as Partial<GemstoneTypeSubcategories>;
  const saved = await saveTypeSubcategories(type, body);

  if (!saved) {
    return NextResponse.json({ error: "Could not save subcategory cards." }, { status: 500 });
  }

  return NextResponse.json({ section: saved });
}
