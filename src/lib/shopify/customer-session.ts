import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { ShopifyCustomerSession } from "@/lib/shopify/customer-auth";

const secret = new TextEncoder().encode(
  process.env.SHOPIFY_CUSTOMER_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "ceyloe-dev-secret",
);

export async function sealCustomerSession(session: ShopifyCustomerSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function readCustomerSession(
  token: string,
): Promise<ShopifyCustomerSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as ShopifyCustomerSession;
  } catch {
    return null;
  }
}

export async function getCustomerSessionFromCookies(): Promise<ShopifyCustomerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("ceyloe-shopify-customer")?.value;
  if (!token) return null;
  return readCustomerSession(token);
}
