import { createHash, randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb/client";

const COLLECTION = "users";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

type StoredUser = {
  email: string;
  emailVerified: boolean;
  verificationTokenHash?: string | null;
  verificationExpiresAt?: string | null;
  loginOtpHash?: string | null;
  loginOtpExpiresAt?: string | null;
  loginOtpAttempts?: number;
  createdAt: string;
  verifiedAt?: string | null;
};

export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return EMAIL_RE.test(normalizeEmail(email));
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function toUser(doc: StoredUser & { _id: ObjectId }): User {
  return {
    id: doc._id.toString(),
    email: doc.email,
    emailVerified: Boolean(doc.emailVerified),
    createdAt: doc.createdAt,
  };
}

async function getCollection() {
  const db = await getDb();
  if (!db) throw new Error("MongoDB is not configured");
  const collection = db.collection<StoredUser>(COLLECTION);
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex({ verificationTokenHash: 1 }, { sparse: true });
  return collection;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ email: normalizeEmail(email) });
  if (!doc) return null;
  return toUser(doc as StoredUser & { _id: ObjectId });
}

export async function getUserById(id: string): Promise<User | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return toUser(doc as StoredUser & { _id: ObjectId });
}

export type PendingRegistration = {
  user: User;
  verificationToken: string;
};

/** Create unverified user (or refresh token if unverified account already exists). */
export async function createPendingUser(email: string): Promise<PendingRegistration> {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email is required");
  if (!isValidEmail(normalized)) throw new Error("Enter a valid email address");

  const collection = await getCollection();
  const existing = await collection.findOne({ email: normalized });

  if (existing?.emailVerified) {
    throw new Error("An account with this email already exists");
  }

  const verificationToken = randomBytes(32).toString("hex");
  const verificationTokenHash = hashToken(verificationToken);
  const verificationExpiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();
  const now = new Date().toISOString();

  if (existing) {
    await collection.updateOne(
      { _id: existing._id },
      {
        $set: {
          emailVerified: false,
          verificationTokenHash,
          verificationExpiresAt,
        },
      },
    );

    return {
      user: toUser(existing as StoredUser & { _id: ObjectId }),
      verificationToken,
    };
  }

  const result = await collection.insertOne({
    email: normalized,
    emailVerified: false,
    verificationTokenHash,
    verificationExpiresAt,
    createdAt: now,
  });

  return {
    user: {
      id: result.insertedId.toString(),
      email: normalized,
      emailVerified: false,
      createdAt: now,
    },
    verificationToken,
  };
}

export async function issueVerificationToken(email: string): Promise<{
  user: User;
  verificationToken: string;
} | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ email: normalizeEmail(email) });
  if (!doc) return null;
  if (doc.emailVerified) throw new Error("Email is already verified");

  const verificationToken = randomBytes(32).toString("hex");
  const verificationTokenHash = hashToken(verificationToken);
  const verificationExpiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  await collection.updateOne(
    { _id: doc._id },
    { $set: { verificationTokenHash, verificationExpiresAt } },
  );

  return {
    user: toUser(doc as StoredUser & { _id: ObjectId }),
    verificationToken,
  };
}

export async function verifyUserByToken(token: string): Promise<User | null> {
  if (!token?.trim()) return null;

  const collection = await getCollection();
  const verificationTokenHash = hashToken(token.trim());
  const doc = await collection.findOne({ verificationTokenHash });
  if (!doc) return null;

  if (doc.verificationExpiresAt && new Date(doc.verificationExpiresAt).getTime() < Date.now()) {
    return null;
  }

  const now = new Date().toISOString();
  await collection.updateOne(
    { _id: doc._id },
    {
      $set: {
        emailVerified: true,
        verifiedAt: now,
        verificationTokenHash: null,
        verificationExpiresAt: null,
      },
    },
  );

  return {
    id: doc._id.toString(),
    email: doc.email,
    emailVerified: true,
    createdAt: doc.createdAt,
  };
}

export async function getAllUsers(): Promise<User[]> {
  const collection = await getCollection();
  const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((doc) => toUser(doc as StoredUser & { _id: ObjectId }));
}

export async function deleteUser(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

const OTP_TTL_MS = 1000 * 60 * 10; // 10 minutes

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function issueLoginOtp(email: string): Promise<{
  user: User;
  otp: string;
} | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ email: normalizeEmail(email) });
  if (!doc) return null;
  if (!doc.emailVerified) {
    throw new Error("Please confirm your email first before signing in.");
  }

  const otp = generateOtpCode();
  const loginOtpHash = hashToken(otp);
  const loginOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await collection.updateOne(
    { _id: doc._id },
    { $set: { loginOtpHash, loginOtpExpiresAt, loginOtpAttempts: 0 } },
  );

  return {
    user: toUser(doc as StoredUser & { _id: ObjectId }),
    otp,
  };
}

export async function verifyLoginOtp(email: string, otp: string): Promise<User | null> {
  const code = otp.trim().replace(/\s+/g, "");
  if (!/^\d{6}$/.test(code)) return null;

  const collection = await getCollection();
  const doc = await collection.findOne({ email: normalizeEmail(email) });
  if (!doc?.loginOtpHash || !doc.emailVerified) return null;

  if (doc.loginOtpExpiresAt && new Date(doc.loginOtpExpiresAt).getTime() < Date.now()) {
    // OTP expired, clear it
    await collection.updateOne(
      { _id: doc._id },
      { $set: { loginOtpHash: null, loginOtpExpiresAt: null, loginOtpAttempts: 0 } },
    );
    return null;
  }

  // Check if too many attempts (max 5)
  const attempts = doc.loginOtpAttempts || 0;
  if (attempts >= 5) {
    // Invalidate OTP after 5 failed attempts
    await collection.updateOne(
      { _id: doc._id },
      { $set: { loginOtpHash: null, loginOtpExpiresAt: null, loginOtpAttempts: 0 } },
    );
    return null;
  }

  // Verify OTP
  if (hashToken(code) !== doc.loginOtpHash) {
    // Wrong code, increment attempt counter
    await collection.updateOne({ _id: doc._id }, { $inc: { loginOtpAttempts: 1 } });
    return null;
  }

  // Success: clear OTP and attempts
  await collection.updateOne(
    { _id: doc._id },
    { $set: { loginOtpHash: null, loginOtpExpiresAt: null, loginOtpAttempts: 0 } },
  );

  return toUser(doc as StoredUser & { _id: ObjectId });
}

