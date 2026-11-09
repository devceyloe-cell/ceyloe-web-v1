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
  const description =
    product.description?.trim() ||
    `${product.title} — certified natural gemstone available to buyers in Perth and Western Australia from Ceyloe.`;
  return {
    title: product.title,
    description,
    alternates: {
      canonical: `/products/${product.handle}`,
    },
    openGraph: {
      title: product.title,
      description,
      images: product.image ? [{ url: product.image }] : undefined,
      locale: siteConfig.locale,
      type: "website",
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
      priceCurrency: product.currency || "AUD",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      areaServed: siteConfig.contact.serviceAreas.map((name) => ({
        "@type": "AdministrativeArea",
        name,
      })),
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
