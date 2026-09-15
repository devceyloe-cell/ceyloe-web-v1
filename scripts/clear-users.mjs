/**
 * Delete all shopper users (and their carts) from MongoDB.
 *
 * Usage:
 *   node --env-file=.env.local scripts/clear-users.mjs
 */
import { MongoClient } from "mongodb";

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "ceyloe";

  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const users = await db.collection("users").deleteMany({});
  const carts = await db.collection("carts").deleteMany({});

  console.log(`Removed ${users.deletedCount} user(s).`);
  console.log(`Removed ${carts.deletedCount} cart(s).`);

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
