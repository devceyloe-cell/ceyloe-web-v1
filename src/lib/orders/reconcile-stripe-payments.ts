import { isStripeConfigured } from "@/config/env";
import {
  getPendingOrdersWithStripeSession,
  markOrderStatusByStripeSession,
} from "@/lib/mongodb/orders";
import { fulfillPaidCheckoutSession } from "@/lib/orders/fulfill-stripe-payment";
import { getStripe } from "@/lib/stripe/server";

export type ReconcileResult = {
  checked: number;
  markedPaid: number;
  markedExpired: number;
  markedFailed: number;
  errors: number;
};

/**
 * Ask Stripe for the real status of pending Checkout sessions and update Mongo.
 * No manual admin “mark paid” — source of truth is Stripe payment_status.
 */
export async function reconcilePendingOrdersFromStripe(
  limit = 25,
): Promise<ReconcileResult> {
  const result: ReconcileResult = {
    checked: 0,
    markedPaid: 0,
    markedExpired: 0,
    markedFailed: 0,
    errors: 0,
  };

  if (!isStripeConfigured()) return result;

  const pending = await getPendingOrdersWithStripeSession(limit);
  if (pending.length === 0) return result;

  const stripe = getStripe();

  for (const order of pending) {
    const sessionId = order.stripeSessionId?.trim();
    if (!sessionId) continue;

    result.checked += 1;
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required"
      ) {
        const fulfill = await fulfillPaidCheckoutSession(session);
        if (fulfill.newlyPaid || fulfill.paymentCompleted) {
          result.markedPaid += 1;
        }
        continue;
      }

      if (session.status === "expired") {
        await markOrderStatusByStripeSession(sessionId, "expired");
        result.markedExpired += 1;
        continue;
      }

      // Unpaid open session stays pending until Stripe confirms pay or expire.
    } catch (err) {
      result.errors += 1;
      console.warn(
        `[reconcile-stripe] session=${sessionId} order=${order.id}:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  if (result.markedPaid || result.markedExpired || result.errors) {
    console.info(
      `[reconcile-stripe] checked=${result.checked} paid=${result.markedPaid} expired=${result.markedExpired} errors=${result.errors}`,
    );
  }

  return result;
}
