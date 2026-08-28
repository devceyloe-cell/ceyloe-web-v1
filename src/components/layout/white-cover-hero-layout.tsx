import Image from "next/image";
import { cn } from "@/lib/utils";

type WhiteCoverHeroLayoutProps = {
  image: string;
  ariaLabelledBy?: string;
  /** Full-width 1920×800 heroes (home, gemstones). Others use fixed desktop height. */
  variant?: "wide" | "standard";
  /** How the artwork is fitted on desktop. */
  imageFit?: "contain" | "cover";
  children: React.ReactNode;
};

/**
 * Shared white-cover hero shell.
 * Artwork is sticky and sits behind text on all breakpoints.
 */
export function WhiteCoverHeroLayout({
  image,
  ariaLabelledBy,
  variant = "standard",
  imageFit = "cover",
  children,
}: WhiteCoverHeroLayoutProps) {
  const isWide = variant === "wide";
  const fitContain = imageFit === "contain";

  return (
    <section
      className="relative isolate bg-white"
      aria-labelledby={ariaLabelledBy}
    >
      <div
        className={cn(
          "relative mx-auto w-full max-w-[1440px] overflow-hidden",
          isWide
            ? "min-h-[clamp(420px,42vw,667px)]"
            : "min-h-[clamp(300px,32vw,520px)]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
        >
          <div
            className={cn(
              "sticky top-0 w-full",
              isWide
                ? "h-[clamp(280px,50vw,667px)]"
                : "h-[clamp(260px,42vw,520px)]",
            )}
          >
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt=""
                fill
                priority
                quality={95}
                sizes="100vw"
                className={cn(
                  fitContain ? "object-contain object-right" : "object-cover object-right",
                )}
              />
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[72%] bg-gradient-to-r from-white via-white/95 to-transparent md:w-[58%]"
          aria-hidden
        />

        <div className="relative z-10 px-[var(--margin-mobile)] pb-10 pt-2 md:px-[var(--margin-desktop)] md:pb-12 md:pt-10 lg:pt-12 xl:pt-14">
          <div className="max-w-[520px] text-left lg:pl-[2%]">{children}</div>
        </div>
      </div>
    </section>
  );
}
