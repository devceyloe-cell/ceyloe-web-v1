import { Container } from "@/components/ui/container";

export function SpecialistsIntro() {
  return (
    <section className="py-16 text-center md:py-20">
      <Container>
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          We are specialists in natural gemstones
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-light leading-snug tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Explore our exceptional gemstones to design your dream jewellery
        </h2>
      </Container>
    </section>
  );
}
