import { list } from "@vercel/blob";
import { getBlobReadWriteToken } from "@/lib/blob/config";

export type BlobVideo = {
  pathname: string;
  url: string;
  handleGuess: string;
};

function handleFromVideoPathname(pathname: string): string | null {
  const match = pathname.match(/^videos\/(.+)\.mp4$/i);
  return match ? match[1].toLowerCase() : null;
}

export async function listBlobVideos(): Promise<BlobVideo[]> {
  const token = getBlobReadWriteToken();
  if (!token) throw new Error("Vercel Blob is not configured. Set CEYLOE_READ_WRITE_TOKEN.");

  const videos: BlobVideo[] = [];
  let cursor: string | undefined;

  do {
    const page = await list({ prefix: "videos/", limit: 1000, cursor, token });
    for (const blob of page.blobs) {
      const handleGuess = handleFromVideoPathname(blob.pathname);
      if (!handleGuess || handleGuess.startsWith("_")) continue;
      videos.push({
        pathname: blob.pathname,
        url: blob.url,
        handleGuess,
      });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  videos.sort((a, b) => a.handleGuess.localeCompare(b.handleGuess));
  return videos;
}
