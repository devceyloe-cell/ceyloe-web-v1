import { MongoClient } from "mongodb";
import { list } from "@vercel/blob";

const token =
  process.env.CEYLOE_READ_WRITE_TOKEN?.trim() ||
  process.env.BLOB_READ_WRITE_TOKEN?.trim();
const uri = process.env.MONGODB_URI?.trim();

if (!token) {
  console.error("Blob token is not configured");
  process.exit(1);
}
if (!uri) {
  console.error("MONGODB_URI is not configured");
  process.exit(1);
}

function handleFromPath(pathname) {
  const match = pathname.match(/^videos\/(.+)\.mp4$/i);
  return match ? match[1] : null;
}

const urlByHandle = new Map();
let cursor;
do {
  const page = await list({ prefix: "videos/", limit: 1000, cursor, token });
  for (const blob of page.blobs) {
    const handle = handleFromPath(blob.pathname);
    if (handle) urlByHandle.set(handle.toLowerCase(), blob.pathname);
  }
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);

const client = new MongoClient(uri);
await client.connect();
const dbName = process.env.MONGODB_DB_NAME?.trim() || "ceyloe";
const docs = await client
  .db(dbName)
  .collection("products")
  .find({}, { projection: { handle: 1, title: 1, videoUrl: 1 } })
  .toArray();
await client.close();

const productHandles = new Set();
const productsWithoutBlob = [];

for (const doc of docs) {
  const handle = typeof doc.handle === "string" ? doc.handle.trim().toLowerCase() : "";
  if (!handle) continue;
  productHandles.add(handle);
  if (!urlByHandle.has(handle)) {
    productsWithoutBlob.push({
      handle,
      title: doc.title || "",
      videoUrl: doc.videoUrl || "",
    });
  }
}

const blobsWithoutProduct = [...urlByHandle.keys()]
  .filter((handle) => !productHandles.has(handle))
  .sort();

productsWithoutBlob.sort((a, b) => a.handle.localeCompare(b.handle));

console.log(
  JSON.stringify(
    {
      productCount: productHandles.size,
      blobVideoCount: urlByHandle.size,
      productsWithoutBlobVideo: productsWithoutBlob,
      blobVideosWithoutProduct: blobsWithoutProduct,
    },
    null,
    2,
  ),
);
