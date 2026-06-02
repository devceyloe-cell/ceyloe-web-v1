import { NextResponse } from "next/server";
import {
  discoverOpenIdConfiguration,
  generateCodeChallenge,
  generateCodeVerifier,
  generateState,
  isShopifyCustomerAuthConfigured,
  SHOPIFY_PKCE_COOKIE,
  SHOPIFY_STATE_COOKIE,
} from "@/lib/shopify/customer-auth";

export async function GET() {
  if (!isShopifyCustomerAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Shopify Customer Account API is not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN, SHOPIFY_CUSTOMER_CLIENT_ID, and NEXT_PUBLIC_SITE_URL.",
      },
      { status: 503 },
    );
  }

  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
  const clientId = process.env.SHOPIFY_CUSTOMER_CLIENT_ID!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const redirectUri = `${siteUrl}/api/auth/shopify/callback`;

  const config = await discoverOpenIdConfiguration(shopDomain);
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  const state = generateState();

  const params = new URLSearchParams({
    client_id: clientId,
    scope: "openid email customer-account-api:full",
    response_type: "code",
    redirect_uri: redirectUri,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  const response = NextResponse.redirect(`${config.authorization_endpoint}?${params.toString()}`);

  response.cookies.set(SHOPIFY_PKCE_COOKIE, verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  response.cookies.set(SHOPIFY_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
