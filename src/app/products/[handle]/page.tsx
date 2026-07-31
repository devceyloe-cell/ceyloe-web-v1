import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailsView } from "@/components/product/product-details-view";
import {
  buildProductSpecifications,
  getProductTypeLabel,
} from "@/lib/product-detail";
import { getProductByHandle, getSimilarProducts } from "@/services/product-service";
import { siteConfig } from "@/config/site";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ checkout?: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { handle } = await params;
  const { checkout } = await searchParams;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const similarProducts = await getSimilarProducts(product, 5);
  const specifications = buildProductSpecifications(product);
  const typeLabel = getProductTypeLabel(product);
  const productUrl = `${siteConfig.url}/products/${product.handle}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku: product.handle,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.currency || "USD",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.specs.origin
      ? { countryOfOrigin: product.specs.origin }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gemstones",
        item: `${siteConfig.url}/gemstones`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductDetailsView
        product={product}
        typeLabel={typeLabel}
        specifications={specifications}
        similarProducts={similarProducts}
        productUrl={productUrl}
        checkoutCancelled={checkout === "cancelled"}
      />
    </>
  );
}
