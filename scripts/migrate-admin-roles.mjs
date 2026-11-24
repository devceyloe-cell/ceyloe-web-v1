/**
 * Backfill admin role / MFA / active fields and map legacy mfaEnabled → mfaRequired.
 *
 *   node --env-file=.env.local scripts/migrate-admin-roles.mjs
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
  const now = new Date().toISOString();
  const users = db.collection("admin_users");

  const r1 = await users.updateMany(
    {
      $or: [{ role: { $exists: false } }, { role: null }, { role: { $nin: ["owner", "staff"] } }],
    },
    { $set: { role: "owner", updatedAt: now } },
  );
  const r2 = await users.updateMany(
    { mfaEnabled: { $exists: false } },
    { $set: { mfaEnabled: true, updatedAt: now } },
  );
  const r3 = await users.updateMany(
    { active: { $exists: false } },
    { $set: { active: true, updatedAt: now } },
  );

  const sec = await db.collection("site_settings").findOne({ key: "admin-security" });
  if (sec && typeof sec.mfaRequired !== "boolean" && typeof sec.mfaEnabled === "boolean") {
    await db.collection("site_settings").updateOne(
      { key: "admin-security" },
      { $set: { mfaRequired: sec.mfaEnabled, updatedAt: now } },
    );
  }

  const docs = await users
    .find({}, { projection: { username: 1, role: 1, mfaEnabled: 1, active: 1, _id: 0 } })
    .toArray();
  const security = await db.collection("site_settings").findOne({ key: "admin-security" });

  console.log(
    JSON.stringify(
      {
        migrated: {
          roles: r1.modifiedCount,
          mfaEnabled: r2.modifiedCount,
          active: r3.modifiedCount,
        },
        users: docs,
        security: {
          mfaRequired: security?.mfaRequired,
          mfaEnabled: security?.mfaEnabled,
        },
      },
      null,
      2,
    ),
  );

  await client.close();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
