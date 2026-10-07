/**
 * Quick diagnostic: check appointments in production MongoDB.
 * Run: node scripts/check-appointments.mjs
 */
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB_NAME?.trim() || "ceyloe";

if (!uri) { console.error("MONGODB_URI not set"); process.exit(1); }

console.log(`Connecting to cluster, DB="${dbName}"…`);
const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

// List all collections in this database
const collections = await db.listCollections().toArray();
console.log("\nCollections found:", collections.map(c => c.name).join(", "));

// Check appointments
const count = await db.collection("appointments").countDocuments();
console.log(`\nappointments count: ${count}`);

if (count > 0) {
  const sample = await db.collection("appointments").findOne({});
  console.log("\nSample appointment doc:");
  console.log(JSON.stringify(sample, null, 2));
} else {
  console.log("→ appointments collection is EMPTY in this DB");
  // Check if it exists under a different name
  const appointmentLike = collections.filter(c =>
    c.name.toLowerCase().includes("appoint")
  );
  if (appointmentLike.length > 0) {
    console.log("Found similar collection names:", appointmentLike.map(c => c.name));
  }
}

await client.close();
console.log("\nDone.");
