import Link from "next/link";

const NAVY = "#004B69";

/**
 * /gemstones hero CTA — opens the full gemstone catalog.
 */
export function BrowseCollectionButton() {
  return (
    <Link
      href="/catalog"
      className="font-poppins mt-5 inline-flex min-h-[44px] min-w-[220px] items-center justify-center rounded-none px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 lg:mt-6 lg:min-h-[48px] lg:min-w-[240px] xl:mt-5"
      style={{ backgroundColor: NAVY }}
    >
      Browse Collection
    </Link>
  );
}
