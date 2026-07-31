import Link from "next/link";
import { getCategoryHref, getCategoryLabel } from "@/lib/product-detail";

interface ProductBreadcrumbsProps {
  title: string;
  category: string;
}

export function ProductBreadcrumbs({ title, category }: ProductBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
      <ol className="font-manrope flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-[0.04em] text-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-rich-gold">
            Home
          </Link>
        </li>
        <li aria-hidden className="text-border">
          /
        </li>
        <li>
          <Link href="/gemstones" className="transition-colors hover:text-rich-gold">
            Gemstones
          </Link>
        </li>
        <li aria-hidden className="text-border">
          /
        </li>
        <li>
          <Link
            href={getCategoryHref(category)}
            className="transition-colors hover:text-rich-gold"
          >
            {getCategoryLabel(category)}
          </Link>
        </li>
        <li aria-hidden className="text-border">
          /
        </li>
        <li className="text-rich-gold">{title}</li>
      </ol>
    </nav>
  );
}
