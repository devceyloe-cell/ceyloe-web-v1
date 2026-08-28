"use client";

const NAVY = "#004B69";
const TARGET_ID = "natural-gemstones-heading";

/**
 * Scrolls to and focuses the Natural Gemstones section heading.
 */
export function BrowseCollectionButton() {
  function handleClick() {
    const heading = document.getElementById(TARGET_ID);
    if (!heading) return;
    heading.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      heading.focus({ preventScroll: true });
    }, 350);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="font-poppins mt-5 inline-flex min-h-[44px] min-w-[220px] items-center justify-center rounded-none px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 lg:mt-6 lg:min-h-[48px] lg:min-w-[240px] xl:mt-5"
      style={{ backgroundColor: NAVY }}
    >
      Browse Collection
    </button>
  );
}
