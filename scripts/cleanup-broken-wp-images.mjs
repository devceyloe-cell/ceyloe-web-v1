/**
 * Drop unreachable ceyloe.com/wp-content image URLs when a product already
 * has at least one working blob (or local) image.
 */
import { MongoClient } from "mongodb";

const WP = /(?:^https?:\/\/(?:www\.)?ceyloe\.com\/wp-content\/)/i;

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const products = client.db(process.env.MONGODB_DB_NAME || "ceyloe").collection("products");
const docs = await products.find({}).toArray();

let updated = 0;
for (const doc of docs) {
  const keep = (doc.images || []).filter((url) => typeof url === "string" && url && !WP.test(url));
  let image = doc.image;
  if (typeof image === "string" && WP.test(image)) {
    image = keep[0] || image;
  }
  if (!keep.includes(image) && image && !WP.test(image)) keep.unshift(image);

  const cert =
    typeof doc.certificationUrl === "string" && WP.test(doc.certificationUrl)
      ? undefined
      : doc.certificationUrl;

  const changed =
    image !== doc.image ||
    JSON.stringify(keep) !== JSON.stringify(doc.images || []) ||
    cert !== doc.certificationUrl;

  if (!changed) continue;

  const set = { image, images: keep, updatedAt: new Date().toISOString() };
  const update = cert === undefined ? { $set: set, $unset: { certificationUrl: "" } } : { $set: { ...set, certificationUrl: cert } };
  await products.updateOne({ _id: doc._id }, update);
  updated += 1;
}

console.log(`cleaned ${updated} products`);
await client.close();
