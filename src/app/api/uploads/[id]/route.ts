import { NextRequest, NextResponse } from "next/server";
import { getUpload } from "@/lib/mongodb/uploads";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const upload = await getUpload(id);

  if (!upload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { file, stream } = upload;
  const chunks: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    stream.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    stream.on("error", reject);
    stream.on("end", () => resolve());
  });

  const body = Buffer.concat(chunks);
  const meta = file.metadata as { contentType?: string } | undefined;
  const contentType = meta?.contentType || "application/octet-stream";

  // Trusted image types only; force download for others
  const trustedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const isTrusted = trustedTypes.includes(contentType);

  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": isTrusted ? contentType : "application/octet-stream",
      "Content-Length": String(body.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      // Force download for untrusted types
      ...(isTrusted ? {} : { "Content-Disposition": "attachment" }),
    },
  });
}
