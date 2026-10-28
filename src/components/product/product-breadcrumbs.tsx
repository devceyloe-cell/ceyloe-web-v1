import Link from "next/link";
import { getSubcategoryLabel } from "@/config/product-subcategories";
import { getCategoryHref, getCategoryLabel } from "@/lib/product-detail";

interface ProductBreadcrumbsProps {
  title: string;
  category: string;
  subcategory?: string;
}

export function ProductBreadcrumbs({
  title,
  category,
  subcategory,
}: ProductBreadcrumbsProps) {
  const subcategoryLabel = getSubcategoryLabel(category, subcategory);

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
        {subcategory && subcategoryLabel ? (
          <>
            <li aria-hidden className="text-border">
              /
            </li>
            <li>
              <Link
                href={getCategoryHref(category, subcategory)}
                className="transition-colors hover:text-rich-gold"
              >
                {subcategoryLabel}
              </Link>
            </li>
          </>
        ) : null}
        <li aria-hidden className="text-border">
          /
        </li>
        <li className="text-rich-gold">{title}</li>
      </ol>
    </nav>
  );
}
