import {
  getOrderByStripeSession,
  markOrderPaidByStripeSession,
} from "@/lib/mongodb/orders";
import { getAllAdminNotificationEmails } from "@/lib/mongodb/admin-users";
import {
  sendEmail,
  buildOrderConfirmationEmailHtml,
  buildOrderConfirmationEmailText,
  buildOrderAdminNotificationHtml,
  buildOrderAdminNotificationText,
} from "@/lib/email/send";
import { getStripe } from "@/lib/stripe/server";
import type { Order } from "@/types/order";
import type Stripe from "stripe";

export type OrderLineItem = {
  name: string;
  image: string | null;
  amount: number;
  currency: string;
  quantity: number;
};

async function expandLineItems(sessionId: string): Promise<OrderLineItem[]> {
  try {
    const stripe = getStripe();
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
    console.warn(
      "[fulfill-stripe] Could not expand line items:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}

function formatShipping(order: Order | null, session: Stripe.Checkout.Session): string {
  if (order?.shipping) {
    const s = order.shipping;
    return [s.line1, s.line2, `${s.city} ${s.state} ${s.postcode}`, s.country]
      .filter(Boolean)
      .join("\n");
  }
  return session.metadata?.shippingAddress?.trim() || "";
}

async function resolveAdminEmails(): Promise<string[]> {
  const fromAdmin = await getAllAdminNotificationEmails();
  if (fromAdmin.length > 0) return fromAdmin;

  const fallback =
    process.env.EMAIL_REPLY_TO?.trim() ||
    process.env.SMTP_USER?.trim() ||
    process.env.EMAIL_FROM?.replace(/.*<(.+)>/, "$1").trim();
  return fallback ? [fallback] : [];
}

/**
 * Mark order paid from a Stripe Checkout session and send customer + admin emails
 * once (idempotent on already-paid orders).
 */
export async function fulfillPaidCheckoutSession(
  session: Stripe.Checkout.Session,
): Promise<{ order: Order | null; newlyPaid: boolean; paymentCompleted: boolean }> {
  const sessionId = session.id;
  const paymentOk =
    session.payment_status === "paid" ||
    session.payment_status === "no_payment_required";

  if (!paymentOk) {
    return { order: await getOrderByStripeSession(sessionId), newlyPaid: false, paymentCompleted: false };
  }

  const amountTotal = session.amount_total ?? 0;
  const currency = (session.currency ?? "usd").toUpperCase();

  const markResult = await markOrderPaidByStripeSession(sessionId, {
    amountTotal,
    currency,
  });

  const paidOrder = markResult?.order ?? null;
  const newlyPaid = markResult?.newlyPaid ?? false;

  const customerEmail =
    session.customer_details?.email || paidOrder?.customer.email || undefined;
  const customerName =
    session.metadata?.customerName ||
    paidOrder?.customer.name ||
    session.customer_details?.name ||
    "Valued Customer";

  console.info(
    `[fulfill-stripe] session=${sessionId} order=${paidOrder?.id ?? "n/a"} newlyPaid=${newlyPaid} payment=completed`,
  );

  if (!newlyPaid) {
    return { order: paidOrder, newlyPaid: false, paymentCompleted: true };
  }

  const lineItems = await expandLineItems(sessionId);
  const shippingAddress = formatShipping(paidOrder, session);
  const customerPhone =
    paidOrder?.customer.phone || session.metadata?.customerPhone || undefined;

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
      console.info(`[fulfill-stripe] Confirmation email sent to ${customerEmail}`);
    } catch (err) {
      console.error(
        "[fulfill-stripe] Failed to send customer email:",
        err instanceof Error ? err.message : err,
      );
    }
  }

  const adminEmails = await resolveAdminEmails();
  const adminPayload = {
    customerName,
    customerEmail: customerEmail ?? "Not provided",
    customerPhone,
    shippingAddress: shippingAddress || undefined,
    paymentStatus: "paid" as const,
    orderId: paidOrder?.id,
    sessionId,
    amountTotal,
    currency,
    lineItems,
  };

  for (const adminEmail of adminEmails) {
    try {
      await sendEmail({
        to: adminEmail,
        subject: `New order — Payment completed — ${currency} ${(amountTotal / 100).toFixed(2)} — ${customerEmail ?? "Guest"}`,
        html: buildOrderAdminNotificationHtml(adminPayload),
        text: buildOrderAdminNotificationText(adminPayload),
      });
      console.info(`[fulfill-stripe] Admin notification sent to ${adminEmail}`);
    } catch (err) {
      console.error(
        `[fulfill-stripe] Failed to send admin email to ${adminEmail}:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  return { order: paidOrder, newlyPaid: true, paymentCompleted: true };
}
