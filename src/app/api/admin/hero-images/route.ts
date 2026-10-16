import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { getHeroImages, saveHeroImages } from "@/lib/mongodb/hero-images";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const overrides = await getHeroImages();
  return NextResponse.json({ overrides });
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body || typeof body.overrides !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const ok = await saveHeroImages(body.overrides);
    if (!ok) {
      return NextResponse.json({ error: "Could not save hero images. Check MongoDB connection." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
