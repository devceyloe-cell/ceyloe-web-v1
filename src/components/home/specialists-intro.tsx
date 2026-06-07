import { Container } from "@/components/ui/container";

export function SpecialistsIntro() {
  return (
    <section className="border-b border-border py-16 text-center md:py-20">
      <Container className="max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
          Unrivalled beauty millions of years in the making
        </p>
        <h2 className="mx-auto mt-5 text-2xl font-medium leading-snug tracking-tight text-heading sm:text-3xl md:text-4xl">
          Welcome to a leading precious gemstone collection, curated by world-class gem experts
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-relaxed text-muted md:text-base">
          Sourced from across the globe, we bring you the world&apos;s finest sapphires, rubies, emeralds and other
          precious gemstones — direct from Sri Lanka to you.
        </p>
      </Container>
    </section>
  );
}
