/**
 * Copy all collections from OLD MongoDB cluster → NEW Atlas cluster.
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-mongodb.mjs
 *
 * Env vars required:
 *   MONGODB_URI       – source (old) cluster URI
 *   MONGODB_DB_NAME   – database name (default: ceyloe)
 *   NEW_MONGODB_URI   – target (new) cluster URI
 */

import { MongoClient } from "mongodb";

const OLD_URI = process.env.MONGODB_URI?.trim();
const NEW_URI = process.env.NEW_MONGODB_URI?.trim();
const DB_NAME = process.env.MONGODB_DB_NAME?.trim() || "ceyloe";

if (!OLD_URI) { console.error("MONGODB_URI not set"); process.exit(1); }
if (!NEW_URI) { console.error("NEW_MONGODB_URI not set"); process.exit(1); }

console.log("🔗  Connecting to source cluster…");
const src = new MongoClient(OLD_URI);
await src.connect();

console.log("🔗  Connecting to target cluster…");
const dst = new MongoClient(NEW_URI);
await dst.connect();

const srcDb = src.db(DB_NAME);
const dstDb = dst.db(DB_NAME);

const collections = await srcDb.listCollections().toArray();
console.log(`\n📦  Found ${collections.length} collection(s) in "${DB_NAME}":\n`);

for (const { name } of collections) {
  const srcCol = srcDb.collection(name);
  const dstCol = dstDb.collection(name);

  const total = await srcCol.countDocuments();
  console.log(`⬆   ${name}  (${total} docs)`);

  if (total === 0) {
    console.log("    (empty — skipped)\n");
    continue;
  }

  // Drop target collection to start clean
  await dstCol.drop().catch(() => {}); // ignore "ns not found"

  const docs = await srcCol.find({}).toArray();
  await dstCol.insertMany(docs);

  // Recreate indexes
  const indexes = await srcCol.indexes();
  for (const idx of indexes) {
    if (idx.name === "_id_") continue; // auto-created
    const { key, name: idxName, ...opts } = idx;
    await dstCol.createIndex(key, { name: idxName, ...opts }).catch((e) =>
      console.warn(`    ⚠ index ${idxName}: ${e.message}`)
    );
  }

  console.log(`    ✅  ${docs.length} docs copied\n`);
}

await src.close();
await dst.close();
console.log("✅  Migration complete.");
