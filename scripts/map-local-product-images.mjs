/**
 * Map missing product photos from D:\Project Document\Ceyloe\images,
 * upload them to Vercel Blob, and update MongoDB product image URLs.
 *
 * Usage: node --env-file=.env.local scripts/map-local-product-images.mjs
 */
import { readdirSync, readFileSync, statSync, mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { MongoClient } from "mongodb";
import { put } from "@vercel/blob";

const LOCAL_ROOT = "D:\\Project Document\\Ceyloe\\images";
const PROJECT_COPY_ROOT = join(process.cwd(), "public", "product-images");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const SIZE_SUFFIX = /-\d+x\d+(?=\.[^.]+$)/i;
const SCALED = /-scaled(?=\.[^.]+$)/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (IMAGE_EXT.has(extname(name).toLowerCase())) out.push(full);
  }
  return out;
}

function scorePath(filePath) {
  const name = basename(filePath);
  let score = statSync(filePath).size;
  if (SIZE_SUFFIX.test(name)) score -= 1e12;
  if (SCALED.test(name)) score -= 1e9;
  return score;
}

/** Normalize download/export names like imgi_10_110423001-9.jpg → 110423001-9.jpg */
function canonicalNames(filePath) {
  const raw = basename(filePath);
  const names = new Set([raw.toLowerCase()]);
  const stripped = raw.replace(/^imgi_\d+_/i, "");
  names.add(stripped.toLowerCase());
  const noSize = stripped.replace(SIZE_SUFFIX, "");
  names.add(noSize.toLowerCase());
  return [...names];
}

function indexLocalImages() {
  const files = walk(LOCAL_ROOT);
  /** @type {Map<string, string>} */
  const byName = new Map();
  for (const file of files) {
    for (const name of canonicalNames(file)) {
      const current = byName.get(name);
      if (!current || scorePath(file) > scorePath(current)) byName.set(name, file);
    }
  }
  return { files, byName };
}

function contentTypeFor(file) {
  const ext = extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function pathnameForUrl(url) {
  try {
    const path = new URL(url).pathname.replace(/^\/+/, "");
    if (path.startsWith("wp-content/uploads/")) return path;
  } catch {
    /* relative or invalid */
  }
  const name = basename(String(url).split("?")[0] || "image.jpg");
  return `product-images/${name}`;
}

function filenameFromUrl(url) {
  try {
    return decodeURIComponent(new URL(url, "http://local").pathname.split("/").pop() || "");
  } catch {
    return String(url).split("/").pop() || "";
  }
}

async function main() {
  const token = process.env.CEYLOE_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "ceyloe";
  if (!token || !uri) {
    console.error("Missing blob token or MONGODB_URI");
    process.exit(1);
  }

  const { files, byName } = indexLocalImages();
  console.log(`Local image files: ${files.length}. Unique basenames: ${byName.size}`);

  const client = new MongoClient(uri);
  await client.connect();
  const products = client.db(dbName).collection("products");
  const docs = await products.find({}).toArray();

  const needed = new Map();
  for (const doc of docs) {
    for (const url of [doc.image, ...(doc.images || []), doc.certificationUrl]) {
      if (typeof url !== "string" || !url.trim()) continue;
      if (url.includes("blob.vercel-storage.com")) continue;
      if (url.startsWith("/api/uploads/")) continue;
      const name = filenameFromUrl(url).toLowerCase();
      if (!name || needed.has(url)) continue;
      const local = byName.get(name);
      if (local) needed.set(url, local);
    }
  }

  console.log(`Matched broken URLs to local files: ${needed.size}`);
  mkdirSync(PROJECT_COPY_ROOT, { recursive: true });

  const urlMap = new Map();
  let uploaded = 0;
  let failed = 0;
  let i = 0;

  for (const [sourceUrl, localPath] of needed) {
    i += 1;
    const pathname = pathnameForUrl(sourceUrl);
    const projectCopy = join(PROJECT_COPY_ROOT, basename(localPath));
    try {
      copyFileSync(localPath, projectCopy);
      const buf = readFileSync(localPath);
      const blob = await put(pathname, buf, {
        access: "public",
        token,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: contentTypeFor(localPath),
        cacheControlMaxAge: 60 * 60 * 24 * 365,
      });
      urlMap.set(sourceUrl, blob.url);
      uploaded += 1;
      if (uploaded % 25 === 0 || i === needed.size) {
        console.log(`Uploaded ${uploaded}/${needed.size}`);
      }
    } catch (error) {
      failed += 1;
      console.log(`ERR ${basename(localPath)}: ${error instanceof Error ? error.message : error}`);
    }
  }

  let updated = 0;
  let stillMissing = 0;
  for (const doc of docs) {
    const nextImage = urlMap.get(doc.image) || doc.image;
    const nextImages = (doc.images || []).map((url) => urlMap.get(url) || url);
    const nextCert = urlMap.get(doc.certificationUrl) || doc.certificationUrl;
    const changed =
      nextImage !== doc.image ||
      nextCert !== doc.certificationUrl ||
      JSON.stringify(nextImages) !== JSON.stringify(doc.images || []);
    if (!changed) {
      const broken = [nextImage, ...nextImages].some(
        (url) =>
          typeof url === "string" &&
          (url.includes("ceyloe.com/wp-content/") || url.includes("www.ceyloe.com/wp-content/")),
      );
      if (broken) stillMissing += 1;
      continue;
    }
    await products.updateOne(
      { _id: doc._id },
      {
        $set: {
          image: nextImage,
          images: nextImages,
          certificationUrl: nextCert,
          updatedAt: new Date().toISOString(),
        },
      },
    );
    updated += 1;
  }

  const report = {
    localFiles: files.length,
    matchedUrls: needed.size,
    uploaded,
    failed,
    productsUpdated: updated,
    productsStillWithWpUrls: stillMissing,
  };
  writeFileSync(join(process.cwd(), "scripts", "local-image-mapping-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
