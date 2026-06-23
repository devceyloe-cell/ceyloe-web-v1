import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductSpecs } from "@/components/product/product-specs";
import { CertificationDisplay } from "@/components/product/certification-display";
import { CompareButton } from "@/components/compare/compare-button";
import { getProductByHandle } from "@/services/product-service";
import { ProductPrice } from "@/components/product/product-price";
import { BuyButton } from "@/components/product/buy-button";
import { siteConfig } from "@/config/site";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ checkout?: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.title,
    description: product.description,
    openGraph: { title: product.title, description: product.description, images: [{ url: product.image }] },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { handle } = await params;
  const { checkout } = await searchParams;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const checkoutCancelled = checkout === "cancelled";

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${product.title} listed on Ceyloe.com`,
  );

  return (
    <div className="section-bg">
      <Container className="py-12 md:py-20">
        <Link
          href="/catalog"
          className="mb-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>

        {checkoutCancelled && (
          <div className="mb-8 border border-border bg-surface-elevated px-5 py-4 text-sm text-muted">
            Checkout was cancelled. You can try again or contact us if you need help with this
            gemstone.
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <ProductGallery
            images={product.images}
            title={product.title}
            videoUrl={product.videoUrl}
            poster={product.image}
          />

          <div className="flex flex-col">
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="muted">{product.category}</Badge>
              {product.isNew && <Badge variant="sapphire">New Arrival</Badge>}
              {product.specs.certification && (
                <Badge variant="sapphire">{product.specs.certification} Certified</Badge>
              )}
            </div>

            <h1 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
              {product.title}
            </h1>

            <ProductPrice amount={product.price} />

            <p className="mt-6 text-base leading-relaxed text-muted">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <CompareButton handle={product.handle} />
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <BuyButton handle={product.handle} inStock={product.inStock} />
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button size="lg" className="w-full">
                  <MessageCircle className="h-4 w-4" />
                  Inquire on WhatsApp
                </Button>
              </a>
              <Link href="/custom-jewelry" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Custom Jewelry Inquiry
                </Button>
              </Link>
            </div>

            <div className="mt-10">
              <ProductSpecs specs={product.specs} />
            </div>

            <CertificationDisplay product={product} />
          </div>
        </div>
      </Container>
    </div>
  );
}
