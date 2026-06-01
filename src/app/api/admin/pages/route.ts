import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { getAllPages, savePage, isSlugTaken } from "@/lib/cms/local-store";
import { isReservedSlug } from "@/lib/cms/reserved-slugs";
import type { CmsPage } from "@/lib/cms/types";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const pages = await getAllPages(true);
  return NextResponse.json({ pages });
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = (await request.json()) as CmsPage;

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = body.slug?.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  if (isReservedSlug(slug)) {
    return NextResponse.json({ error: "This slug is reserved" }, { status: 400 });
  }

  if (await isSlugTaken(slug, body.id)) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const page: CmsPage = {
    ...body,
    id: body.id || crypto.randomUUID(),
    slug,
    createdAt: body.createdAt || now,
    updatedAt: now,
  };

  const saved = await savePage(page);
  return NextResponse.json({ page: saved });
}
