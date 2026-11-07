import { MongoClient } from "mongodb";
import { put } from "@vercel/blob";

const HOST = "p3pmh1n6wu63k9yi.public.blob.vercel-storage.com";
const handle = process.argv[2] || "0-75-ct-blue-sapphire";

async function stamp(url) {
  const path = new URL(url).pathname.replace(/^\/+/, "");
  for (const original of [`https://ceyloe.com/${path}`, `https://www.ceyloe.com/${path}`]) {
    const res = await fetch(
      `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(original)}&output=json&fl=timestamp,statuscode,mimetype&filter=statuscode:200&limit=3`,
      { headers: { "User-Agent": "CeyloeImageMirror/1.0" } },
    );
    const rows = await res.json().catch(() => null);
    if (Array.isArray(rows) && rows[1]?.[0]) return rows[1][0];
  }
  return null;
}

async function main() {
  const token = process.env.CEYLOE_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const products = client.db(process.env.MONGODB_DB_NAME || "ceyloe").collection("products");
  const doc = await products.findOne({ handle });
  if (!doc) throw new Error(`Product not found: ${handle}`);

  const map = new Map();
  const urls = [doc.image, ...(doc.images || []), doc.certificationUrl].filter(
    (url) => typeof url === "string" && url.includes("/wp-content/uploads/"),
  );

  for (const url of urls) {
    if (map.has(url)) continue;
    const ts = await stamp(url);
    if (!ts) {
      console.log("MISS", url);
      continue;
    }
    const archive = `https://web.archive.org/web/${ts}id_/${url.replace("https://www.", "https://")}`;
    const res = await fetch(archive, {
      redirect: "follow",
      headers: { "User-Agent": "CeyloeImageMirror/1.0" },
    });
    const buf = Buffer.from(await res.arrayBuffer());
    if (!(buf[0] === 0xff && buf[1] === 0xd8)) {
      console.log("BAD", url, res.status, buf.length);
      continue;
    }
    const pathname = new URL(url).pathname.replace(/^\/+/, "");
    const blob = await put(pathname, buf, {
      access: "public",
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "image/jpeg",
    });
    const next = blob.url || `https://${HOST}/${pathname}`;
    map.set(url, next);
    console.log("OK", pathname);
  }

  const image = map.get(doc.image) || doc.image;
  const images = (doc.images || []).map((url) => map.get(url) || url);
  const certificationUrl = map.get(doc.certificationUrl) || doc.certificationUrl;
  await products.updateOne(
    { _id: doc._id },
    { $set: { image, images, certificationUrl, updatedAt: new Date().toISOString() } },
  );
  console.log(`updated ${handle} photos=${map.size}`);
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
