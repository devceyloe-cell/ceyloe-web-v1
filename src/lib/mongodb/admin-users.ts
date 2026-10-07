import { createHash, randomInt } from "crypto";
import { ObjectId } from "mongodb";
import { hashPassword, verifyPassword } from "@/lib/admin/password";
import { getDb } from "@/lib/mongodb/client";

const COLLECTION = "admin_users";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_TTL_MS = 1000 * 60 * 10; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;
const MAX_MFA_EMAILS = 5;

type StoredAdminUser = {
  username: string;
  passwordHash: string;
  /** @deprecated use emails — kept for older documents */
  email?: string | null;
  emails?: string[];
  loginOtpHash?: string | null;
  loginOtpExpiresAt?: string | null;
  loginOtpAttempts?: number;
  createdAt: string;
  updatedAt?: string;
};

export type AdminUser = {
  id: string;
  username: string;
  /** Primary MFA email (first in list) */
  email: string | null;
  /** All MFA delivery addresses */
  emails: string[];
  createdAt: string;
};

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidAdminEmail(email: string) {
  return EMAIL_RE.test(normalizeEmail(email));
}

export function normalizeMfaEmails(input: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input) {
    const email = normalizeEmail(raw);
    if (!email || !isValidAdminEmail(email) || seen.has(email)) continue;
    seen.add(email);
    out.push(email);
    if (out.length >= MAX_MFA_EMAILS) break;
  }
  return out;
}

function resolveEmails(doc: StoredAdminUser): string[] {
  const fromArray = Array.isArray(doc.emails) ? doc.emails : [];
  const legacy = doc.email?.trim() ? [doc.email] : [];
  return normalizeMfaEmails([...fromArray, ...legacy]);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

function toAdminUser(doc: StoredAdminUser & { _id: ObjectId }): AdminUser {
  const emails = resolveEmails(doc);
  return {
    id: doc._id.toString(),
    username: doc.username,
    email: emails[0] ?? null,
    emails,
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

export async function getAdminUserByUsername(
  username: string,
): Promise<(AdminUser & { passwordHash: string }) | null> {
  const collection = await getCollection(); // throws if MongoDB unavailable — callers must handle
  const doc = await collection.findOne({ username: normalizeUsername(username) });
  if (!doc) return null;
  return {
    ...toAdminUser(doc as StoredAdminUser & { _id: ObjectId }),
    passwordHash: doc.passwordHash,
  };
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  if (!ObjectId.isValid(id)) return null;
  try {
    const collection = await getCollection();
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return toAdminUser(doc as StoredAdminUser & { _id: ObjectId });
  } catch {
    return null;
  }
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

export function validatePasswordStrength(password: string): void {
  if (password.length < 12) {
    throw new Error("Password must be at least 12 characters");
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strength = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  if (strength < 3) {
    throw new Error(
      "Password must contain at least 3 of: uppercase, lowercase, numbers, special characters",
    );
  }

  const commonWords = ["password", "admin", "qwerty", "12345", "ceyloe"];
  const lowerPass = password.toLowerCase();
  if (commonWords.some((word) => lowerPass.includes(word))) {
    throw new Error("Password contains common words. Please choose a stronger password.");
  }
}

export async function createAdminUser(
  username: string,
  password: string,
  email?: string,
): Promise<AdminUser> {
  const normalized = normalizeUsername(username);
  if (!normalized) throw new Error("Username is required");

  validatePasswordStrength(password);

  const emails = email?.trim() ? normalizeMfaEmails([email]) : [];
  if (email?.trim() && emails.length === 0) {
    throw new Error("Enter a valid email address");
  }

  const collection = await getCollection();
  const existing = await collection.findOne({ username: normalized });
  if (existing) throw new Error("Username already exists");

  const now = new Date().toISOString();
  const passwordHash = await hashPassword(password);
  const result = await collection.insertOne({
    username: normalized,
    passwordHash,
    email: emails[0] ?? null,
    emails,
    createdAt: now,
  });

  return {
    id: result.insertedId.toString(),
    username: normalized,
    email: emails[0] ?? null,
    emails,
    createdAt: now,
  };
}

export async function updateAdminProfile(
  id: string,
  input: { emails?: string[] },
): Promise<AdminUser | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getCollection();
  const updates: Partial<StoredAdminUser> = {
    updatedAt: new Date().toISOString(),
  };

  if (input.emails !== undefined) {
    const emails = normalizeMfaEmails(input.emails);
    if (input.emails.some((e) => e.trim()) && emails.length === 0) {
      throw new Error("Enter at least one valid email address");
    }
    if (input.emails.length > MAX_MFA_EMAILS) {
      throw new Error(`You can add up to ${MAX_MFA_EMAILS} MFA emails`);
    }
    updates.emails = emails;
    updates.email = emails[0] ?? null;
  }

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" },
  );

  if (!result) return null;
  return toAdminUser(result as StoredAdminUser & { _id: ObjectId });
}

export async function changeAdminPassword(
  id: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  if (!ObjectId.isValid(id)) throw new Error("Admin not found");

  const collection = await getCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) throw new Error("Admin not found");

  const valid = await verifyPassword(currentPassword, doc.passwordHash);
  if (!valid) throw new Error("Current password is incorrect");

  validatePasswordStrength(newPassword);

  if (currentPassword === newPassword) {
    throw new Error("New password must be different from the current password");
  }

  const passwordHash = await hashPassword(newPassword);
  await collection.updateOne(
    { _id: doc._id },
    { $set: { passwordHash, updatedAt: new Date().toISOString() } },
  );
}

export async function issueAdminLoginOtp(username: string): Promise<{
  user: AdminUser;
  otp: string;
} | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ username: normalizeUsername(username) });
  if (!doc) return null;

  const user = toAdminUser(doc as StoredAdminUser & { _id: ObjectId });
  if (user.emails.length === 0) {
    throw new Error("Admin MFA emails are required. Set them in Admin → Settings.");
  }

  const otp = generateOtpCode();
  const loginOtpHash = hashToken(otp);
  const loginOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  await collection.updateOne(
    { _id: doc._id },
    { $set: { loginOtpHash, loginOtpExpiresAt, loginOtpAttempts: 0 } },
  );

  return { user, otp };
}

export async function verifyAdminLoginOtp(
  username: string,
  otp: string,
): Promise<AdminUser | null> {
  const code = otp.trim().replace(/\s+/g, "");
  if (!/^\d{6}$/.test(code)) return null;

  const collection = await getCollection();
  const doc = await collection.findOne({ username: normalizeUsername(username) });
  if (!doc?.loginOtpHash) return null;

  if (doc.loginOtpExpiresAt && new Date(doc.loginOtpExpiresAt).getTime() < Date.now()) {
    await collection.updateOne(
      { _id: doc._id },
      { $set: { loginOtpHash: null, loginOtpExpiresAt: null, loginOtpAttempts: 0 } },
    );
    return null;
  }

  const attempts = doc.loginOtpAttempts || 0;
  if (attempts >= MAX_OTP_ATTEMPTS) {
    await collection.updateOne(
      { _id: doc._id },
      { $set: { loginOtpHash: null, loginOtpExpiresAt: null, loginOtpAttempts: 0 } },
    );
    return null;
  }

  if (hashToken(code) !== doc.loginOtpHash) {
    await collection.updateOne({ _id: doc._id }, { $inc: { loginOtpAttempts: 1 } });
    return null;
  }

  await collection.updateOne(
    { _id: doc._id },
    { $set: { loginOtpHash: null, loginOtpExpiresAt: null, loginOtpAttempts: 0 } },
  );

  return toAdminUser(doc as StoredAdminUser & { _id: ObjectId });
}

export async function countAdminUsers(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  return db.collection<StoredAdminUser>(COLLECTION).countDocuments();
}

export { MAX_MFA_EMAILS };
