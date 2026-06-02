import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

const paths = [
  {
    title: "Select Your Gemstone",
    description: "Explore our exceptional natural gemstones to design your dream jewellery.",
    href: "/catalog",
  },
  {
    title: "Custom Gemstone Jewellery",
    description: "Work with us to create a one-of-a-kind piece featuring your chosen stone.",
    href: "/catalog?category=jewellery",
  },
];

export function DualCta() {
  return (
    <section className="border-b border-border bg-surface">
      <Container>
        <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group flex flex-col justify-between gap-4 px-6 py-12 transition-colors hover:text-heading md:px-10 md:py-14"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">One of a kind</p>
                <h2 className="mt-2 font-display text-2xl font-light text-heading md:text-3xl">
                  {path.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{path.description}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary transition-colors group-hover:text-gold">
                Explore
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
