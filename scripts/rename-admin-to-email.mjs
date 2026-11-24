/**
 * Rename non-email admin username to the account's primary email.
 *
 * Usage:
 *   node --env-file=.env.local scripts/rename-admin-to-email.mjs [fromUsername]
 */
import { MongoClient } from "mongodb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function main() {
  const fromUsername = (process.argv[2] || "ceyloe-prod-admin").trim().toLowerCase();
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "ceyloe";
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db(dbName).collection("admin_users");
  const doc = await col.findOne({ username: fromUsername });
  if (!doc) {
    console.error(`Admin user "${fromUsername}" not found.`);
    await client.close();
    process.exit(1);
  }

  const emails = [
    ...(Array.isArray(doc.emails) ? doc.emails : []),
    doc.email,
  ]
    .filter(Boolean)
    .map((e) => String(e).trim().toLowerCase())
    .filter((e) => EMAIL_RE.test(e));

  const primary = emails[0];
  if (!primary) {
    console.error("No valid email on this admin account to use as username.");
    await client.close();
    process.exit(1);
  }

  if (doc.username === primary) {
    console.log(`Already email-only: ${primary}`);
    await client.close();
    return;
  }

  const clash = await col.findOne({ username: primary });
  if (clash && String(clash._id) !== String(doc._id)) {
    console.error(`Another admin already uses username "${primary}".`);
    await client.close();
    process.exit(1);
  }

  await col.updateOne(
    { _id: doc._id },
    {
      $set: {
        username: primary,
        email: primary,
        emails: Array.from(new Set([primary, ...emails])),
        updatedAt: new Date().toISOString(),
      },
    },
  );

  console.log(`Renamed admin username: ${fromUsername} → ${primary}`);
  await client.close();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
