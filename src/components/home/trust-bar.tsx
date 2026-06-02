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
    <section className="border-t border-border bg-surface-elevated py-10">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item.title} className="text-center lg:text-left">
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-heading">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
