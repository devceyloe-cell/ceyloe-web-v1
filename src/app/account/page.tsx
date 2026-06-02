import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  discoverCustomerAccountApi,
  fetchCustomerProfile,
  isShopifyCustomerAuthConfigured,
} from "@/lib/shopify/customer-auth";
import { getCustomerSessionFromCookies } from "@/lib/shopify/customer-session";
import { env } from "@/config/env";

export const metadata = {
  title: "My Account",
  description: "Manage your Ceyloe customer account via Shopify.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const session = await getCustomerSessionFromCookies();
  const configured = isShopifyCustomerAuthConfigured();

  let customerName: string | null = null;
  let customerEmail: string | null = null;

  if (session && configured) {
    try {
      const apiConfig = await discoverCustomerAccountApi(env.shopify.storeDomain);
      const profile = await fetchCustomerProfile(apiConfig.graphql_api, session.accessToken);
      if (profile) {
        customerName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || null;
        customerEmail = profile.emailAddress?.emailAddress ?? null;
      }
    } catch {
      // profile fetch optional
    }
  }

  return (
    <div className="section-bg">
      <section className="border-b border-border bg-surface py-12 md:py-16">
        <Container>
          <h1 className="font-display text-4xl font-light sm:text-5xl">My Account</h1>
          <p className="mt-4 max-w-xl text-muted">
            Secure customer login powered by{" "}
            <a
              href="https://shopify.com/authentication"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Shopify Authentication
            </a>
            .
          </p>
        </Container>
      </section>

      <Container className="py-16">
        {params.error && (
          <div className="mb-8 border border-border bg-surface p-4 text-sm text-muted">
            Sign in could not be completed ({params.error.replace(/_/g, " ")}). Please try again.
          </div>
        )}

        {!configured ? (
          <div className="max-w-lg border border-border bg-surface p-8">
            <h2 className="font-display text-xl text-heading">Shopify login not configured</h2>
            <p className="mt-3 text-sm text-muted">
              Add <code className="text-xs">SHOPIFY_CUSTOMER_CLIENT_ID</code> and your store domain
              to enable customer accounts via the Shopify Customer Account API.
            </p>
          </div>
        ) : session ? (
          <div className="max-w-lg border border-border bg-surface p-8">
            <h2 className="font-display text-xl text-heading">
              Welcome{customerName ? `, ${customerName}` : ""}
            </h2>
            {customerEmail && <p className="mt-2 text-sm text-muted">{customerEmail}</p>}
            <p className="mt-4 text-sm text-muted">
              You are signed in with your Shopify customer account. Order history and saved details
              are managed securely through Shopify.
            </p>
            <form action="/api/auth/shopify/logout" method="post" className="mt-8">
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </div>
        ) : (
          <div className="max-w-lg border border-border bg-surface p-8">
            <h2 className="font-display text-xl text-heading">Sign in to your account</h2>
            <p className="mt-3 text-sm text-muted">
              Access order history, saved addresses, and a faster checkout experience — the same
              secure login used by leading Shopify jewelers like{" "}
              <a
                href="https://deliqagems.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Deliqa Gems
              </a>
              .
            </p>
            <Link href="/api/auth/shopify/login" className="mt-8 inline-block">
              <Button size="lg">Continue with Shopify</Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
