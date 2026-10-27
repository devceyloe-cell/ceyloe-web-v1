import { OrdersDashboard } from "@/components/admin/orders-dashboard";
import { isMongoConfigured } from "@/config/env";
import { getAllOrders } from "@/lib/mongodb/orders";

export default async function AdminOrdersPage() {
  const orders = isMongoConfigured() ? await getAllOrders() : [];

  return <OrdersDashboard orders={orders} mongoConfigured={isMongoConfigured()} />;
}
