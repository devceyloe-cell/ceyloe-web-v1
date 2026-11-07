/**
 * Restore full product image galleries from the live WooCommerce site.
 * Saves files under public/product-images/{year}/{month}/{filename}
 * so shared camera filenames from different uploads do not collide.
 *
 * Usage:
 *   node --env-file=.env.local scripts/restore-product-galleries.mjs
 *   node --env-file=.env.local scripts/restore-product-galleries.mjs --force
 */
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  writeFileSync,
  unlinkSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { MongoClient } from "mongodb";

const ROOT = join(process.cwd(), "public", "product-images");
const WC_BASE = "https://ceyloe.com/wp-json/wc/store/v1/products";
const CONCURRENCY = 6;
const FORCE = process.argv.includes("--force");

mkdirSync(ROOT, { recursive: true });

function cleanUrl(src) {
  return String(src || "")
    .replace(/\?.*$/, "")
    .replace("https://www.ceyloe.com", "https://ceyloe.com");
}

/** Keep year/month from wp-content/uploads so filenames stay unique per upload. */
function relativeProductImagePath(url) {
  const cleaned = cleanUrl(url);
  try {
    const pathname = new URL(cleaned).pathname.replace(/^\/+/, "");
    const marker = "wp-content/uploads/";
    const idx = pathname.toLowerCase().indexOf(marker);
    if (idx >= 0) {
      return pathname.slice(idx + marker.length);
    }
    return pathname.split("/").pop() || "";
  } catch {
    return "";
  }
}

function publicUrlFor(relPath) {
  return `/product-images/${relPath.replace(/\\/g, "/")}`;
}

async function fetchPage(page) {
  const url = `${WC_BASE}?per_page=100&page=${page}`;
  const res = await fetch(url, { headers: { "User-Agent": "CeyloeGalleryRestore/1.0" } });
  if (!res.ok) throw new Error(`WC page ${page} failed: ${res.status}`);
  return res.json();
}

async function fetchAllWcProducts() {
  const all = [];
  for (let page = 1; page <= 10; page += 1) {
    const batch = await fetchPage(page);
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    console.log(`Fetched WC page ${page}: ${batch.length}`);
    if (batch.length < 100) break;
  }
  return all;
}

async function download(url, dest) {
  if (existsSync(dest) && !FORCE) return { ok: true, skipped: true };
  if (existsSync(dest) && FORCE) {
    try {
      unlinkSync(dest);
    } catch {
      /* ignore */
    }
  }
  mkdirSync(dirname(dest), { recursive: true });
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "CeyloeGalleryRestore/1.0" },
  });
  if (!res.ok || !res.body) return { ok: false, status: res.status };
  const type = res.headers.get("content-type") || "";
  if (!type.startsWith("image/")) return { ok: false, status: res.status, type };
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return { ok: true, skipped: false };
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");
  console.log(`Force overwrite: ${FORCE}`);

  const wcProducts = await fetchAllWcProducts();
  const byHandle = new Map();
  for (const wc of wcProducts) {
    const images = (wc.images || [])
      .map((img) => cleanUrl(img.src))
      .filter(Boolean)
      .filter((src) => !/certificate|indetification|identification/i.test(src));
    byHandle.set(String(wc.slug || "").toLowerCase(), {
      title: wc.name,
      images: [...new Set(images)],
    });
  }
  console.log(`WC products with galleries: ${byHandle.size}`);

  const needed = new Map();
  for (const entry of byHandle.values()) {
    for (const url of entry.images) {
      const rel = relativeProductImagePath(url);
      if (rel) needed.set(url, rel);
    }
  }
  console.log(`Unique gallery files to ensure locally: ${needed.size}`);

  const queue = [...needed.entries()];
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  async function worker() {
    while (queue.length) {
      const item = queue.shift();
      if (!item) return;
      const [url, rel] = item;
      const dest = join(ROOT, rel);
      try {
        const result = await download(url, dest);
        if (!result.ok) {
          failed += 1;
          failures.push({ url, status: result.status, type: result.type });
          console.log(`MISS ${rel}`);
        } else if (result.skipped) {
          skipped += 1;
        } else {
          downloaded += 1;
          if (downloaded % 25 === 0) console.log(`Downloaded ${downloaded}...`);
        }
      } catch (error) {
        failed += 1;
        failures.push({ url, error: error instanceof Error ? error.message : String(error) });
        console.log(`ERR ${rel}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`Downloads done. ok=${downloaded} have=${skipped} miss=${failed}`);

  const client = new MongoClient(uri);
  await client.connect();
  const products = client.db(process.env.MONGODB_DB_NAME || "ceyloe").collection("products");
  const docs = await products.find({}).toArray();

  let updated = 0;
  let unmatched = 0;

  for (const doc of docs) {
    const wc = byHandle.get(String(doc.handle || "").toLowerCase());
    if (!wc || wc.images.length === 0) {
      unmatched += 1;
      continue;
    }

    const localImages = [];
    for (const url of wc.images) {
      const rel = relativeProductImagePath(url);
      if (!rel) continue;
      if (!existsSync(join(ROOT, rel))) continue;
      localImages.push(publicUrlFor(rel));
    }
    if (localImages.length === 0) continue;

    const image = localImages[0];
    const changed =
      image !== doc.image || JSON.stringify(localImages) !== JSON.stringify(doc.images || []);
    if (!changed) continue;

    await products.updateOne(
      { _id: doc._id },
      {
        $set: {
          image,
          images: localImages,
          updatedAt: new Date().toISOString(),
        },
      },
    );
    updated += 1;
  }

  const sizes = { 0: 0, 1: 0, 2: 0, 3: 0, "4+": 0 };
  const after = await products.find({}, { projection: { images: 1 } }).toArray();
  for (const doc of after) {
    const n = (doc.images || []).length;
    if (n === 0) sizes[0] += 1;
    else if (n === 1) sizes[1] += 1;
    else if (n === 2) sizes[2] += 1;
    else if (n === 3) sizes[3] += 1;
    else sizes["4+"] += 1;
  }

  // Sample unheated blue sapphires for confirmation
  const unheated = await products
    .find(
      { handle: /unheated-blue-sapphire/i },
      { projection: { handle: 1, title: 1, image: 1, images: 1 } },
    )
    .toArray();

  const report = {
    force: FORCE,
    wcProducts: byHandle.size,
    uniqueFiles: needed.size,
    downloaded,
    skippedExisting: skipped,
    failed,
    productsUpdated: updated,
    productsWithoutWcMatch: unmatched,
    gallerySizeHistogram: sizes,
    unheatedBlueSapphires: unheated.map((d) => ({
      handle: d.handle,
      title: d.title,
      image: d.image,
      imageCount: (d.images || []).length,
    })),
    failures: failures.slice(0, 30),
  };
  writeFileSync(join(process.cwd(), "scripts", "restore-galleries-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
