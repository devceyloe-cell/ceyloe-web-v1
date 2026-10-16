import { Logo } from "@/components/layout/logo";
import { WhiteCoverHeroLayout } from "@/components/layout/white-cover-hero-layout";

const NAVY = "#004B69";
const GOLD = "#C09A4A";
const HERO_ART = "/images/covers/cart.webp";

export function CartLandingHero({ imageOverride }: { imageOverride?: string }) {
  return (
    <WhiteCoverHeroLayout image={imageOverride || HERO_ART} ariaLabelledBy="cart-hero-title">
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
    </WhiteCoverHeroLayout>
  );
}
