import {
  Clock,
  Eye,
  Gem,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { buildWhyThisGemstone, productShippingPoints } from "@/data/product-detail-content";
import type { Product } from "@/types";

const whyIconMap: Record<string, LucideIcon> = {
  gem: Gem,
  eye: Eye,
  sparkles: Sparkles,
  clock: Clock,
};

const shippingIcons: LucideIcon[] = [Truck, ShieldCheck, Package, MapPin];

interface ProductHighlightsProps {
  product: Product;
}

export function ProductHighlights({ product }: ProductHighlightsProps) {
  const whyItems = buildWhyThisGemstone({
    color: product.specs.color,
    clarity: product.specs.clarity,
    shape: product.specs.shape ?? product.specs.cut,
    category: product.category,
  });

  return (
    <section className="bg-[#FAF8F5] px-[var(--margin-mobile)] py-12 md:px-[var(--margin-desktop)] md:py-14">
      <div className="mx-auto grid max-w-[1280px] gap-6 md:grid-cols-2 lg:gap-8">
        <div className="border border-[#E8E2D8] bg-white p-6 md:p-8">
          <h2 className="font-caslon text-[24px] text-[#1a1a1a] md:text-[26px]">
            Why This Gemstone?
          </h2>
          <ul className="mt-6 space-y-5">
            {whyItems.map((item) => {
              const Icon = whyIconMap[item.icon] ?? Gem;
              return (
                <li key={item.id} className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-rich-gold" strokeWidth={1.35} />
                  <div>
                    <h3 className="font-manrope text-[13px] font-semibold text-[#1a1a1a]">
                      {item.title}
                    </h3>
                    <p className="font-manrope mt-1 text-[13px] leading-relaxed text-[#666666]">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border border-[#E8E2D8] bg-white p-6 md:p-8">
          <h2 className="font-caslon text-[24px] text-[#1a1a1a] md:text-[26px]">
            Shipping & Delivery
          </h2>
          <ul className="mt-6 space-y-4">
            {productShippingPoints.map((point, index) => {
              const Icon = shippingIcons[index] ?? ShieldCheck;
              return (
                <li key={point} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-rich-gold" strokeWidth={1.35} />
                  <span className="font-manrope text-[13px] leading-relaxed text-[#444444]">
                    {point}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
