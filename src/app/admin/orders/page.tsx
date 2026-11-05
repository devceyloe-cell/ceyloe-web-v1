import { OrdersDashboard } from "@/components/admin/orders-dashboard";
import { isMongoConfigured, isStripeConfigured } from "@/config/env";
import { getAllOrders } from "@/lib/mongodb/orders";
import { reconcilePendingOrdersFromStripe } from "@/lib/orders/reconcile-stripe-payments";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (isMongoConfigured() && isStripeConfigured()) {
    // Pull live Stripe Checkout status for pending orders (no manual mark).
    await reconcilePendingOrdersFromStripe(25);
  }

  const orders = isMongoConfigured() ? await getAllOrders() : [];

  return <OrdersDashboard orders={orders} mongoConfigured={isMongoConfigured()} />;
}
