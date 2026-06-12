import { images } from "@/config/images";

export function SiteBackground() {
  return (
    <div
      className="site-background-overlay pointer-events-none fixed inset-0 z-30"
      style={{ backgroundImage: `url(${images.siteBackground})` }}
      aria-hidden
    />
  );
}
