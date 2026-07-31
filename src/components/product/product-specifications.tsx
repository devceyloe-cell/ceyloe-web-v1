import type { ProductSpecification } from "@/data/product-detail-content";

interface ProductSpecificationsProps {
  specifications: ProductSpecification[];
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  if (specifications.length === 0) return null;

  return (
    <dl className="mt-5 border-t border-border">
      {specifications.map((spec) => (
        <div
          key={spec.label}
          className="font-manrope flex items-center justify-between gap-4 border-b border-border py-2 text-[13px]"
        >
          <dt className="shrink-0 text-muted">{spec.label}</dt>
          <dd className="text-right font-medium text-foreground">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
