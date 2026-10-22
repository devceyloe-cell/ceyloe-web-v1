import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB_NAME || "ceyloe");
const samples = await db
  .collection("products")
  .find({ price: { $gt: 0 } })
  .sort({ price: -1 })
  .limit(5)
  .project({ title: 1, price: 1, currency: 1 })
  .toArray();
const nonAud = await db.collection("products").countDocuments({ currency: { $ne: "AUD" } });
console.log("nonAUD=", nonAud);
console.log(JSON.stringify(samples, null, 2));
await client.close();
