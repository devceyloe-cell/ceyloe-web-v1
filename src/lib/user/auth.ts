import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { isMongoConfigured } from "@/config/env";
import {
  createPendingUser,
  getUserByEmail,
  type User,
} from "@/lib/mongodb/users";

export const USER_COOKIE_NAME = "ceyloe-user-session";

function getJwtSecret() {
  const secret = process.env.USER_JWT_SECRET || process.env.ADMIN_JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export function isUserAuthConfigured(): boolean {
  return isMongoConfigured() && Boolean(process.env.USER_JWT_SECRET || process.env.ADMIN_JWT_SECRET);
}

export async function createUserSessionToken(userId: string, email: string): Promise<string | null> {
  const secret = getJwtSecret();
  if (!secret) return null;

  return new SignJWT({ role: "user", sub: userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export type UserSession = {
  id: string;
  email: string;
  role: string;
};

export async function getUserSession(): Promise<UserSession | null> {
  const secret = getJwtSecret();
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const email = typeof payload.email === "string" ? payload.email : "";
    const role = typeof payload.role === "string" ? payload.role : "user";
    const id = typeof payload.sub === "string" ? payload.sub : "";
    if (!email || !id || role !== "user") return null;
    return { id, email, role };
  } catch {
    return null;
  }
}

export async function setUserSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(USER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearUserSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE_NAME);
}

export async function loginUser(email: string): Promise<
  | { ok: true; token: string; user: User }
  | { ok: false; reason: "not_found" | "unverified" }
> {
  const user = await getUserByEmail(email);
  if (!user) return { ok: false, reason: "not_found" };
  if (!user.emailVerified) return { ok: false, reason: "unverified" };

  const token = await createUserSessionToken(user.id, user.email);
  if (!token) return { ok: false, reason: "not_found" };
  return { ok: true, token, user };
}

export async function startRegistration(email: string) {
  return createPendingUser(email);
}

export async function createSessionForUser(user: User) {
  const token = await createUserSessionToken(user.id, user.email);
  if (!token) throw new Error("Could not create session");
  await setUserSessionCookie(token);
  return token;
}
