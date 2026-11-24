/**
 * Create an admin user in MongoDB (password stored as scrypt hash).
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-admin.mjs <email> <password>
 *
 * Example:
 *   node --env-file=.env.local scripts/create-admin.mjs admin@ceyloe.com 'StrongPass1!'
 *
 * Username must be an email address (used for sign-in and password reset).
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { MongoClient } from "mongodb";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt}:${derived.toString("hex")}`;
}

async function main() {
  const username = process.argv[2]?.trim().toLowerCase();
  const password = process.argv[3];
  const emailArg = process.argv[4]?.trim().toLowerCase() || null;
  const email = emailArg || (username && EMAIL_RE.test(username) ? username : null);

  if (!username || !password) {
    console.error(
      "Usage: node --env-file=.env.local scripts/create-admin.mjs <email> <password>",
    );
    process.exit(1);
  }

  if (!EMAIL_RE.test(username)) {
    console.error("Admin username must be a valid email address.");
    process.exit(1);
  }

  if (password.length < 12) {
    console.error("Password must be at least 12 characters.");
    process.exit(1);
  }

  if (emailArg && !EMAIL_RE.test(emailArg)) {
    console.error("Invalid email address.");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "ceyloe";

  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const collection = client.db(dbName).collection("admin_users");

  await collection.createIndex({ username: 1 }, { unique: true });

  const existing = await collection.findOne({ username });
  if (existing) {
    console.error(`User "${username}" already exists.`);
    await client.close();
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  await collection.insertOne({
    username,
    passwordHash,
    email: email || username,
    emails: [email || username],
    createdAt: now,
  });

  console.log(`Admin user created: ${username}`);
  await client.close();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
