import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb/client";
import { normalizeAvailability } from "@/lib/product-availability";
import type { Product } from "@/types";

const COLLECTION = "products";

type StoredProduct = Omit<Product, "id">;
type StoredProductDoc = StoredProduct & { _id: ObjectId };

function toProduct(doc: StoredProductDoc): Product {
  const { _id, ...rest } = doc;
  const availability = normalizeAvailability(rest.availability, rest.inStock);
  return {
    ...rest,
    id: _id.toString(),
    availability,
    inStock: availability === "available",
  };
}

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function getAllProductsFromDb(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const docs = await db
      .collection<StoredProduct>(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return docs.map((doc) => toProduct(doc as StoredProductDoc));
  } catch {
    return [];
  }
}

export async function getProductByIdFromDb(id: string): Promise<Product | null> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return null;

  try {
    const doc = await db.collection<StoredProduct>(COLLECTION).findOne({ _id: new ObjectId(id) });
    return doc ? toProduct(doc as StoredProductDoc) : null;
  } catch {
    return null;
  }
}

export async function getProductByHandleFromDb(handle: string): Promise<Product | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const doc = await db.collection<StoredProduct>(COLLECTION).findOne({ handle });
    return doc ? toProduct(doc as StoredProductDoc) : null;
  } catch {
    return null;
  }
}

export async function isHandleTakenInDb(handle: string, excludeId?: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const filter: { handle: string; _id?: { $ne: ObjectId } } = { handle };
  if (excludeId && ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new ObjectId(excludeId) };
  }

  const count = await db.collection<StoredProduct>(COLLECTION).countDocuments(filter);
  return count > 0;
}

export async function saveProductToDb(product: Product): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("MongoDB is not configured");

  const handle = slugify(product.handle || product.title);
  if (!handle) throw new Error("Handle is required");

  const now = new Date().toISOString();
  const availability = normalizeAvailability(product.availability, product.inStock);
  const fields: StoredProduct = {
    ...product,
    handle,
    image: product.image || product.images[0] || "",
    images: product.images.length > 0 ? product.images : product.image ? [product.image] : [],
    createdAt: product.createdAt || now,
    availability,
    inStock: availability === "available",
  };

  const collection = db.collection<StoredProduct>(COLLECTION);

  if (product.id && ObjectId.isValid(product.id)) {
    await collection.updateOne({ _id: new ObjectId(product.id) }, { $set: fields });
    const updated = await collection.findOne({ _id: new ObjectId(product.id) });
    if (!updated) throw new Error("Product not found after update");
    return toProduct(updated as StoredProductDoc);
  }

  const result = await collection.insertOne(fields);
  const inserted = await collection.findOne({ _id: result.insertedId });
  if (!inserted) throw new Error("Product not found after insert");
  return toProduct(inserted as StoredProductDoc);
}

export async function deleteProductFromDb(id: string): Promise<boolean> {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return false;

  const result = await db.collection<StoredProduct>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function seedProductsToDb(products: Product[]): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("MongoDB is not configured");

  const collection = db.collection<StoredProduct>(COLLECTION);
  const existing = await collection.countDocuments();
  if (existing > 0) return 0;

  const docs: StoredProduct[] = products.map(({ id: _id, ...product }) => ({
    ...product,
    handle: slugify(product.handle || product.title),
    createdAt: product.createdAt || new Date().toISOString(),
  }));

  const result = await collection.insertMany(docs);
  return result.insertedCount;
}
