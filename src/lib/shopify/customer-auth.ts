import crypto from "node:crypto";

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

export function generateState(): string {
  return crypto.randomBytes(16).toString("hex");
}

export interface OpenIdConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
  issuer: string;
}

export async function discoverOpenIdConfiguration(
  shopDomain: string,
): Promise<OpenIdConfiguration> {
  const res = await fetch(`https://${shopDomain}/.well-known/openid-configuration`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`OpenID discovery failed: ${res.status}`);
  }
  return res.json() as Promise<OpenIdConfiguration>;
}

export interface CustomerAccountApiConfig {
  graphql_api: string;
}

export async function discoverCustomerAccountApi(
  shopDomain: string,
): Promise<CustomerAccountApiConfig> {
  const res = await fetch(`https://${shopDomain}/.well-known/customer-account-api`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Customer Account API discovery failed: ${res.status}`);
  }
  return res.json() as Promise<CustomerAccountApiConfig>;
}

export const SHOPIFY_AUTH_COOKIE = "ceyloe-shopify-customer";
export const SHOPIFY_PKCE_COOKIE = "ceyloe-shopify-pkce";
export const SHOPIFY_STATE_COOKIE = "ceyloe-shopify-state";

export interface ShopifyCustomerSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  idToken?: string;
}

export interface ShopifyCustomerProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: { emailAddress: string };
}

const CUSTOMER_QUERY = `
  query CustomerProfile {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
`;

export async function fetchCustomerProfile(
  graphqlEndpoint: string,
  accessToken: string,
): Promise<ShopifyCustomerProfile | null> {
  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ query: CUSTOMER_QUERY }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    data?: { customer?: ShopifyCustomerProfile };
  };
  return data.data?.customer ?? null;
}

export function isShopifyCustomerAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_CUSTOMER_CLIENT_ID &&
      process.env.NEXT_PUBLIC_SITE_URL,
  );
}
