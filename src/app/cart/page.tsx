import { CartContent } from "@/components/cart/cart-content";
import { WebCoverHero } from "@/components/layout/web-cover-hero";
import { webCovers } from "@/config/web-covers";

export default function CartPage() {
  return (
    <div className="section-bg">
      <WebCoverHero id="cart-hero" {...webCovers.cart} compact />
      <CartContent />
    </div>
  );
}
