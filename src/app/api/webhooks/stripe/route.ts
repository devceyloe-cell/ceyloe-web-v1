import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import {
  sendEmail,
  buildOrderConfirmationEmailHtml,
  buildOrderConfirmationEmailText,
  buildOrderAdminNotificationHtml,
  buildOrderAdminNotificationText,
} from "@/lib/email/send";
import type Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export interface OrderLineItem {
  name: string;
  image: string | null;
  amount: number;   // in cents
  currency: string;
  quantity: number;
}

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
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.expired":
        console.info("[stripe/webhook] Checkout session expired:", event.data.object.id);
        break;

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn("[stripe/webhook] Payment failed:", pi.id, pi.last_payment_error?.message);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] Handler error:", err instanceof Error ? err.message : err);
    // Return 200 so Stripe doesn't retry — log the error for investigation
    return NextResponse.json({ received: true, error: "Handler failed" }, { status: 200 });
  }

  return NextResponse.json({ received: true });
}

async function expandLineItems(sessionId: string): Promise<OrderLineItem[]> {
  try {
    const stripe = getStripe();
    // Retrieve the session with line_items fully expanded (product name + images)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    const items: OrderLineItem[] = [];
    for (const item of session.line_items?.data ?? []) {
      const product = item.price?.product as Stripe.Product | null;
      items.push({
        name: product?.name ?? item.description ?? "Gemstone",
        image: product?.images?.[0] ?? null,
        amount: item.amount_total ?? 0,
        currency: (item.price?.currency ?? "usd").toUpperCase(),
        quantity: item.quantity ?? 1,
      });
    }
    return items;
  } catch (err) {
    console.warn("[stripe/webhook] Could not expand line items:", err instanceof Error ? err.message : err);
    return [];
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name ?? "Valued Customer";
  const amountTotal = session.amount_total ?? 0;
  const currency = (session.currency ?? "usd").toUpperCase();
  const sessionId = session.id;

  console.info(
    `[stripe/webhook] checkout.session.completed — session=${sessionId}, customer=${customerEmail}, amount=${amountTotal / 100} ${currency}`,
  );

  // Fetch line items with product name + image from Stripe
  const lineItems = await expandLineItems(sessionId);

  // 1. Send confirmation email to the customer
  if (customerEmail) {
    try {
      await sendEmail({
        to: customerEmail,
        subject: "Your Ceyloe order is confirmed ✨",
        html: buildOrderConfirmationEmailHtml({
          customerName,
          sessionId,
          amountTotal,
          currency,
          lineItems,
        }),
        text: buildOrderConfirmationEmailText({
          customerName,
          sessionId,
          amountTotal,
          currency,
          lineItems,
        }),
      });
      console.info(`[stripe/webhook] Confirmation email sent to ${customerEmail}`);
    } catch (err) {
      console.error("[stripe/webhook] Failed to send customer email:", err instanceof Error ? err.message : err);
    }
  }

  // 2. Send admin notification to the configured business email
  const adminEmail =
    process.env.EMAIL_REPLY_TO?.trim() ||
    process.env.SMTP_USER?.trim() ||
    process.env.EMAIL_FROM?.replace(/.*<(.+)>/, "$1").trim();

  if (adminEmail) {
    try {
      await sendEmail({
        to: adminEmail,
        subject: `New order — ${currency} ${(amountTotal / 100).toFixed(2)} — ${customerEmail ?? "Guest"}`,
        html: buildOrderAdminNotificationHtml({
          customerName,
          customerEmail: customerEmail ?? "Not provided",
          sessionId,
          amountTotal,
          currency,
          lineItems,
        }),
        text: buildOrderAdminNotificationText({
          customerName,
          customerEmail: customerEmail ?? "Not provided",
          sessionId,
          amountTotal,
          currency,
          lineItems,
        }),
      });
      console.info(`[stripe/webhook] Admin notification sent to ${adminEmail}`);
    } catch (err) {
      console.error("[stripe/webhook] Failed to send admin email:", err instanceof Error ? err.message : err);
    }
  }
}
