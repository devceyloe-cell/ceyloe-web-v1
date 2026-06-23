import { ObjectId } from "mongodb";
import { hashPassword, verifyPassword } from "@/lib/admin/password";
import { getDb } from "@/lib/mongodb/client";

const COLLECTION = "admin_users";

type StoredAdminUser = {
  username: string;
  passwordHash: string;
  createdAt: string;
  updatedAt?: string;
};

export type AdminUser = {
  id: string;
  username: string;
  createdAt: string;
};

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function toAdminUser(doc: StoredAdminUser & { _id: ObjectId }): AdminUser {
  return {
    id: doc._id.toString(),
    username: doc.username,
    createdAt: doc.createdAt,
  };
}

async function getCollection() {
  const db = await getDb();
  if (!db) throw new Error("MongoDB is not configured");
  const collection = db.collection<StoredAdminUser>(COLLECTION);
  await collection.createIndex({ username: 1 }, { unique: true });
  return collection;
}

export async function getAdminUserByUsername(username: string): Promise<(AdminUser & { passwordHash: string }) | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ username: normalizeUsername(username) });
  if (!doc) return null;
  return { ...toAdminUser(doc as StoredAdminUser & { _id: ObjectId }), passwordHash: doc.passwordHash };
}

export async function authenticateAdminUser(
  username: string,
  password: string,
): Promise<AdminUser | null> {
  const user = await getAdminUserByUsername(username);
  if (!user) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  const { passwordHash: _hash, ...admin } = user;
  return admin;
}

export async function createAdminUser(username: string, password: string): Promise<AdminUser> {
  const normalized = normalizeUsername(username);
  if (!normalized) throw new Error("Username is required");
  if (password.length < 8) throw new Error("Password must be at least 8 characters");

  const collection = await getCollection();
  const existing = await collection.findOne({ username: normalized });
  if (existing) throw new Error("Username already exists");

  const now = new Date().toISOString();
  const passwordHash = await hashPassword(password);
  const result = await collection.insertOne({
    username: normalized,
    passwordHash,
    createdAt: now,
  });

  return {
    id: result.insertedId.toString(),
    username: normalized,
    createdAt: now,
  };
}

export async function countAdminUsers(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  return db.collection<StoredAdminUser>(COLLECTION).countDocuments();
}
