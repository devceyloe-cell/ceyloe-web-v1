import { Badge } from "@/components/ui/badge";
import type { GemstoneSpec } from "@/types";

interface ProductSpecsProps {
  specs: GemstoneSpec;
}

const specLabels: Record<keyof GemstoneSpec, string> = {
  carat: "Carat Weight",
  color: "Color",
  clarity: "Clarity",
  cut: "Cut",
  origin: "Origin",
  treatment: "Treatment",
  certification: "Certification",
};

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs).filter(([, value]) => value) as [
    keyof GemstoneSpec,
    string,
  ][];

  return (
    <div className="border border-border">
      <div className="border-b border-border bg-surface px-6 py-4">
        <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
          Gemstone Specifications
        </h3>
      </div>
      <dl className="divide-y divide-border">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between px-6 py-4">
            <dt className="text-sm text-muted">{specLabels[key]}</dt>
            <dd className="text-sm font-medium text-foreground">
              {key === "certification" ? (
                <Badge variant="sapphire">{value}</Badge>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
