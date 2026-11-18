/**
 * Assign category-prefixed SKUs to all products.
 * Format stored: SAP-10001  |  Display: CEY-SAP-10001
 *
 * Usage:
 *   node --env-file=.env.local scripts/assign-product-skus.mjs
 *   node --env-file=.env.local scripts/assign-product-skus.mjs --force
 */
import { MongoClient } from "mongodb";

const FORCE = process.argv.includes("--force");
const BRAND = "CEY-";
const START = 10001;

const CODES = {
  sapphires: "SAP",
  ruby: "RUB",
  spinel: "SPI",
  garnet: "GAR",
  topaz: "TOP",
  citrine: "CIT",
  tourmaline: "TOU",
  zircon: "ZIR",
  other: "OTH",
  jewellery: "JWL",
};

function codeFor(category) {
  const key = String(category || "")
    .trim()
    .toLowerCase();
  if (CODES[key]) return CODES[key];
  const letters = key.replace(/[^a-z]/g, "").slice(0, 3).toUpperCase();
  return letters || "GEN";
}

function stripBrand(value) {
  return String(value || "")
    .trim()
    .replace(/^CEY-+/i, "")
    .trim();
}

function parseParts(value) {
  const core = stripBrand(value);
  const withCat = core.match(/^([A-Za-z]{2,4})-(\d+)$/);
  if (withCat) return { code: withCat[1].toUpperCase(), number: Number(withCat[2]) };
  if (/^\d+$/.test(core)) return { code: "", number: Number(core) };
  return null;
}

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  const dbName = process.env.MONGODB_DB_NAME?.trim() || "ceyloe";
  if (!uri) throw new Error("MONGODB_URI missing");

  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db(dbName).collection("products");
  const docs = await col
    .find({})
    .sort({ category: 1, catalogSortOrder: 1, createdAt: 1, _id: 1 })
    .toArray();

  /** @type {Map<string, number>} */
  const nextByCode = new Map();

  // Seed counters from existing category SKUs unless forcing a full rewrite
  if (!FORCE) {
    for (const doc of docs) {
      const parts = parseParts(doc.sku);
      if (!parts) continue;
      const code = parts.code || codeFor(doc.category);
      const prev = nextByCode.get(code) ?? START;
      if (parts.number + 1 > prev) nextByCode.set(code, parts.number + 1);
    }
  }

  let assigned = 0;
  let skipped = 0;
  const samples = [];
  const byCategory = {};

  for (const doc of docs) {
    const code = codeFor(doc.category);
    const existing = stripBrand(doc.sku);
    const existingParts = parseParts(doc.sku);
    const alreadyCategorized = Boolean(existingParts?.code);

    if (existing && alreadyCategorized && !FORCE) {
      skipped += 1;
      continue;
    }

    if (!nextByCode.has(code)) nextByCode.set(code, START);
    const n = nextByCode.get(code);
    nextByCode.set(code, n + 1);
    const core = `${code}-${n}`;

    await col.updateOne(
      { _id: doc._id },
      {
        $set: {
          sku: core,
          updatedAt: new Date().toISOString(),
        },
      },
    );
    assigned += 1;
    byCategory[code] = (byCategory[code] || 0) + 1;
    if (samples.length < 12) {
      samples.push({
        title: doc.title,
        category: doc.category,
        sku: `${BRAND}${core}`,
      });
    }
  }

  const withSku = await col.countDocuments({ sku: { $exists: true, $nin: [null, ""] } });
  console.log(
    JSON.stringify(
      {
        force: FORCE,
        total: docs.length,
        assigned,
        skippedExisting: skipped,
        withSku,
        byCategory,
        samples,
      },
      null,
      2,
    ),
  );
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
