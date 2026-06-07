import Link from "next/link";
import { Container } from "@/components/ui/container";

const pathways = [
  {
    title: "Fine Jewellery",
    href: "/catalog?category=jewellery",
    cta: "browse",
  },
  {
    title: "Discover Precious Gemstones",
    href: "/catalog",
    cta: "shop now",
  },
  {
    title: "Custom Made Designs",
    href: "/custom-jewelry",
    cta: "bespoke",
  },
];

export function DualCta() {
  return (
    <section className="border-b border-border bg-surface">
      <Container wide>
        <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {pathways.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group flex min-h-[140px] flex-col justify-center px-6 py-10 text-center transition-colors hover:bg-surface-elevated md:px-8 md:py-14"
            >
              <h2 className="text-lg font-medium tracking-tight text-heading md:text-xl">
                {path.title}
              </h2>
              <span className="link-arrow mt-4 justify-center text-heading">
                {path.cta} →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
