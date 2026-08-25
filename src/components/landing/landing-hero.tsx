import { WebCoverHero } from "@/components/layout/web-cover-hero";
import { webCovers } from "@/config/web-covers";

export function LandingHero() {
  return <WebCoverHero id="home-hero" {...webCovers.home} />;
}
