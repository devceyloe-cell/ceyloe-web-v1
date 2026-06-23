import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { isMongoConfigured } from "@/config/env";
import { authenticateAdminUser } from "@/lib/mongodb/admin-users";

const COOKIE_NAME = "ceyloe-admin-session";

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export function isAdminConfigured(): boolean {
  return isMongoConfigured() && Boolean(process.env.ADMIN_JWT_SECRET);
}

export async function createSessionToken(userId: string, username: string): Promise<string | null> {
  const secret = getJwtSecret();
  if (!secret) return null;

  return new SignJWT({ role: "admin", sub: userId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export type AdminSession = {
  id: string;
  username: string;
  role: string;
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

    if (!username || !id) return null;
    return { id, username, role };
  } catch {
    return null;
  }
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const secret = getJwtSecret();
  if (!secret) return false;

  try {
    await jwtVerify(token, secret);
    return true;
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

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return Boolean(session);
}

export async function loginAdmin(username: string, password: string): Promise<string | null> {
  const user = await authenticateAdminUser(username, password);
  if (!user) return null;
  return createSessionToken(user.id, user.username);
}
