import { notFound } from "next/navigation";
import { getProductByHandle } from "@/services/product-service";
import { CertificateView } from "@/components/product/certificate-view";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function CertificatePage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  return <CertificateView product={product} />;
}
