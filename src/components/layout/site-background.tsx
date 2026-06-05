import { siteBackground } from "@/config/site-background";

export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-white">
      <div
        className="site-bg-texture absolute inset-0"
        style={{ opacity: siteBackground.opacity }}
      />
    </div>
  );
}
