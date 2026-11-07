/**
 * Download any remaining blob product images into public/product-images
 * and rewrite MongoDB fields to /product-images/{filename}.
 */
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { MongoClient } from "mongodb";

const ROOT = join(process.cwd(), "public", "product-images");
mkdirSync(ROOT, { recursive: true });

async function download(url, dest) {
  if (existsSync(dest)) return true;
  const res = await fetch(url);
  if (!res.ok || !res.body) return false;
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return true;
}

function filename(url) {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
  } catch {
    return basename(String(url));
  }
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const products = client.db(process.env.MONGODB_DB_NAME || "ceyloe").collection("products");
const docs = await products.find({}).toArray();

const blobUrls = new Set();
for (const doc of docs) {
  for (const url of [doc.image, ...(doc.images || []), doc.certificationUrl]) {
    if (typeof url === "string" && url.includes("blob.vercel-storage.com")) blobUrls.add(url);
  }
}

let saved = 0;
for (const url of blobUrls) {
  const name = filename(url);
  if (!name) continue;
  const ok = await download(url, join(ROOT, name));
  if (ok) {
    saved += 1;
    console.log("saved", name);
  } else {
    console.log("MISS", url);
  }
}

function toPublic(url) {
  if (typeof url !== "string" || !url.includes("blob.vercel-storage.com")) return url;
  const name = filename(url);
  if (!name || !existsSync(join(ROOT, name))) return url;
  return `/product-images/${name}`;
}

let updated = 0;
for (const doc of docs) {
  const image = toPublic(doc.image);
  const images = (doc.images || []).map(toPublic);
  const certificationUrl = toPublic(doc.certificationUrl);
  const changed =
    image !== doc.image ||
    certificationUrl !== doc.certificationUrl ||
    JSON.stringify(images) !== JSON.stringify(doc.images || []);
  if (!changed) continue;
  await products.updateOne(
    { _id: doc._id },
    { $set: { image, images, certificationUrl, updatedAt: new Date().toISOString() } },
  );
  updated += 1;
}

console.log(JSON.stringify({ blobUrls: blobUrls.size, saved, updated }, null, 2));
await client.close();
