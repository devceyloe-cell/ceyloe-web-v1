/**
 * Sync MongoDB product videoUrl fields from Vercel Blob (videos/*.mp4).
 *
 * Usage: node --env-file=.env.local scripts/sync-product-videos-from-blob.mjs
 */

import { list } from "@vercel/blob";
import { MongoClient } from "mongodb";

const token = process.env.CEYLOE_READ_WRITE_TOKEN?.trim() || process.env.BLOB_READ_WRITE_TOKEN?.trim();
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "ceyloe";

if (!token) {
  console.error("Set CEYLOE_READ_WRITE_TOKEN or BLOB_READ_WRITE_TOKEN");
  process.exit(1);
}
if (!uri) {
  console.error("Set MONGODB_URI");
  process.exit(1);
}

function handleFromPathname(pathname) {
  const match = pathname.match(/^videos\/(.+)\.mp4$/i);
  return match ? match[1] : null;
}

const urlByHandle = new Map();
let cursor;
do {
  const page = await list({ prefix: "videos/", limit: 1000, cursor, token });
  for (const blob of page.blobs) {
    const handle = handleFromPathname(blob.pathname);
    if (handle) urlByHandle.set(handle, blob.url);
  }
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);

console.log(`Found ${urlByHandle.size} videos in Blob\n`);

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

const docs = await db.collection("products").find({}).toArray();
let updated = 0;

for (const doc of docs) {
  const handle = doc.handle;
  const blobUrl = urlByHandle.get(handle);
  if (!blobUrl || doc.videoUrl === blobUrl) continue;
  await db.collection("products").updateOne({ _id: doc._id }, { $set: { videoUrl: blobUrl } });
  updated++;
  console.log(`✓ ${handle}`);
}

await client.close();
console.log(`\nUpdated ${updated} product(s).`);
