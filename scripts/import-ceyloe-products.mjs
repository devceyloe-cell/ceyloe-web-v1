/**
 * Import all gemstone products from the old WooCommerce site (ceyloe.com)
 * into MongoDB for the new site catalog.
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-ceyloe-products.mjs
 *   node --env-file=.env.local scripts/import-ceyloe-products.mjs --from-cache
 *   node --env-file=.env.local scripts/import-ceyloe-products.mjs --replace
 *
 * --from-cache  use tmp-wc-page1.json / tmp-wc-page2.json if present
 * --replace     delete existing products first, then import
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { MongoClient } from "mongodb";

const BASE = "https://ceyloe.com/wp-json/wc/store/v1/products";
const ROOT = process.cwd();
const PAGE1 = join(ROOT, "tmp-wc-page1.json");
const PAGE2 = join(ROOT, "tmp-wc-page2.json");

const CATEGORY_MAP = {
  sapphires: "sapphires",
  "blue-sapphires-sapphires": "sapphires",
  "blue-sapphires": "sapphires",
  "yellow-sapphire": "sapphires",
  "pink-sapphire": "sapphires",
  "white-sapphires": "sapphires",
  "padparadscha-sapphire": "sapphires",
  teal: "sapphires",
  "bi-color-sapphire": "sapphires",
  greensapphire: "sapphires",
  "other-sapphires": "sapphires",
  spinel: "spinel",
  garnet: "garnet",
  zircon: "zircon",
  tourmaline: "tourmaline",
  jewelry: "jewellery",
  jewellery: "jewellery",
  gemstones: "other",
};

const COLOR_FROM_SLUG = {
  "blue-sapphires-sapphires": "Blue",
  "blue-sapphires": "Blue",
  "yellow-sapphire": "Yellow",
  "pink-sapphire": "Pink",
  "white-sapphires": "White",
  "padparadscha-sapphire": "Padparadscha",
  teal: "Teal",
  "bi-color-sapphire": "Parti",
  greensapphire: "Green",
};

function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&#036;/g, "$")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSpecsTable(html = "") {
  const specs = {};
  const rowRe = /<tr>\s*<th>(.*?)<\/th>\s*<td>(.*?)<\/td>\s*<\/tr>/gis;
  let match;
  while ((match = rowRe.exec(html))) {
    const key = stripHtml(match[1]).toLowerCase().replace(/:$/, "");
    const value = stripHtml(match[2]);
    if (!value) continue;
    if (key.includes("weight") || key === "carat") specs.carat = value.replace(/\s+/g, " ");
    else if (key === "color") specs.color = value;
    else if (key === "shape") specs.shape = value;
    else if (key.includes("dimension")) specs.dimensions = value;
    else if (key === "clarity") specs.clarity = value;
    else if (key === "cut") specs.cut = value;
    else if (key === "origin") specs.origin = value;
    else if (key.includes("treatment")) specs.treatment = value;
    else if (key.includes("certification")) specs.certification = value;
    else if (key.includes("item id")) specs.certificateNumber = value;
  }
  return specs;
}

function caratWeightFromText(text = "") {
  const m = String(text).match(/(\d+(?:\.\d+)?)\s*(?:ct|cts|carat)/i);
  return m ? Number(m[1]) : undefined;
}

function normalizeColor(raw) {
  if (!raw) return undefined;
  const t = raw.toLowerCase();
  if (t.includes("padparadscha")) return "Padparadscha";
  if (t.includes("parti") || t.includes("bi-color") || t.includes("bicolor") || (t.includes("blue") && t.includes("yellow"))) {
    return "Parti";
  }
  if (t.includes("teal")) return "Teal";
  if (t.includes("yellow") || t.includes("golden")) return "Yellow";
  if (t.includes("pink")) return "Pink";
  if (t.includes("white") || t.includes("colourless") || t.includes("colorless")) return "White";
  if (t.includes("green")) return "Green";
  if (t.includes("purple") || t.includes("violet")) return "Purple";
  if (t.includes("orange")) return "Orange";
  if (t.includes("brown")) return "Brown";
  if (t.includes("red")) return "Red";
  if (t.includes("blue")) return "Blue";
  return raw;
}

function colorFromTitle(title = "") {
  return normalizeColor(title);
}

function treatmentFromTitle(title = "") {
  const t = title.toLowerCase();
  if (t.includes("unheated") || t.includes("untreated") || t.includes("no heat")) return "None";
  if (t.includes("heated") || t.includes("heat")) return "Heat";
  return undefined;
}

function mapCategory(categories = [], title = "") {
  for (const cat of categories) {
    const mapped = CATEGORY_MAP[cat.slug];
    if (mapped && mapped !== "other") return mapped;
  }
  const t = title.toLowerCase();
  if (t.includes("sapphire")) return "sapphires";
  if (t.includes("spinel")) return "spinel";
  if (t.includes("garnet") || t.includes("tsavorite") || t.includes("rhodolite")) return "garnet";
  if (t.includes("zircon")) return "zircon";
  if (t.includes("tourmaline")) return "tourmaline";
  if (t.includes("ring") || t.includes("jewellery") || t.includes("jewelry")) return "jewellery";
  for (const cat of categories) {
    const mapped = CATEGORY_MAP[cat.slug];
    if (mapped) return mapped;
  }
  return "other";
}

function colorFromCategories(categories = []) {
  for (const cat of categories) {
    if (COLOR_FROM_SLUG[cat.slug]) return COLOR_FROM_SLUG[cat.slug];
  }
  return undefined;
}

function mapProduct(wc) {
  const specsFromTable = parseSpecsTable(wc.description || "");
  const images = (wc.images || [])
    .map((img) => img.src)
    .filter(Boolean)
    .filter((src) => !/certificate/i.test(src));
  const certImage = (wc.images || []).find((img) => /certificate/i.test(img.src || ""));

  const priceMinor = Number(wc.prices?.price ?? 0);
  const minorUnit = Number(wc.prices?.currency_minor_unit ?? 2);
  const price = priceMinor / 10 ** minorUnit;
  const currency = wc.prices?.currency_code || "AUD";

  const category = mapCategory(wc.categories, wc.name);
  const color = normalizeColor(
    colorFromCategories(wc.categories) || specsFromTable.color || colorFromTitle(wc.name),
  );
  const treatment = specsFromTable.treatment || treatmentFromTitle(wc.name);
  const carat = specsFromTable.carat || (wc.name.match(/[\d.]+\s*ct\.?/i)?.[0] ?? undefined);
  const caratWeight = caratWeightFromText(carat || wc.name);

  const description =
    stripHtml(wc.short_description) ||
    stripHtml(wc.description).slice(0, 600) ||
    wc.name;

  return {
    handle: wc.slug,
    title: wc.name,
    description,
    price,
    currency,
    category,
    image: images[0] || "",
    images: images.length ? images : certImage?.src ? [certImage.src] : [],
    featured: false,
    isNew: false,
    createdAt: new Date().toISOString(),
    specs: {
      carat: carat ? (/\bct\b/i.test(carat) ? carat : `${carat} ct`) : undefined,
      caratWeight,
      color,
      clarity: specsFromTable.clarity,
      cut: specsFromTable.cut,
      shape: specsFromTable.shape || specsFromTable.cut,
      dimensions: specsFromTable.dimensions,
      origin: specsFromTable.origin || "Sri Lanka",
      treatment,
      certification: specsFromTable.certification,
      certificateNumber: specsFromTable.certificateNumber,
    },
    certificationUrl: certImage?.src,
    inStock: Boolean(wc.is_in_stock),
    source: {
      site: "ceyloe.com",
      wooId: wc.id,
      permalink: wc.permalink,
    },
  };
}

function fetchViaCurl(url, outFile) {
  const result = spawnSync(
    "curl.exe",
    ["-sS", url, "-o", outFile, "--max-time", "120"],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(`curl failed for ${url}: ${result.stderr || result.status}`);
  }
}

function loadProducts(fromCache) {
  if (fromCache && existsSync(PAGE1) && existsSync(PAGE2)) {
    console.log("Using cached WooCommerce pages…");
  } else {
    console.log("Downloading products from ceyloe.com…");
    fetchViaCurl(`${BASE}?per_page=100&page=1`, PAGE1);
    fetchViaCurl(`${BASE}?per_page=100&page=2`, PAGE2);
  }
  const page1 = JSON.parse(readFileSync(PAGE1, "utf8"));
  const page2 = JSON.parse(readFileSync(PAGE2, "utf8"));
  if (!Array.isArray(page1) || !Array.isArray(page2)) {
    throw new Error("Unexpected WooCommerce response");
  }
  return [...page1, ...page2];
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const fromCache = args.has("--from-cache");
  const replace = args.has("--replace");

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "ceyloe";
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const raw = loadProducts(fromCache);
  const products = raw.map(mapProduct);
  writeFileSync(
    join(ROOT, "tmp-imported-products.json"),
    JSON.stringify(products, null, 2),
    "utf8",
  );
  console.log(`Mapped ${products.length} products.`);

  const client = new MongoClient(uri);
  await client.connect();
  const collection = client.db(dbName).collection("products");
  await collection.createIndex({ handle: 1 }, { unique: true });

  if (replace) {
    const deleted = await collection.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing products.`);
  }

  let inserted = 0;
  let updated = 0;
  for (const product of products) {
    const { handle, ...rest } = product;
    const result = await collection.updateOne(
      { handle },
      { $set: { ...rest, handle }, $setOnInsert: {} },
      { upsert: true },
    );
    if (result.upsertedCount) inserted += 1;
    else if (result.modifiedCount) updated += 1;
  }

  const total = await collection.countDocuments();
  await client.close();

  console.log(`Import complete. inserted=${inserted} updated=${updated} dbTotal=${total}`);
  console.log("Browse: http://localhost:3000/catalog  (from /gemstones category cards)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
