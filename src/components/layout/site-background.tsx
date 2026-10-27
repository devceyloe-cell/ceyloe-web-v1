import { images } from "@/config/images";

export function SiteBackground() {
  return (
    <div
      className="site-background-overlay pointer-events-none absolute inset-0"
      style={{ backgroundImage: `url(${images.siteBackground})` }}
      aria-hidden
    />
  );
}
