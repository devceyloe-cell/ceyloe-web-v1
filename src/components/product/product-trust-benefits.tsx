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
      <div className="mx-auto grid w-full min-w-0 max-w-[1280px] grid-cols-2 gap-4 px-4 py-7 sm:gap-6 sm:px-[var(--margin-mobile)] sm:py-8 md:grid-cols-4 md:gap-4 md:px-[var(--margin-desktop)] md:py-10">
        {productTrustBenefits.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div key={item.id} className="flex min-w-0 flex-col items-center text-center">
              <Icon className="h-5 w-5 text-rich-gold sm:h-6 sm:w-6" strokeWidth={1.35} aria-hidden />
              <h3 className="font-manrope mt-2 break-words text-[10px] font-bold tracking-[0.12em] text-[#1a1a1a] uppercase sm:mt-3 sm:text-[11px] sm:tracking-[0.14em]">
                {item.title}
              </h3>
              <p className="font-manrope mt-1 text-[11px] text-[#666666] sm:text-[12px]">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
