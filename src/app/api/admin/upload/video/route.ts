import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAuthenticated } from "@/lib/admin/auth";
import { getBlobReadWriteToken } from "@/lib/blob/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = getBlobReadWriteToken();
  if (!token) {
    return NextResponse.json(
      { error: "Vercel Blob is not configured. Set CEYLOE_READ_WRITE_TOKEN on Vercel." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("videos/") || !pathname.toLowerCase().endsWith(".mp4")) {
          throw new Error("Videos must be uploaded to videos/{handle}.mp4");
        }

        return {
          allowedContentTypes: ["video/mp4", "video/quicktime", "video/x-mp4"],
          maximumSizeInBytes: 512 * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[admin/upload/video]", error);
    const message = error instanceof Error ? error.message : "Video upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
