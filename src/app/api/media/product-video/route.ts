import { NextRequest, NextResponse } from "next/server";
import { getCeyloeComVideoUrl } from "@/lib/ceyloe-com-video";
import { ceyloeBlobVideoUrlForHandle } from "@/lib/blob/config";

export const runtime = "nodejs";

function isBlobVideoUrl(url: string): boolean {
  return /\.public\.blob\.vercel-storage\.com\//i.test(url);
}

async function blobVideoReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get("handle")?.trim().toLowerCase();
  if (!handle) {
    return NextResponse.json({ error: "Missing handle" }, { status: 400 });
  }

  const blobUrl = ceyloeBlobVideoUrlForHandle(handle);
  if (await blobVideoReachable(blobUrl)) {
    return NextResponse.redirect(blobUrl, 307);
  }

  const ceyloeUrl = await getCeyloeComVideoUrl(handle);
  if (ceyloeUrl) {
    return NextResponse.redirect(ceyloeUrl, 307);
  }

  return NextResponse.json({ error: "Video not found" }, { status: 404 });
}
