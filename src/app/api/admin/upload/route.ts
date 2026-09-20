import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { CMS_UPLOADS_DIR } from "@/lib/cms/paths";
import { saveUpload } from "@/lib/mongodb/uploads";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }

    const maxSize = 4.5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Max file size is 4.5MB on Vercel. Please compress the image and try again." },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    // Prefer MongoDB (works on Vercel). Local filesystem is only a fallback for offline/dev.
    if (isMongoConfigured()) {
      const saved = await saveUpload({
        filename,
        contentType: file.type,
        bytes,
        originalName: file.name,
      });

      if (!saved) {
        return NextResponse.json(
          { error: "Could not store upload in MongoDB." },
          { status: 500 },
        );
      }

      return NextResponse.json({ url: saved.url, id: saved.id });
    }

    // Local / non-Mongo fallback (not durable on serverless)
    await fs.mkdir(CMS_UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(CMS_UPLOADS_DIR, filename), bytes);
    return NextResponse.json({ url: `/cms-uploads/${filename}` });
  } catch (error) {
    console.error("[admin/upload]", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
