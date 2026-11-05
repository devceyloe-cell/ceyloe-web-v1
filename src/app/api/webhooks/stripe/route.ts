import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { markOrderStatusByStripeSession } from "@/lib/mongodb/orders";
import { fulfillPaidCheckoutSession } from "@/lib/orders/fulfill-stripe-payment";
import type Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Stripe requires the raw body for signature verification.
 * In Next.js App Router, we read it via request.text() before any parsing.
 */
export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Could not read request body" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("[stripe/webhook] Signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await fulfillPaidCheckoutSession(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.expired": {
        const expired = event.data.object as Stripe.Checkout.Session;
        console.info("[stripe/webhook] Checkout session expired:", expired.id);
        await markOrderStatusByStripeSession(expired.id, "expired");
        break;
      }

      case "checkout.session.async_payment_failed": {
        const failed = event.data.object as Stripe.Checkout.Session;
        console.warn("[stripe/webhook] Async payment failed:", failed.id);
        await markOrderStatusByStripeSession(failed.id, "failed");
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn(
          "[stripe/webhook] Payment failed:",
          pi.id,
          pi.last_payment_error?.message,
        );
        await markFailedFromPaymentIntent(pi.id);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] Handler error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ received: true, error: "Handler failed" }, { status: 200 });
  }

  return NextResponse.json({ received: true });
}

async function markFailedFromPaymentIntent(paymentIntentId: string) {
  try {
    const stripe = getStripe();
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntentId,
      limit: 1,
    });
    const sessionId = sessions.data[0]?.id;
    if (sessionId) {
      await markOrderStatusByStripeSession(sessionId, "failed");
      console.info(`[stripe/webhook] Order for session ${sessionId} marked failed`);
    }
  } catch (err) {
    console.warn(
      "[stripe/webhook] Could not mark failed from payment_intent:",
      err instanceof Error ? err.message : err,
    );
  }
}
