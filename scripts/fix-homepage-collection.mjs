/**
 * Point Discover Our Finest Gems at local cover images (fast, reliable).
 *
 * Usage:
 *   node --env-file=.env.local scripts/fix-homepage-collection.mjs
 */
import { MongoClient } from "mongodb";

const items = [
  {
    id: "sapphire",
    name: "Sapphire Collection",
    href: "/gemstones/sapphires",
    image: "/images/covers/cards/sapphires.webp",
  },
  {
    id: "spinel",
    name: "Spinel Collection",
    href: "/gemstones/spinel",
    image: "/images/covers/cards/spinels.webp",
  },
  {
    id: "garnet",
    name: "Garnet Collection",
    href: "/gemstones/garnet",
    image: "/images/covers/cards/garnets.webp",
  },
  {
    id: "other",
    name: "Other Gemstones",
    href: "/gemstones/other",
    image: "/images/covers/cards/other-gemstones.webp",
  },
];

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB_NAME?.trim() || "ceyloe";

if (!uri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);
const updatedAt = new Date().toISOString();

await db.collection("site_settings").updateOne(
  { key: "homepage-collection" },
  {
    $set: {
      key: "homepage-collection",
      eyebrow: "Our Collection",
      title: "Discover Our Finest Gems",
      exploreLabel: "Explore",
      items,
      updatedAt,
    },
  },
  { upsert: true },
);

const doc = await db.collection("site_settings").findOne({ key: "homepage-collection" });
console.log("Updated homepage-collection:");
console.log(JSON.stringify(doc, null, 2));
await client.close();
