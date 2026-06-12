import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { stitchImages } from "@/config/stitch-images";
import type { Product } from "@/types";

interface StitchFeaturedProductsProps {
  products: Product[];
}

const fallback = [
  { title: "2.77ct Ruby Ring", image: stitchImages.productRuby, price: 19600 },
  { title: "3.02ct Tsavorite Garnet Ring", image: stitchImages.productTsavorite, price: 18400 },
  { title: "5.19ct Blue Sapphire Ring", image: stitchImages.productSapphire, price: 38000 },
];

export function StitchFeaturedProducts({ products }: StitchFeaturedProductsProps) {
  const items =
    products.length >= 3
      ? products.slice(0, 3).map((p) => ({
          title: p.title,
          image: p.image,
          price: p.price,
          href: `/products/${p.handle}`,
        }))
      : fallback.map((p, i) => ({
          ...p,
          href: products[i] ? `/products/${products[i].handle}` : "/catalog",
        }));

  return (
    <section className="bg-stone-gray py-[var(--section-padding)]">
      <Container>
        <div className="mb-20 text-center">
          <p className="subheading-caps mb-4 tracking-[0.2em] text-rich-gold">Fine Jewellery</p>
          <h2 className="font-caslon text-4xl md:text-5xl">
            Exclusive <span className="italic">Designs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-[var(--gutter)] md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="group">
              <Link href={item.href}>
                <div className="mb-8 aspect-[2/3] overflow-hidden bg-white transition-transform duration-500 group-hover:-translate-y-2">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-caslon text-2xl">{item.title}</h3>
                  <div className="gold-divider my-3" />
                  <p className="label-caps text-on-surface-variant">
                    <Price amount={item.price} />
                  </p>
                </div>
              </Link>
              <Link
                href={item.href}
                className="btn-stitch-primary mt-6 block w-full text-center"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
