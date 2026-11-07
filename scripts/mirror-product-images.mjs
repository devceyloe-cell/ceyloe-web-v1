/**
 * Copy product photos off the old ceyloe.com/wp-content URLs onto Vercel Blob,
 * then update MongoDB product image fields.
 *
 * Usage: node --env-file=.env.local scripts/mirror-product-images.mjs
 */
import { writeFileSync } from "node:fs";
import { MongoClient } from "mongodb";
import { put } from "@vercel/blob";

const HOST = "p3pmh1n6wu63k9yi.public.blob.vercel-storage.com";
const WP = /^https:\/\/(?:www\.)?ceyloe\.com\/wp-content\/uploads\/.+/i;
const CONCURRENCY = 4;

function blobUrlForPath(pathname) {
  return `https://${HOST}/${pathname}`;
}

function pathnameFor(url) {
  return new URL(url).pathname.replace(/^\/+/, "");
}

function isImage(buf) {
  if (buf.length < 12) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "image/gif";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  return false;
}

async function findArchiveTimestamp(url) {
  const u = new URL(url);
  const path = u.pathname.replace(/^\/+/, "");
  const variants = [
    `https://${u.host}/${path}`,
    `http://${u.host}/${path}`,
    `https://www.ceyloe.com/${path}`,
    `https://ceyloe.com/${path}`,
  ];

  for (const original of variants) {
    const cdx = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(original)}&output=json&fl=timestamp,statuscode,mimetype&filter=statuscode:200&limit=5`;
    const res = await fetch(cdx, {
      headers: { "User-Agent": "CeyloeImageMirror/1.0" },
    });
    if (!res.ok) continue;
    const rows = await res.json().catch(() => null);
    if (!Array.isArray(rows) || rows.length < 2) continue;
    for (const row of rows.slice(1)) {
      const [timestamp, , mimetype] = row;
      if (String(mimetype || "").startsWith("image/") && timestamp) return timestamp;
    }
    if (rows[1]?.[0]) return rows[1][0];
  }
  return null;
}

async function downloadArchived(url) {
  const timestamp = await findArchiveTimestamp(url);
  if (!timestamp) return null;
  const archive = `https://web.archive.org/web/${timestamp}id_/${url.replace("https://www.", "https://")}`;
  const res = await fetch(archive, {
    redirect: "follow",
    headers: { "User-Agent": "CeyloeImageMirror/1.0" },
  });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  const type = isImage(buf);
  if (!type) return null;
  return { buf, type };
}

async function mirrorOne(token, sourceUrl) {
  const pathname = pathnameFor(sourceUrl);
  const downloaded = await downloadArchived(sourceUrl);
  if (!downloaded) return null;
  const blob = await put(pathname, downloaded.buf, {
    access: "public",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: downloaded.type,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
  return blob.url || blobUrlForPath(pathname);
}

function replaceUrl(value, map) {
  if (typeof value === "string" && map.has(value)) return map.get(value);
  if (Array.isArray(value)) return value.map((item) => replaceUrl(item, map));
  return value;
}

async function main() {
  const token = process.env.CEYLOE_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "ceyloe";
  if (!token || !uri) {
    console.error("Missing blob token or MONGODB_URI");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const products = client.db(dbName).collection("products");
  const docs = await products.find({}).toArray();

  const sources = new Set();
  for (const doc of docs) {
    for (const url of [doc.image, ...(doc.images || []), doc.certificationUrl]) {
      if (typeof url === "string" && WP.test(url)) sources.add(url);
    }
  }

  console.log(`Products ${docs.length}. Unique photos ${sources.size}.`);
  const map = new Map();
  let failed = 0;
  let done = 0;
  const queue = [...sources];

  async function worker() {
    while (queue.length) {
      const sourceUrl = queue.shift();
      if (!sourceUrl) return;
      try {
        const nextUrl = await mirrorOne(token, sourceUrl);
        if (!nextUrl) {
          failed += 1;
          console.log(`MISS ${sourceUrl}`);
        } else {
          map.set(sourceUrl, nextUrl);
        }
      } catch (error) {
        failed += 1;
        console.log(`ERR ${error instanceof Error ? error.message : error}`);
      }
      done += 1;
      if (done % 10 === 0 || done === sources.size) {
        console.log(`Progress ${done}/${sources.size} saved ${map.size} missed ${failed}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  let updated = 0;
  for (const doc of docs) {
    const image = replaceUrl(doc.image, map);
    const images = replaceUrl(doc.images || [], map);
    const certificationUrl = replaceUrl(doc.certificationUrl, map);
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

  writeFileSync(
    "scripts/blob-image-mapping.json",
    JSON.stringify({ saved: map.size, failed, updated }, null, 2),
  );
  console.log(`Done. photos=${map.size} missed=${failed} productsUpdated=${updated}`);
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
