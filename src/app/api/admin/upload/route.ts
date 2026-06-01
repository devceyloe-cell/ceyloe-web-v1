import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/admin/auth";
import { CMS_UPLOADS_DIR } from "@/lib/cms/paths";

export async function POST(request: NextRequest) {
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

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "Max file size is 5MB" }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(CMS_UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(CMS_UPLOADS_DIR, filename), bytes);

  return NextResponse.json({ url: `/cms-uploads/${filename}` });
}
