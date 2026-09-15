/**
 * Remove all admin users from MongoDB.
 *
 * Usage:
 *   node --env-file=.env.local scripts/clear-admin-users.mjs
 *
 * Create a new admin afterwards with:
 *   node --env-file=.env.local scripts/create-admin.mjs <username> <password>
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
  const collection = client.db(dbName).collection("admin_users");
  const result = await collection.deleteMany({});
  console.log(`Removed ${result.deletedCount} admin user(s).`);
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
