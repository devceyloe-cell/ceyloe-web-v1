import { Gem, BadgeCheck, Sparkles, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";

const items = [
  {
    icon: Gem,
    title: "Natural Gemstones",
    description: "100% natural, ethically sourced gemstones.",
  },
  {
    icon: BadgeCheck,
    title: "Certified Stones",
    description: "Every gemstone comes with a trusted certification.",
  },
  {
    icon: Sparkles,
    title: "Bespoke Jewellery",
    description: "Custom-made jewellery crafted for you.",
  },
  {
    icon: Truck,
    title: "Australia-wide Delivery",
    description: "Secure and insured delivery across Australia.",
  },
];

export function LandingValueBar() {
  return (
    <section className="border-y border-[#e8e4dc] bg-[#faf8f5] py-14 md:py-16">
      <Container>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {items.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center text-rich-gold">
                <Icon className="h-7 w-7" strokeWidth={1.25} />
              </div>
              <h3 className="font-manrope text-[11px] font-bold uppercase tracking-[0.16em] text-heading">
                {title}
              </h3>
              <p className="font-manrope mx-auto mt-3 max-w-[200px] text-sm leading-relaxed text-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
