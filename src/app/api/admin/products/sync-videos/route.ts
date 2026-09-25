import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { isCeyloeBlobConfigured } from "@/lib/blob/config";
import { syncProductVideoUrlsFromBlob } from "@/lib/blob/sync-product-videos";

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured." }, { status: 503 });
  }

  if (!isCeyloeBlobConfigured()) {
    return NextResponse.json(
      { error: "Vercel Blob is not configured. Set CEYLOE_READ_WRITE_TOKEN." },
      { status: 503 },
    );
  }

  try {
    const result = await syncProductVideoUrlsFromBlob();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[admin/products/sync-videos]", error);
    const message = error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
