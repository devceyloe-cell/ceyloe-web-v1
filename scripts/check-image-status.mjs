import { MongoClient } from "mongodb";

const handle = process.argv[2];
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const col = client.db(process.env.MONGODB_DB_NAME || "ceyloe").collection("products");

if (handle) {
  const doc = await col.findOne({ handle });
  console.log(JSON.stringify({ handle, image: doc?.image, images: doc?.images }, null, 2));
} else {
  const total = await col.countDocuments();
  const withBlob = await col.countDocuments({ image: /blob\.vercel-storage\.com/ });
  const withWp = await col.countDocuments({
    $or: [{ image: /ceyloe\.com\/wp-content/ }, { images: /ceyloe\.com\/wp-content/ }],
  });
  console.log(JSON.stringify({ total, withBlob, withWp }, null, 2));
}
await client.close();
