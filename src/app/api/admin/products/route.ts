import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import {
  getAllProductsFromDb,
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

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const mongoError = mongoRequired();
  if (mongoError) return mongoError;

  const products = await getAllProductsFromDb();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const mongoError = mongoRequired();
  if (mongoError) return mongoError;

  const body = (await request.json()) as Product;

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!body.price || body.price <= 0) {
    return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
  }

  const handle = (body.handle || body.title)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  if (await isHandleTakenInDb(handle, body.id)) {
    return NextResponse.json({ error: "Handle already exists" }, { status: 400 });
  }

  const availability = normalizeAvailability(body.availability, body.inStock ?? true);

  const saved = await saveProductToDb({
    ...body,
    handle,
    currency: body.currency || "AUD",
    images: body.images?.length ? body.images : body.image ? [body.image] : [],
    image: body.image || body.images?.[0] || "",
    specs: body.specs || {},
    availability,
    inStock: availability === "available",
  });

  return NextResponse.json({ product: saved });
}
