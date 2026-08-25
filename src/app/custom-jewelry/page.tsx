import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { CategoryCardGrid } from "@/components/gemstones/category-card-grid";
import { CustomJewelryForm } from "@/components/forms/custom-jewelry-form";
import { WebCoverHero } from "@/components/layout/web-cover-hero";
import { bespokeLandingCards } from "@/data/bespoke-content";
import { webCovers } from "@/config/web-covers";
import { Price } from "@/components/ui/price";

export const metadata: Metadata = {
  title: "Bespoke Jewellery",
  description:
    "Create a one-of-a-kind jewellery piece with a natural gemstone from our collection — engagement rings, pendants, earrings and more.",
};

interface CustomJewelryPageProps {
  searchParams: Promise<{
    stone?: string;
    handle?: string;
    price?: string;
    image?: string;
  }>;
}

export default async function CustomJewelryPage({ searchParams }: CustomJewelryPageProps) {
  const params = await searchParams;
  const stone = params.stone?.trim() || "";
  const handle = params.handle?.trim() || "";
  const image = params.image?.trim() || "";
  const price = params.price ? Number(params.price) : NaN;
  const hasSelectedGem = Boolean(stone);

  return (
    <div className="section-bg">
      <WebCoverHero id="bespoke-hero" {...webCovers.bespokeJewelry} />
      <Container className="py-12 md:py-20">
        {hasSelectedGem && (
          <div className="mb-12 border border-border bg-white p-5 md:p-6">
            <p className="font-manrope text-[11px] font-semibold tracking-[0.16em] text-rich-gold uppercase">
              Selected Gemstone
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              {image && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-black">
                  <Image src={image} alt={stone} fill className="object-cover" sizes="80px" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-caslon text-xl md:text-2xl">{stone}</h2>
                {!Number.isNaN(price) && (
                  <p className="font-manrope mt-1 text-sm text-rich-gold">
                    <Price amount={price} />
                  </p>
                )}
                {handle && (
                  <Link
                    href={`/products/${handle}`}
                    className="font-manrope mt-2 inline-block text-xs text-muted underline-offset-2 hover:text-rich-gold hover:underline"
                  >
                    View gemstone details
                  </Link>
                )}
              </div>
            </div>
            <div className="mt-8">
              <CustomJewelryForm defaultStone={stone} />
            </div>
          </div>
        )}

        {!hasSelectedGem && (
          <div className="mb-12">
            <CustomJewelryForm />
          </div>
        )}

        <CategoryCardGrid categories={bespokeLandingCards} />
      </Container>

      <section className="border-y border-border bg-[#f8f8f8] py-12 md:py-14">
        <Container>
          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left md:gap-12">
            <div className="md:max-w-2xl">
              <h2 className="font-caslon text-2xl text-heading md:text-3xl">
                Have an idea in mind?
              </h2>
              <p className="font-manrope mt-2 text-sm leading-relaxed text-muted md:text-base">
                We&apos;re here to help you create a jewellery piece that&apos;s uniquely yours.
              </p>
            </div>

            <Link href="/book" className="btn-stitch-gold shrink-0 px-10 py-4">
              Book a Consultation
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
