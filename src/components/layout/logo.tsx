import Image from "next/image";
import Link from "next/link";
import { images } from "@/config/images";
import { cn } from "@/lib/utils";

type LogoVariant = "color" | "white";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showLink?: boolean;
  variant?: LogoVariant;
}

const sizes = {
  sm: { width: 140, height: 42, className: "h-7 w-auto max-w-[140px]" },
  md: { width: 170, height: 52, className: "h-8 w-auto max-w-[170px] md:h-9 md:max-w-[190px]" },
  lg: { width: 210, height: 64, className: "h-10 w-auto max-w-[210px] md:h-11 md:max-w-[240px]" },
  hero: {
    width: 361,
    height: 109,
    className: "h-auto w-[clamp(180px,16vw,260px)] max-w-none",
  },
};

export function Logo({
  className,
  size = "md",
  showLink = true,
  variant = "color",
}: LogoProps) {
  const { width, height, className: sizeClass } = sizes[size];
  const src = variant === "white" ? images.logoWhite : images.logo;

  const image = (
    <Image
      src={src}
      alt="ceyloe"
      width={width}
      height={height}
      className={cn(sizeClass, "object-contain object-left", className)}
      priority={size === "hero" || size === "md"}
      unoptimized
    />
  );

  if (!showLink) {
    return <span className="inline-flex shrink-0 items-center">{image}</span>;
  }

  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center overflow-visible transition-opacity hover:opacity-90"
    >
      {image}
    </Link>
  );
}
