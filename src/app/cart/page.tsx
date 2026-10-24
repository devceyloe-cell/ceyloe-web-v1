import { CartContent } from "@/components/cart/cart-content";
import { CartLandingHero } from "@/components/cart/cart-landing-hero";
import { getHeroImages } from "@/lib/mongodb/hero-images";

export default async function CartPage() {
  const heroImages = await getHeroImages();
  return (
    <div className="bg-white">
      <CartLandingHero contentOverride={heroImages.cart} />
      <CartContent />
    </div>
  );
}
