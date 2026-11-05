import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import {
  deleteProductFromDb,
  getProductByIdFromDb,
  isHandleTakenInDb,
  saveProductToDb,
} from "@/lib/mongodb/products";
import { normalizeAvailability } from "@/lib/product-availability";
import type { Product } from "@/types";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

function mongoRequired() {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is not configured. Set MONGODB_URI in environment variables." },
      { status: 503 },
    );
  }
  return null;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const authError = await requireAuth();
  if (authError) return authError;

  const mongoError = mongoRequired();
  if (mongoError) return mongoError;

  const { id } = await context.params;
  const product = await getProductByIdFromDb(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = await requireAuth();
  if (authError) return authError;

  const mongoError = mongoRequired();
  if (mongoError) return mongoError;

  const { id } = await context.params;
  const body = (await request.json()) as Product;

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const handle = (body.handle || body.title)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  if (await isHandleTakenInDb(handle, id)) {
    return NextResponse.json({ error: "Handle already exists" }, { status: 400 });
  }

  const availability = normalizeAvailability(body.availability, body.inStock ?? true);

  const saved = await saveProductToDb({
    ...body,
    id,
    handle,
    currency: body.currency || "AUD",
    images: body.images?.length ? body.images : body.image ? [body.image] : [],
    image: body.image || body.images?.[0] || "",
    specs: body.specs || {},
    availability,
    inStock: availability === "available",
  });

  revalidateTag("products", "max");
  return NextResponse.json({ product: saved });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authError = await requireAuth();
  if (authError) return authError;

  const mongoError = mongoRequired();
  if (mongoError) return mongoError;

  const { id } = await context.params;
  const deleted = await deleteProductFromDb(id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  revalidateTag("products", "max");
  return NextResponse.json({ success: true });
}
