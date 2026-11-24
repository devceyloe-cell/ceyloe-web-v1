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
  resetOtpHash?: string | null;
  resetOtpExpiresAt?: string | null;
  resetOtpAttempts?: number;
  createdAt: string;
  updatedAt?: string;
};

export type VerifyOtpResult =
  | { ok: true; user: AdminUser }
  | { ok: false; reason: "invalid" | "expired" | "exhausted"; attemptsRemaining: number };

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
  if (!isValidAdminEmail(normalized)) {
    throw new Error("Admin username must be a valid email address");
  }

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

export async function verifyAdminLoginOtpDetailed(
  username: string,
  otp: string,
): Promise<VerifyOtpResult> {
  const code = otp.trim().replace(/\s+/g, "");
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, reason: "invalid", attemptsRemaining: MAX_OTP_ATTEMPTS };
  }

  const collection = await getCollection();
  const doc = await collection.findOne({ username: normalizeUsername(username) });
  if (!doc?.loginOtpHash) {
    return { ok: false, reason: "expired", attemptsRemaining: 0 };
  }

  if (doc.loginOtpExpiresAt && new Date(doc.loginOtpExpiresAt).getTime() < Date.now()) {
    await collection.updateOne(
      { _id: doc._id },
      { $set: { loginOtpHash: null, loginOtpExpiresAt: null, loginOtpAttempts: 0 } },
    );
    return { ok: false, reason: "expired", attemptsRemaining: 0 };
  }

  const attempts = doc.loginOtpAttempts || 0;
  if (attempts >= MAX_OTP_ATTEMPTS) {
    await collection.updateOne(
      { _id: doc._id },
      { $set: { loginOtpHash: null, loginOtpExpiresAt: null, loginOtpAttempts: 0 } },
    );
    return { ok: false, reason: "exhausted", attemptsRemaining: 0 };
  }

  if (hashToken(code) !== doc.loginOtpHash) {
    const nextAttempts = attempts + 1;
    await collection.updateOne({ _id: doc._id }, { $inc: { loginOtpAttempts: 1 } });
    const remaining = Math.max(0, MAX_OTP_ATTEMPTS - nextAttempts);
    if (remaining === 0) {
      await collection.updateOne(
        { _id: doc._id },
        { $set: { loginOtpHash: null, loginOtpExpiresAt: null, loginOtpAttempts: 0 } },
      );
      return { ok: false, reason: "exhausted", attemptsRemaining: 0 };
    }
    return { ok: false, reason: "invalid", attemptsRemaining: remaining };
  }

  await collection.updateOne(
    { _id: doc._id },
    { $set: { loginOtpHash: null, loginOtpExpiresAt: null, loginOtpAttempts: 0 } },
  );

  return {
    ok: true,
    user: toAdminUser(doc as StoredAdminUser & { _id: ObjectId }),
  };
}

/** @deprecated prefer verifyAdminLoginOtpDetailed */
export async function verifyAdminLoginOtp(
  username: string,
  otp: string,
): Promise<AdminUser | null> {
  const result = await verifyAdminLoginOtpDetailed(username, otp);
  return result.ok ? result.user : null;
}

/**
 * Find admin for password reset by username OR by a matching MFA/legacy email.
 * Delivery address preference:
 * 1) username if it is an email
 * 2) the identifier they typed if it is an email on the account
 * 3) primary MFA/legacy email
 */
export async function findAdminForPasswordReset(identifier: string): Promise<{
  user: AdminUser;
  sendTo: string;
} | null> {
  const normalized = normalizeUsername(identifier);
  if (!normalized) return null;

  const collection = await getCollection();
  let doc = await collection.findOne({ username: normalized });

  if (!doc && isValidAdminEmail(normalized)) {
    const candidates = await collection.find({}).toArray();
    doc =
      candidates.find((row) => {
        const emails = resolveEmails(row);
        return emails.includes(normalized);
      }) ?? null;
  }

  if (!doc) return null;

  const user = toAdminUser(doc as StoredAdminUser & { _id: ObjectId });
  let sendTo: string | null = null;
  if (isValidAdminEmail(user.username)) {
    sendTo = user.username;
  } else if (isValidAdminEmail(normalized) && user.emails.includes(normalized)) {
    sendTo = normalized;
  } else if (user.email && isValidAdminEmail(user.email)) {
    sendTo = user.email;
  }

  if (!sendTo) return null;
  return { user, sendTo };
}

export async function issueAdminPasswordResetOtp(identifier: string): Promise<{
  user: AdminUser;
  otp: string;
  sendTo: string;
} | null> {
  const found = await findAdminForPasswordReset(identifier);
  if (!found) return null;

  const collection = await getCollection();
  const otp = generateOtpCode();
  await collection.updateOne(
    { _id: new ObjectId(found.user.id) },
    {
      $set: {
        resetOtpHash: hashToken(otp),
        resetOtpExpiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
        resetOtpAttempts: 0,
        updatedAt: new Date().toISOString(),
      },
    },
  );

  return {
    user: found.user,
    otp,
    sendTo: found.sendTo,
  };
}

export async function resetAdminPasswordWithOtp(
  identifier: string,
  otp: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; reason: "invalid" | "expired" | "exhausted"; attemptsRemaining: number }> {
  const found = await findAdminForPasswordReset(identifier);
  if (!found) {
    return { ok: false, reason: "invalid", attemptsRemaining: 0 };
  }

  validatePasswordStrength(newPassword);

  const code = otp.trim().replace(/\s+/g, "");
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, reason: "invalid", attemptsRemaining: MAX_OTP_ATTEMPTS };
  }

  const collection = await getCollection();
  const doc = await collection.findOne({ _id: new ObjectId(found.user.id) });
  if (!doc?.resetOtpHash) {
    return { ok: false, reason: "expired", attemptsRemaining: 0 };
  }

  if (doc.resetOtpExpiresAt && new Date(doc.resetOtpExpiresAt).getTime() < Date.now()) {
    await collection.updateOne(
      { _id: doc._id },
      { $set: { resetOtpHash: null, resetOtpExpiresAt: null, resetOtpAttempts: 0 } },
    );
    return { ok: false, reason: "expired", attemptsRemaining: 0 };
  }

  const attempts = doc.resetOtpAttempts || 0;
  if (attempts >= MAX_OTP_ATTEMPTS) {
    await collection.updateOne(
      { _id: doc._id },
      { $set: { resetOtpHash: null, resetOtpExpiresAt: null, resetOtpAttempts: 0 } },
    );
    return { ok: false, reason: "exhausted", attemptsRemaining: 0 };
  }

  if (hashToken(code) !== doc.resetOtpHash) {
    const nextAttempts = attempts + 1;
    await collection.updateOne({ _id: doc._id }, { $inc: { resetOtpAttempts: 1 } });
    const remaining = Math.max(0, MAX_OTP_ATTEMPTS - nextAttempts);
    if (remaining === 0) {
      await collection.updateOne(
        { _id: doc._id },
        { $set: { resetOtpHash: null, resetOtpExpiresAt: null, resetOtpAttempts: 0 } },
      );
    }
    return {
      ok: false,
      reason: remaining === 0 ? "exhausted" : "invalid",
      attemptsRemaining: remaining,
    };
  }

  const passwordHash = await hashPassword(newPassword);
  await collection.updateOne(
    { _id: doc._id },
    {
      $set: {
        passwordHash,
        resetOtpHash: null,
        resetOtpExpiresAt: null,
        resetOtpAttempts: 0,
        loginOtpHash: null,
        loginOtpExpiresAt: null,
        loginOtpAttempts: 0,
        updatedAt: new Date().toISOString(),
      },
    },
  );

  return { ok: true };
}

export { MAX_OTP_ATTEMPTS };

export async function countAdminUsers(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  return db.collection<StoredAdminUser>(COLLECTION).countDocuments();
}

/**
 * Unique emails from every admin user’s MFA email list.
 * Used for order-success notifications (and MFA OTP delivery).
 */
export async function getAllAdminNotificationEmails(): Promise<string[]> {
  try {
    const collection = await getCollection();
    const docs = await collection.find({}).toArray();
    const seen = new Set<string>();
    const out: string[] = [];
    for (const doc of docs) {
      for (const email of resolveEmails(doc)) {
        if (seen.has(email)) continue;
        seen.add(email);
        out.push(email);
      }
    }
    return out;
  } catch {
    return [];
  }
}

export { MAX_MFA_EMAILS, OTP_TTL_MS };
