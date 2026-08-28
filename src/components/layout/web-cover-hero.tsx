import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { COVER_GOLD, type WebCoverContent } from "@/config/web-covers";

type WebCoverHeroProps = WebCoverContent & {
  id?: string;
  className?: string;
  compact?: boolean;
};

export function WebCoverHero({
  id,
  image,
  eyebrow,
  title,
  titleLines,
  lead,
  description,
  tagline,
  primaryCta,
  secondaryCta,
  tone = "dark",
  imagePosition = "center",
  className,
  compact,
}: WebCoverHeroProps) {
  const useLightPanel = tone === "light";
  const lines = titleLines?.length ? titleLines : title ? [title] : [];

  return (
    <section
      id={id}
      className={cn(
        "relative isolate",
        compact ? "min-h-[320px] md:min-h-[420px]" : "min-h-0 md:min-h-[560px] lg:min-h-[720px]",
        className,
      )}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: imagePosition }}
      />

      <div
        className={cn(
          "absolute inset-0",
          useLightPanel
            ? "bg-gradient-to-r from-white/95 via-white/80 to-white/20"
            : "bg-gradient-to-r from-black/85 via-black/55 to-black/15",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "absolute inset-0",
          useLightPanel
            ? "bg-gradient-to-t from-white/40 via-transparent to-transparent"
            : "bg-gradient-to-t from-black/40 via-transparent to-black/20",
        )}
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-center px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]",
          compact ? "py-12 md:py-14" : "py-14 md:py-16 lg:py-20",
        )}
      >
        <div className="max-w-xl">
          {eyebrow && (
            <p
              className={cn(
                "font-poppins text-[10px] font-normal tracking-[0.28em] uppercase sm:text-[11px]",
                useLightPanel ? "text-[#0e4a57]/80" : "text-white/80",
              )}
            >
              {eyebrow}
            </p>
          )}

          {lines.length > 0 && (
            <h1
              id={id ? `${id}-title` : undefined}
              className={cn(
                "font-bell font-bold uppercase leading-[1.08] tracking-[0.02em]",
                eyebrow ? "mt-3" : "mt-0",
                compact
                  ? "text-3xl sm:text-4xl md:text-5xl"
                  : "text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem]",
              )}
              style={{ color: useLightPanel ? COVER_GOLD : COVER_GOLD }}
            >
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          )}

          {lead && (
            <p
              className={cn(
                "font-poppins mt-4 text-[15px] leading-[1.5] font-normal sm:text-[16px]",
                useLightPanel ? "text-heading" : "text-white/95",
              )}
            >
              {lead}
            </p>
          )}

          {description && (
            <p
              className={cn(
                "font-poppins max-w-md text-[14px] leading-[1.7] font-normal sm:text-[15px]",
                lead ? "mt-3" : eyebrow || lines.length ? "mt-4" : "mt-0",
                useLightPanel ? "text-muted" : "text-white/90",
              )}
            >
              {description}
            </p>
          )}

          {tagline && (
            <p
              className={cn(
                "font-poppins mt-3 text-[13px] font-normal tracking-[0.06em] sm:text-sm",
                useLightPanel ? "text-muted" : "text-white/75",
              )}
            >
              {tagline}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {primaryCta && (
                <CoverCta href={primaryCta.href} variant="primary" external={primaryCta.external}>
                  {primaryCta.label}
                </CoverCta>
              )}
              {secondaryCta && (
                <CoverCta
                  href={secondaryCta.href}
                  variant="secondary"
                  lightPanel={useLightPanel}
                  external={secondaryCta.external}
                >
                  {secondaryCta.label}
                </CoverCta>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CoverCta({
  href,
  children,
  variant,
  lightPanel,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant: "primary" | "secondary";
  lightPanel?: boolean;
  external?: boolean;
}) {
  const className = cn(
    "font-poppins inline-flex min-h-12 items-center justify-center px-7 text-[11px] font-bold tracking-[0.14em] uppercase transition-colors",
    variant === "primary" &&
      "bg-[#C09A4A] text-white hover:bg-[#d0ab5c]",
    variant === "secondary" &&
      (lightPanel
        ? "border border-[#0e4a57] text-[#0e4a57] hover:bg-[#0e4a57] hover:text-white"
        : "border border-white/40 text-white hover:bg-white hover:text-black"),
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
