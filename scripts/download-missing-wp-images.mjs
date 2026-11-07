/**
 * Download remaining product photos from https://ceyloe.com/wp-content/uploads
 * into public/product-images and rewrite MongoDB image fields.
 *
 * Usage: node --env-file=.env.local scripts/download-missing-wp-images.mjs
 */
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { MongoClient } from "mongodb";

const ROOT = join(process.cwd(), "public", "product-images");
const WP = /(?:^https?:\/\/(?:www\.)?ceyloe\.com)?\/wp-content\/uploads\//i;

mkdirSync(ROOT, { recursive: true });

function filenameFromUrl(url) {
  try {
    return decodeURIComponent(new URL(url, "https://ceyloe.com").pathname.split("/").pop() || "");
  } catch {
    return basename(String(url));
  }
}

function absoluteWpUrl(url) {
  if (/^https?:\/\//i.test(url)) return url.replace("https://www.ceyloe.com", "https://ceyloe.com");
  if (url.startsWith("/wp-content/")) return `https://ceyloe.com${url}`;
  return url;
}

async function download(url, dest) {
  if (existsSync(dest)) return { ok: true, skipped: true };
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "CeyloeImageRestore/1.0" },
  });
  if (!res.ok || !res.body) return { ok: false, status: res.status };
  const type = res.headers.get("content-type") || "";
  if (!type.startsWith("image/")) return { ok: false, status: res.status, type };
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return { ok: true, skipped: false };
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const products = client.db(process.env.MONGODB_DB_NAME || "ceyloe").collection("products");
const docs = await products.find({}).toArray();

const needed = new Map();
for (const doc of docs) {
  for (const url of [doc.image, ...(doc.images || []), doc.certificationUrl]) {
    if (typeof url !== "string" || !WP.test(url)) continue;
    const name = filenameFromUrl(url);
    if (!name) continue;
    needed.set(absoluteWpUrl(url), name);
  }
}

console.log(`Missing wp-content URLs: ${needed.size}`);

let downloaded = 0;
let skipped = 0;
let failed = 0;
const failures = [];

for (const [url, name] of needed) {
  const dest = join(ROOT, name);
  try {
    const result = await download(url, dest);
    if (!result.ok) {
      failed += 1;
      failures.push({ url, ...result });
      console.log(`MISS ${name} status=${result.status} type=${result.type || ""}`);
      continue;
    }
    if (result.skipped) {
      skipped += 1;
      console.log(`HAVE ${name}`);
    } else {
      downloaded += 1;
      console.log(`OK   ${name}`);
    }
  } catch (error) {
    failed += 1;
    failures.push({ url, error: error instanceof Error ? error.message : String(error) });
    console.log(`ERR  ${name}: ${error instanceof Error ? error.message : error}`);
  }
}

function toPublic(url) {
  if (typeof url !== "string" || !WP.test(url)) return url;
  const name = filenameFromUrl(url);
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
    {
      $set: {
        image,
        images,
        certificationUrl,
        updatedAt: new Date().toISOString(),
      },
    },
  );
  updated += 1;
}

const remaining = await products.countDocuments({
  $or: [{ image: /wp-content\/uploads/ }, { images: /wp-content\/uploads/ }],
});

const report = {
  needed: needed.size,
  downloaded,
  skippedExisting: skipped,
  failed,
  productsUpdated: updated,
  productsStillWithWpUrls: remaining,
  failures,
};
writeFileSync(join(process.cwd(), "scripts", "download-missing-wp-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await client.close();
