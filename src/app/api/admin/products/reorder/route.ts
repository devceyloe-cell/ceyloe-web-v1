import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { reorderProductsInDb } from "@/lib/mongodb/products";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is not configured. Set MONGODB_URI in environment variables." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    orderedIds?: unknown;
  } | null;

  const orderedIds = Array.isArray(body?.orderedIds)
    ? body.orderedIds.filter((id): id is string => typeof id === "string" && id.length > 0)
    : [];

  if (orderedIds.length === 0) {
    return NextResponse.json({ error: "orderedIds is required" }, { status: 400 });
  }

  try {
    const updated = await reorderProductsInDb(orderedIds);
    revalidateTag("products", "max");
    return NextResponse.json({ updated, count: orderedIds.length });
  } catch (err) {
    console.error("[admin/products/reorder]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not save order" }, { status: 500 });
  }
}
