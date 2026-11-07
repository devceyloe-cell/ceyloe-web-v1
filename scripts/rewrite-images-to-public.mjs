/**
 * Point product image fields at /product-images/{filename} when that file
 * exists under public/product-images (copied from the local Ceyloe images folder).
 */
import { existsSync } from "node:fs";
import { join, basename } from "node:path";
import { MongoClient } from "mongodb";

const ROOT = join(process.cwd(), "public", "product-images");

function localPathFor(url) {
  if (typeof url !== "string" || !url.trim()) return url;
  let name = "";
  try {
    name = decodeURIComponent(new URL(url, "http://local").pathname.split("/").pop() || "");
  } catch {
    name = basename(url);
  }
  if (!name) return url;
  const file = join(ROOT, name);
  if (!existsSync(file)) return url;
  return `/product-images/${name}`;
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const products = client.db(process.env.MONGODB_DB_NAME || "ceyloe").collection("products");
const docs = await products.find({}).toArray();

let updated = 0;
for (const doc of docs) {
  const image = localPathFor(doc.image);
  const images = (doc.images || []).map(localPathFor).filter(Boolean);
  const certificationUrl = localPathFor(doc.certificationUrl);
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

console.log(`rewrote ${updated} products to /product-images`);
await client.close();
