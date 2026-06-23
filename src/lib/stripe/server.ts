import Stripe from "stripe";
import { env, isStripeConfigured } from "@/config/env";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripe.secretKey);
  }

  return stripeClient;
}
