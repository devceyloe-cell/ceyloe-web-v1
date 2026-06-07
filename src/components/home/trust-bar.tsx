import { Container } from "@/components/ui/container";

interface TrustItem {
  title: string;
  description: string;
}

interface TrustBarProps {
  items: TrustItem[];
}

export function TrustBar({ items }: TrustBarProps) {
  return (
    <section className="border-t border-border bg-surface py-12">
      <Container>
        <div className="grid gap-10 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-heading">
                {item.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-xs font-light leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
