import Image from "next/image";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
const points = [
  "Direct access to Sri Lankan sources",
  "Hand-selected quality gemstones",
  "Natural certified stones",
  "Bespoke jewellery design",
  "Australia-wide delivery",
  "Private appointments",
];

export function LandingQuality() {
  return (
    <section className="bg-[#faf8f5] py-10 md:py-12">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.28em] text-rich-gold">
              Why Choose Ceyloe
            </p>
            <h2 className="font-caslon mt-3 text-2xl font-normal leading-tight text-heading md:text-3xl">
              Quality. Trust. <span className="italic text-rich-gold">Expertise.</span>
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
              {points.map((point) => (
                <div key={point} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-rich-gold">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <p className="font-manrope text-xs leading-relaxed text-muted md:text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden bg-stone-gray lg:max-w-none lg:aspect-[5/4]">
            <Image
              src="/images/bespoke/book-consultation.jpg"
              alt="Book a private gemstone consultation with Ceyloe"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
