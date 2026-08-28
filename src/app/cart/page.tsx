import { CartContent } from "@/components/cart/cart-content";
import { CartLandingHero } from "@/components/cart/cart-landing-hero";

export default function CartPage() {
  return (
    <div className="bg-white">
      <CartLandingHero />
      <CartContent />
    </div>
  );
}
