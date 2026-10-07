/**
 * Copy product videos from old public Blob URLs into the new store, refresh
 * blob-video-mapping.json, update src/config/ceyloe-youtube-videos.ts, and
 * sync MongoDB productUrl fields.
 *
 * Usage (from repo root):
 *   node --env-file=.env.local scripts/migrate-blob-store.mjs
 *   node --env-file=.env.local scripts/migrate-blob-store.mjs --skip-existing
 *   node --env-file=.env.local scripts/migrate-blob-store.mjs --dry-run
 *   node --env-file=.env.local scripts/migrate-blob-store.mjs --no-mongo
 */

import { readFile, writeFile } from "node:fs/promises";
import { put, list } from "@vercel/blob";
import { MongoClient } from "mongodb";

const MAPPING_FILE = new URL("./blob-video-mapping.json", import.meta.url);
const CONFIG_FILE  = new URL("../src/config/ceyloe-youtube-videos.ts", import.meta.url);
const dryRun       = process.argv.includes("--dry-run");
const skipExisting = process.argv.includes("--skip-existing");
const noMongo      = process.argv.includes("--no-mongo");

// ── tokens ────────────────────────────────────────────────────────────────────
const newToken =
  process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
  process.env.CEYLOE_READ_WRITE_TOKEN?.trim();

if (!newToken) {
  console.error("❌  Set BLOB_READ_WRITE_TOKEN or CEYLOE_READ_WRITE_TOKEN in .env.local");
  process.exit(1);
}

// ── load mapping ──────────────────────────────────────────────────────────────
const raw = await readFile(MAPPING_FILE, "utf8");
/** @type {Record<string, string>} */
const mapping = JSON.parse(raw);
const entries = Object.entries(mapping);
console.log(`📋  ${entries.length} videos in mapping\n`);

// ── what already exists in the new store ─────────────────────────────────────
/** @type {Set<string>} */
const existing = new Set();
{
  let cursor;
  do {
    const page = await list({ prefix: "videos/", limit: 1000, cursor, token: newToken });
    for (const b of page.blobs) existing.add(b.pathname);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
}
console.log(`🗂   New store already has ${existing.size} object(s)\n`);

// ── copy loop ─────────────────────────────────────────────────────────────────
let copied = 0, skipped = 0, failed = 0;
const failedHandles = [];

for (const [handle, sourceUrl] of entries) {
  const pathname = `videos/${handle}.mp4`;

  if ((skipExisting || existing.has(pathname)) && existing.has(pathname)) {
    process.stdout.write(`⏭   ${handle}\n`);
    skipped++;
    continue;
  }

  if (dryRun) {
    console.log(`[dry-run] ${handle}  ←  ${sourceUrl}`);
    continue;
  }

  try {
    process.stdout.write(`⬆   ${handle}… `);
    const res = await fetch(sourceUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} from source`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const blob = await put(pathname, buffer, {
      access: "public",
      addRandomSuffix: false,
      token: newToken,
    });
    mapping[handle] = blob.url;
    existing.add(pathname);
    copied++;
    console.log(`✅  ${(buffer.length / 1024 / 1024).toFixed(1)} MB  →  ${blob.url}`);
  } catch (err) {
    failed++;
    failedHandles.push(handle);
    console.log(`❌  ${err.message}`);
  }
}

// ── save updated mapping ──────────────────────────────────────────────────────
if (!dryRun) {
  await writeFile(MAPPING_FILE, `${JSON.stringify(mapping, null, 2)}\n`, "utf8");
  console.log(`\n💾  Updated blob-video-mapping.json  (${copied} new URLs)`);
}

console.log(`\n📊  Copy: ${copied} copied  |  ${skipped} skipped  |  ${failed} failed`);
if (failedHandles.length) console.log("   Failed:", failedHandles.join(", "));

if (dryRun) process.exit(0);
if (copied === 0 && failed > 0) process.exit(1);

// ── patch ceyloe-youtube-videos.ts ───────────────────────────────────────────
if (!dryRun && copied > 0) {
  let config = await readFile(CONFIG_FILE, "utf8");
  let patched = 0;
  for (const [handle, newUrl] of Object.entries(mapping)) {
    // Replace any URL value that still contains the old host
    const re = new RegExp(
      `("${handle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*:\\s*)"https://p3pmh1n6wu63k9yi[^"]*"`,
      "g"
    );
    if (re.test(config)) {
      config = config.replace(re, `$1"${newUrl}"`);
      patched++;
    }
  }
  if (patched > 0) {
    await writeFile(CONFIG_FILE, config, "utf8");
    console.log(`\n✏️   Patched ${patched} URL(s) in src/config/ceyloe-youtube-videos.ts`);
  }
}

// ── sync MongoDB ──────────────────────────────────────────────────────────────
const mongoUri = process.env.MONGODB_URI?.trim();
if (noMongo || !mongoUri) {
  console.log("\n🍃  MongoDB sync skipped.");
  process.exit(0);
}

console.log("\n🍃  Syncing MongoDB product videoUrl fields…");

// Build urlByHandle from live list of new store
const urlByHandle = new Map();
{
  let cursor;
  do {
    const page = await list({ prefix: "videos/", limit: 1000, cursor, token: newToken });
    for (const b of page.blobs) {
      const m = b.pathname.match(/^videos\/(.+)\.mp4$/i);
      if (m) urlByHandle.set(m[1], b.url);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
}
console.log(`    ${urlByHandle.size} video(s) indexed from new store`);

const client = new MongoClient(mongoUri);
await client.connect();
const db = client.db(process.env.MONGODB_DB_NAME?.trim() || "ceyloe");
const docs = await db.collection("products").find({}).toArray();
let updated = 0;
for (const doc of docs) {
  const newUrl = urlByHandle.get(doc.handle);
  if (!newUrl || doc.videoUrl === newUrl) continue;
  await db.collection("products").updateOne({ _id: doc._id }, { $set: { videoUrl: newUrl } });
  updated++;
  console.log(`    ✓  ${doc.handle}`);
}
await client.close();
console.log(`\n✅  MongoDB: ${updated} product(s) updated`);
