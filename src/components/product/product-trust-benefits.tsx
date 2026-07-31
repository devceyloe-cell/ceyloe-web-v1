import { Gem, Heart, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { productTrustBenefits } from "@/data/product-detail-content";

const iconMap: Record<(typeof productTrustBenefits)[number]["icon"], LucideIcon> = {
  gem: Gem,
  truck: Truck,
  shield: ShieldCheck,
  heart: Heart,
};

export function ProductTrustBenefits() {
  return (
    <section className="border-y border-[#E8E2D8] bg-[#FAF8F5]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-[var(--margin-mobile)] py-8 md:grid-cols-4 md:gap-4 md:px-[var(--margin-desktop)] md:py-10">
        {productTrustBenefits.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={item.id} className="flex flex-col items-center text-center">
              <Icon className="h-6 w-6 text-rich-gold" strokeWidth={1.35} aria-hidden />
              <h3 className="font-manrope mt-3 text-[11px] font-bold tracking-[0.14em] text-[#1a1a1a] uppercase">
                {item.title}
              </h3>
              <p className="font-manrope mt-1 text-[12px] text-[#666666]">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
