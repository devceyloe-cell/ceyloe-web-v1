import { list } from "@vercel/blob";
import { getDb } from "@/lib/mongodb/client";
import { getBlobReadWriteToken } from "@/lib/blob/config";

export type SyncProductVideosResult = {
  blobCount: number;
  updated: number;
  unchanged: number;
  unmatchedBlobHandles: string[];
  productsWithoutBlob: number;
};

function handleFromVideoPathname(pathname: string): string | null {
  const match = pathname.match(/^videos\/(.+)\.mp4$/i);
  return match ? match[1] : null;
}

export async function syncProductVideoUrlsFromBlob(): Promise<SyncProductVideosResult> {
  const token = getBlobReadWriteToken();
  if (!token) {
    throw new Error("Vercel Blob is not configured. Set CEYLOE_READ_WRITE_TOKEN.");
  }

  const urlByHandle = new Map<string, string>();
  let cursor: string | undefined;

  do {
    const page = await list({ prefix: "videos/", limit: 1000, cursor, token });
    for (const blob of page.blobs) {
      const handle = handleFromVideoPathname(blob.pathname);
      if (handle) urlByHandle.set(handle, blob.url);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const db = await getDb();
  if (!db) throw new Error("MongoDB is not configured");

  const docs = await db.collection("products").find({}).toArray();
  const productHandles = new Set<string>();
  let updated = 0;
  let unchanged = 0;
  let productsWithoutBlob = 0;

  for (const doc of docs) {
    const handle = typeof doc.handle === "string" ? doc.handle : "";
    if (!handle) continue;
    productHandles.add(handle);

    const blobUrl = urlByHandle.get(handle);
    if (!blobUrl) {
      if (!doc.videoUrl) productsWithoutBlob++;
      continue;
    }

    if (doc.videoUrl === blobUrl) {
      unchanged++;
      continue;
    }

    await db.collection("products").updateOne({ _id: doc._id }, { $set: { videoUrl: blobUrl } });
    updated++;
  }

  const unmatchedBlobHandles = [...urlByHandle.keys()].filter((h) => !productHandles.has(h));

  return {
    blobCount: urlByHandle.size,
    updated,
    unchanged,
    unmatchedBlobHandles,
    productsWithoutBlob,
  };
}
