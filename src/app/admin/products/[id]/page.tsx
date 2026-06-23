import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/product-editor";
import { isMongoConfigured } from "@/config/env";
import { getProductByIdFromDb } from "@/lib/mongodb/products";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  if (!isMongoConfigured()) notFound();

  const { id } = await params;
  const product = await getProductByIdFromDb(id);
  if (!product) notFound();

  return <ProductEditor initial={product} />;
}
