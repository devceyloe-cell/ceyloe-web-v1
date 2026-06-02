import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  discoverCustomerAccountApi,
  discoverOpenIdConfiguration,
  isShopifyCustomerAuthConfigured,
  SHOPIFY_AUTH_COOKIE,
  SHOPIFY_PKCE_COOKIE,
  SHOPIFY_STATE_COOKIE,
} from "@/lib/shopify/customer-auth";
import { sealCustomerSession } from "@/lib/shopify/customer-session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${siteUrl}/account?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state || !isShopifyCustomerAuthConfigured()) {
    return NextResponse.redirect(`${siteUrl}/account?error=auth_failed`);
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get(SHOPIFY_STATE_COOKIE)?.value;
  const verifier = cookieStore.get(SHOPIFY_PKCE_COOKIE)?.value;

  if (!storedState || storedState !== state || !verifier) {
    return NextResponse.redirect(`${siteUrl}/account?error=invalid_state`);
  }

  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
  const clientId = process.env.SHOPIFY_CUSTOMER_CLIENT_ID!;
  const redirectUri = `${siteUrl}/api/auth/shopify/callback`;

  try {
    const config = await discoverOpenIdConfiguration(shopDomain);

    const tokenRes = await fetch(config.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
        code_verifier: verifier,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${siteUrl}/account?error=token_exchange_failed`);
    }

    const tokenData = (await tokenRes.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      id_token?: string;
    };

    await discoverCustomerAccountApi(shopDomain);

    const sealed = await sealCustomerSession({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
      idToken: tokenData.id_token,
    });

    const response = NextResponse.redirect(`${siteUrl}/account`);
    response.cookies.set(SHOPIFY_AUTH_COOKIE, sealed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    response.cookies.delete(SHOPIFY_PKCE_COOKIE);
    response.cookies.delete(SHOPIFY_STATE_COOKIE);
    return response;
  } catch {
    return NextResponse.redirect(`${siteUrl}/account?error=auth_failed`);
  }
}
