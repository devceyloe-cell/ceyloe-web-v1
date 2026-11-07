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
    <nav aria-label="Breadcrumb" className="mb-5 min-w-0 md:mb-8">
      <ol className="font-manrope flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] tracking-[0.04em] text-muted sm:gap-x-2 sm:text-[11px]">
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
        <li className="min-w-0 max-w-full truncate text-rich-gold" title={title}>
          {title}
        </li>
      </ol>
    </nav>
  );
}
