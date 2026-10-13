import Image from "next/image";
import { cn } from "@/lib/utils";

type WhiteCoverHeroLayoutProps = {
  image: string;
  ariaLabelledBy?: string;
  /** Full-width 1920×800 heroes (home, gemstones). Others use fixed desktop height. */
  variant?: "wide" | "standard";
  /** Darken the artwork with a black overlay (homepage). */
  overlay?: "black" | "none";
  children: React.ReactNode;
};

/**
 * Shared white-cover hero shell.
 * Artwork spans full screen width; text stays in the content column.
 */
export function WhiteCoverHeroLayout({
  image,
  ariaLabelledBy,
  variant = "standard",
  overlay = "none",
  children,
}: WhiteCoverHeroLayoutProps) {
  const isWide = variant === "wide";

  return (
    <section
      className="relative isolate w-full bg-white"
      aria-labelledby={ariaLabelledBy}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          isWide
            ? "min-h-[clamp(340px,calc(100vw*600/1920),560px)] lg:aspect-[1920/600] lg:min-h-0"
            : "min-h-[clamp(260px,calc(100vw*600/1920),440px)]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <div className="sticky top-0 h-full w-full">
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt=""
                fill
                priority
                quality={95}
                sizes="100vw"
                className="h-full w-full object-cover object-center"
              />
              {overlay === "black" ? (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-[1] w-[60%] md:w-[45%]",
            overlay === "black"
              ? "bg-gradient-to-r from-black/70 via-black/25 to-transparent"
              : "bg-gradient-to-r from-white via-white/85 to-transparent",
          )}
          aria-hidden
        />

        <div
          className={cn(
            "relative z-10 mx-auto w-full max-w-[1440px] px-[var(--margin-mobile)] pb-8 pt-2 md:px-[var(--margin-desktop)] md:pb-8 md:pt-8 lg:pt-10 xl:pt-11",
            isWide &&
              "lg:absolute lg:inset-x-0 lg:top-0 lg:mx-auto lg:flex lg:items-start lg:pb-0",
            !isWide && "md:pb-10",
          )}
        >
          <div className="max-w-[520px] text-left lg:pl-[2%]">{children}</div>
        </div>
      </div>
    </section>
  );
}
