/**
 * Upload local public/product-images files to Vercel Blob and rewrite
 * MongoDB product image fields that point at /product-images/...
 *
 * Needed because ceyloe.com is nginx (not Vercel) and the Vercel app
 * with output:"standalone" does not serve public/ static files.
 *
 * Usage: node --env-file=.env.local scripts/upload-product-images-to-blob.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { MongoClient } from "mongodb";
import { put } from "@vercel/blob";

const ROOT = join(process.cwd(), "public", "product-images");
const CONCURRENCY = 4;

function contentTypeFor(file) {
  const ext = extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function localPathFromPublicUrl(url) {
  if (typeof url !== "string") return null;
  if (!url.startsWith("/product-images/")) return null;
  const rel = url.slice("/product-images/".length).replace(/^\/+/, "");
  if (!rel || rel.includes("..")) return null;
  return join(ROOT, rel);
}

function blobPathnameFromPublicUrl(url) {
  return url.replace(/^\//, ""); // product-images/2024/03/foo.jpg
}

async function main() {
  const token =
    process.env.CEYLOE_READ_WRITE_TOKEN?.trim() ||
    process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const uri = process.env.MONGODB_URI?.trim();
  const dbName = process.env.MONGODB_DB_NAME?.trim() || "ceyloe";
  if (!token || !uri) {
    console.error("Missing blob token or MONGODB_URI");
    process.exit(1);
  }
  process.env.BLOB_READ_WRITE_TOKEN = token;

  const client = new MongoClient(uri);
  await client.connect();
  const products = client.db(dbName).collection("products");
  const docs = await products.find({}).toArray();

  /** @type {Map<string, string>} publicUrl -> local path */
  const needed = new Map();
  for (const doc of docs) {
    for (const url of [doc.image, ...(doc.images || [])]) {
      const local = localPathFromPublicUrl(url);
      if (!local) continue;
      if (!existsSync(local)) {
        console.log(`MISSING local file for ${url}`);
        continue;
      }
      needed.set(url, local);
    }
  }
  console.log(`Unique /product-images URLs to upload: ${needed.size}`);

  /** @type {Map<string, string>} publicUrl -> blobUrl */
  const urlMap = new Map();
  const queue = [...needed.entries()];
  let uploaded = 0;
  let failed = 0;
  const failures = [];

  async function worker() {
    while (queue.length) {
      const item = queue.shift();
      if (!item) return;
      const [publicUrl, local] = item;
      const pathname = blobPathnameFromPublicUrl(publicUrl);
      try {
        const buf = readFileSync(local);
        const blob = await put(pathname, buf, {
          access: "public",
          contentType: contentTypeFor(local),
          addRandomSuffix: false,
          allowOverwrite: true,
          token,
        });
        urlMap.set(publicUrl, blob.url);
        uploaded += 1;
        if (uploaded % 25 === 0) console.log(`Uploaded ${uploaded}/${needed.size}...`);
      } catch (error) {
        failed += 1;
        failures.push({
          publicUrl,
          error: error instanceof Error ? error.message : String(error),
        });
        console.log(`FAIL ${publicUrl}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`Uploads done. ok=${uploaded} fail=${failed}`);

  let updated = 0;
  for (const doc of docs) {
    let changed = false;
    let image = doc.image;
    if (typeof image === "string" && urlMap.has(image)) {
      image = urlMap.get(image);
      changed = true;
    }
    const images = Array.isArray(doc.images)
      ? doc.images.map((u) => {
          if (typeof u === "string" && urlMap.has(u)) {
            changed = true;
            return urlMap.get(u);
          }
          return u;
        })
      : doc.images;

    if (!changed) continue;
    await products.updateOne(
      { _id: doc._id },
      {
        $set: {
          image,
          images,
          updatedAt: new Date().toISOString(),
        },
      },
    );
    updated += 1;
  }

  const sample = await products
    .find(
      { handle: "1-08-ct-unheated-blue-sapphire" },
      { projection: { handle: 1, image: 1, images: 1 } },
    )
    .toArray();

  const report = {
    uploaded,
    failed,
    productsUpdated: updated,
    sampleUnheated108: sample[0]
      ? {
          handle: sample[0].handle,
          image: sample[0].image,
          imageCount: (sample[0].images || []).length,
          first3: (sample[0].images || []).slice(0, 3),
        }
      : null,
    failures: failures.slice(0, 40),
  };
  writeFileSync(
    join(process.cwd(), "scripts", "upload-product-images-blob-report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
