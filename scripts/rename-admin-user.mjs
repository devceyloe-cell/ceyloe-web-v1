/**
 * Rename an admin username in MongoDB.
 *
 * Usage:
 *   node --env-file=.env.local scripts/rename-admin-user.mjs <old-username> <new-username>
 *
 * Example:
 *   node --env-file=.env.local scripts/rename-admin-user.mjs admin ceyloe-prod-admin
 */
import { MongoClient } from "mongodb";

const [, , oldUsername, newUsername] = process.argv;

if (!oldUsername || !newUsername) {
  console.error("Usage: node scripts/rename-admin-user.mjs <old-username> <new-username>");
  process.exit(1);
}

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB_NAME?.trim() || "ceyloe";

if (!uri) { console.error("MONGODB_URI not set in .env.local"); process.exit(1); }

console.log(`Connecting to "${dbName}"…`);
const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);
const col = db.collection("admin_users");

// Check old user exists
const existing = await col.findOne({ username: oldUsername.toLowerCase() });
if (!existing) {
  console.error(`✗ No admin user found with username "${oldUsername}"`);
  const all = await col.find({}, { projection: { username: 1 } }).toArray();
  console.log("Existing admin usernames:", all.map(u => u.username));
  await client.close();
  process.exit(1);
}

// Check new username not taken
const conflict = await col.findOne({ username: newUsername.toLowerCase() });
if (conflict) {
  console.error(`✗ Username "${newUsername}" is already taken`);
  await client.close();
  process.exit(1);
}

const result = await col.updateOne(
  { username: oldUsername.toLowerCase() },
  { $set: { username: newUsername.toLowerCase(), updatedAt: new Date().toISOString() } }
);

if (result.modifiedCount === 1) {
  console.log(`✓ Renamed admin user: "${oldUsername}" → "${newUsername}"`);
} else {
  console.error("✗ Update failed (no documents modified)");
}

await client.close();
