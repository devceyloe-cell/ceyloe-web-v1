import { MongoClient } from "mongodb";

const handle = process.argv[2] || "0-75-ct-blue-sapphire";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const col = client.db(process.env.MONGODB_DB_NAME || "ceyloe").collection("products");
const doc = await col.findOne({ handle });
if (!doc) throw new Error(`missing ${handle}`);

const image = doc.image;
const images = (doc.images || []).filter((url) => String(url).includes("blob.vercel-storage.com"));
if (String(image).includes("blob.vercel-storage.com") && !images.includes(image)) {
  images.unshift(image);
}

await col.updateOne(
  { _id: doc._id },
  {
    $set: {
      image,
      images: images.length ? images : [image],
      updatedAt: new Date().toISOString(),
    },
  },
);

console.log(JSON.stringify({ handle, image, images: images.length ? images : [image] }, null, 2));
await client.close();
