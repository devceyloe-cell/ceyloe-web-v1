import { Badge } from "@/components/ui/badge";
import type { GemstoneSpec } from "@/types";

interface ProductSpecsProps {
  specs: GemstoneSpec;
}

const specLabels: Partial<Record<keyof GemstoneSpec, string>> = {
  carat: "Carat Weight",
  color: "Color",
  clarity: "Clarity",
  cut: "Cut",
  shape: "Shape",
  origin: "Origin",
  treatment: "Treatment",
  certification: "Certification",
  certificateNumber: "Certificate No.",
};

const hiddenKeys = new Set<keyof GemstoneSpec>(["caratWeight"]);

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = (Object.entries(specs) as [keyof GemstoneSpec, string | number | undefined][])
    .filter(([key, value]) => value && !hiddenKeys.has(key) && specLabels[key]);

  return (
    <div className="border border-border">
      <div className="border-b border-border bg-surface-elevated px-6 py-4">
        <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
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
