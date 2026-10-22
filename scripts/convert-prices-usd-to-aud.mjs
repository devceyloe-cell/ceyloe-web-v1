/**
 * Convert product prices that were stored as USD amounts into AUD.
 *
 * Usage (dry-run):
 *   node --env-file=.env.local scripts/convert-prices-usd-to-aud.mjs
 *
 * Apply:
 *   node --env-file=.env.local scripts/convert-prices-usd-to-aud.mjs --apply
 */
import { MongoClient } from "mongodb";

const APPLY = process.argv.includes("--apply");
const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB_NAME?.trim() || "ceyloe";

if (!uri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

async function fetchUsdToAud() {
  const res = await fetch("https://open.er-api.com/v6/latest/USD");
  if (!res.ok) throw new Error(`Rate API failed: ${res.status}`);
  const data = await res.json();
  const aud = data?.rates?.AUD;
  if (!aud || typeof aud !== "number") throw new Error("AUD rate missing from API");
  return aud;
}

const rate = await fetchUsdToAud();
console.log(`USD → AUD rate: ${rate}`);
console.log(APPLY ? "Mode: APPLY (writing to MongoDB)" : "Mode: DRY-RUN (no writes)");

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);
const products = await db
  .collection("products")
  .find({}, { projection: { title: 1, price: 1, currency: 1 } })
  .toArray();

let updated = 0;
let skipped = 0;

for (const p of products) {
  const oldPrice = Number(p.price) || 0;
  const oldCurrency = String(p.currency || "USD").toUpperCase();

  // Already AUD and not a USD leftover: still convert if user said values are USD.
  // Convert every product: treat stored number as USD, write AUD.
  const newPrice = Math.round(oldPrice * rate * 100) / 100;

  console.log(
    `${p.title}: ${oldCurrency} ${oldPrice.toFixed(2)} → AUD ${newPrice.toFixed(2)}`,
  );

  if (APPLY) {
    await db.collection("products").updateOne(
      { _id: p._id },
      { $set: { price: newPrice, currency: "AUD" } },
    );
    updated += 1;
  } else {
    skipped += 1;
  }
}

console.log(
  APPLY
    ? `\nUpdated ${updated} product(s).`
    : `\nDry-run complete for ${skipped} product(s). Re-run with --apply to write.`,
);

await client.close();
