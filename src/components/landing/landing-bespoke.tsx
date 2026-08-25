import { WebCoverHero } from "@/components/layout/web-cover-hero";
import { webCovers } from "@/config/web-covers";

export function LandingBespoke() {
  return (
    <section className="bg-[#141414]">
      <WebCoverHero id="landing-bespoke-cover" {...webCovers.bespokeJewelry} compact />
    </section>
  );
}
