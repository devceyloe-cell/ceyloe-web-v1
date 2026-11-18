import { DiscountsDashboard } from "@/components/admin/discounts-dashboard";
import { isMongoConfigured } from "@/config/env";
import { listCoupons } from "@/lib/mongodb/coupons";
import { getAllProductsFromDb } from "@/lib/mongodb/products";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const mongoConfigured = isMongoConfigured();
  const [coupons, products] = mongoConfigured
    ? await Promise.all([listCoupons(), getAllProductsFromDb()])
    : [[], []];

  return (
    <DiscountsDashboard
      initialCoupons={coupons}
      products={products}
      mongoConfigured={mongoConfigured}
    />
  );
}
