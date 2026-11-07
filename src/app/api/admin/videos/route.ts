import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { isCeyloeBlobConfigured } from "@/lib/blob/config";
import { listBlobVideos } from "@/lib/blob/list-videos";
import { assignProductVideoInDb, getAllProductsFromDb } from "@/lib/mongodb/products";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }
  if (!isCeyloeBlobConfigured()) {
    return NextResponse.json({ error: "Vercel Blob is not configured." }, { status: 503 });
  }

  try {
    const [videos, products] = await Promise.all([listBlobVideos(), getAllProductsFromDb()]);
    return NextResponse.json({
      videos,
      products: products.map((product) => ({
        id: product.id,
        handle: product.handle,
        title: product.title,
        videoUrl: product.videoUrl || "",
      })),
    });
  } catch (error) {
    console.error("[admin/videos]", error);
    const message = error instanceof Error ? error.message : "Could not load videos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    productId?: unknown;
    videoUrl?: unknown;
  } | null;

  const productId = typeof body?.productId === "string" ? body.productId : "";
  const videoUrl = typeof body?.videoUrl === "string" ? body.videoUrl.trim() : "";

  if (!productId || !videoUrl) {
    return NextResponse.json({ error: "Choose a product and a video." }, { status: 400 });
  }

  const saved = await assignProductVideoInDb(productId, videoUrl);
  if (!saved) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  revalidateTag("products", "max");
  return NextResponse.json({ success: true });
}
