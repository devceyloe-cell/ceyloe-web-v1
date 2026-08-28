import Image from "next/image";
import { Logo } from "@/components/layout/logo";

const NAVY = "#004B69";
const GOLD = "#C09A4A";
const HERO_ART = "/images/covers/cart.webp";

/**
 * /cart hero — white cover (Your Cart), matched to designer attachment.
 */
export function CartLandingHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-white"
      aria-labelledby="cart-hero-title"
    >
      <div className="relative h-[clamp(300px,32vw,520px)] w-full">
        <div className="absolute inset-0 z-0" aria-hidden>
          <Image
            src={HERO_ART}
            alt=""
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-right"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[58%] bg-gradient-to-r from-white via-white/95 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-start px-[var(--margin-mobile)] pt-8 pb-10 md:px-[var(--margin-desktop)] md:pt-10 lg:pt-12 xl:pt-14">
          <div className="max-w-[520px] text-left lg:pl-[2%]">
            <Logo size="hero" className="!w-[clamp(160px,12vw,200px)]" />

            <h1
              id="cart-hero-title"
              className="font-bell mt-5 text-[clamp(30px,3.2vw,48px)] font-bold uppercase leading-[1.02] tracking-[0.01em] text-left lg:mt-6 xl:mt-5"
              style={{ color: GOLD }}
            >
              Your Cart
            </h1>

            <p
              className="font-poppins mt-3 max-w-[460px] text-[clamp(13px,0.9vw,15px)] font-normal leading-[1.5] text-left lg:mt-3.5"
              style={{ color: NAVY }}
            >
              Review your selected gemstones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
