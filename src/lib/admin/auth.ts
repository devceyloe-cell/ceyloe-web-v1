import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { isMongoConfigured } from "@/config/env";
import { authenticateAdminUser } from "@/lib/mongodb/admin-users";
import { type AdminRole, isAdminRole } from "@/lib/admin/roles";

const COOKIE_NAME = "ceyloe-admin-session";
const MFA_PENDING_COOKIE = "ceyloe-admin-mfa-pending";

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export function isAdminConfigured(): boolean {
  return isMongoConfigured() && Boolean(process.env.ADMIN_JWT_SECRET);
}

export async function createSessionToken(
  userId: string,
  username: string,
  adminRole: AdminRole,
): Promise<string | null> {
  const secret = getJwtSecret();
  if (!secret) return null;

  return new SignJWT({ role: "admin", sub: userId, username, adminRole })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/** Short-lived token proving password was verified; required before OTP acceptance. */
export async function createMfaPendingToken(
  userId: string,
  username: string,
): Promise<string | null> {
  const secret = getJwtSecret();
  if (!secret) return null;

  return new SignJWT({ role: "admin-mfa-pending", sub: userId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(secret);
}

export type AdminSession = {
  id: string;
  username: string;
  /** JWT auth marker — always "admin" when fully signed in */
  role: string;
  adminRole: AdminRole;
};

export type AdminMfaPending = {
  id: string;
  username: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const secret = getJwtSecret();
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const username = typeof payload.username === "string" ? payload.username : "";
    const role = typeof payload.role === "string" ? payload.role : "admin";
    const id = typeof payload.sub === "string" ? payload.sub : "";
    const adminRole = payload.adminRole;

    if (!username || !id || role !== "admin" || !isAdminRole(adminRole)) return null;
    return { id, username, role, adminRole };
  } catch {
    return null;
  }
}

export async function getAdminMfaPending(): Promise<AdminMfaPending | null> {
  const secret = getJwtSecret();
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(MFA_PENDING_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin-mfa-pending") return null;
    const username = typeof payload.username === "string" ? payload.username : "";
    const id = typeof payload.sub === "string" ? payload.sub : "";
    if (!username || !id) return null;
    return { id, username };
  } catch {
    return null;
  }
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const secret = getJwtSecret();
  if (!secret) return false;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin" && isAdminRole(payload.adminRole);
  } catch {
    return false;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function setMfaPendingCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(MFA_PENDING_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function clearMfaPendingCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(MFA_PENDING_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return Boolean(session);
}

export async function requireOwner(): Promise<AdminSession | null> {
  const session = await getAdminSession();
  if (!session || session.adminRole !== "owner") return null;
  return session;
}

export async function requireAdminRole(
  ...roles: AdminRole[]
): Promise<AdminSession | null> {
  const session = await getAdminSession();
  if (!session || !roles.includes(session.adminRole)) return null;
  return session;
}

export async function loginAdmin(username: string, password: string): Promise<string | null> {
  const user = await authenticateAdminUser(username, password);
  if (!user) return null;
  return createSessionToken(user.id, user.username, user.role);
}

export { COOKIE_NAME, MFA_PENDING_COOKIE };
