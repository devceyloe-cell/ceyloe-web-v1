import { ProductsDashboard } from "@/components/admin/products-dashboard";
import { isMongoConfigured } from "@/config/env";
import { getAllProductsFromDb } from "@/lib/mongodb/products";

export default async function AdminProductsPage() {
  const products = isMongoConfigured() ? await getAllProductsFromDb() : [];

  return <ProductsDashboard products={products} mongoConfigured={isMongoConfigured()} />;
}
