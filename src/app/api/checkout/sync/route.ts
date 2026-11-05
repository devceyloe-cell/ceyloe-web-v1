import { NextRequest, NextResponse } from "next/server";
import { isMongoConfigured, isStripeConfigured } from "@/config/env";
import { getStripe } from "@/lib/stripe/server";
import {
  getOrderByStripeSession,
  markOrderStatusByStripeSession,
} from "@/lib/mongodb/orders";
import { fulfillPaidCheckoutSession } from "@/lib/orders/fulfill-stripe-payment";
import type { OrderPaymentStatus } from "@/types/order";

/**
 * Sync order payment status from a Stripe Checkout session (success-page backup
 * when the webhook is delayed). Clears pending/completed from Stripe and emails
 * admins/customer once via the shared fulfill helper.
 */
export async function GET(request: NextRequest) {
  if (!isStripeConfigured() || !isMongoConfigured()) {
    return NextResponse.json({ error: "Checkout sync unavailable" }, { status: 503 });
  }

  const sessionId = request.nextUrl.searchParams.get("session_id")?.trim();
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    let paymentStatus: OrderPaymentStatus = "pending";
    let label = "Payment pending";

    if (session.status === "expired") {
      await markOrderStatusByStripeSession(sessionId, "expired");
      paymentStatus = "expired";
      label = "Payment expired";
    } else if (
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required"
    ) {
      const result = await fulfillPaidCheckoutSession(session);
      paymentStatus = result.paymentCompleted ? "paid" : "pending";
      label = result.paymentCompleted ? "Payment completed" : "Payment pending";
    } else if (session.payment_status === "unpaid") {
      const existing = await getOrderByStripeSession(sessionId);
      paymentStatus = existing?.paymentStatus === "failed" ? "failed" : "pending";
      label = paymentStatus === "failed" ? "Payment failed" : "Payment pending";
    }

    const order = await getOrderByStripeSession(sessionId);
    const finalStatus = order?.paymentStatus ?? paymentStatus;

    return NextResponse.json({
      paymentStatus: finalStatus,
      label:
        finalStatus === "paid"
          ? "Payment completed"
          : finalStatus === "failed"
            ? "Payment failed"
            : finalStatus === "expired"
              ? "Payment expired"
              : label,
      orderId: order?.id ?? session.metadata?.orderId ?? null,
      stripePaymentStatus: session.payment_status,
      sessionStatus: session.status,
    });
  } catch (err) {
    console.error("[checkout/sync]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not sync payment status" }, { status: 500 });
  }
}
