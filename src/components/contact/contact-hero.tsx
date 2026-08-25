import { WebCoverHero } from "@/components/layout/web-cover-hero";
import { webCovers } from "@/config/web-covers";

export function ContactHero() {
  return <WebCoverHero id="contact-hero" {...webCovers.contact} />;
}
