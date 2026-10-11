import Image from "next/image";
import Link from "next/link";
import { images } from "@/config/images";
import { cn } from "@/lib/utils";

type LogoVariant = "color" | "white" | "black" | "jewellery";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showLink?: boolean;
  variant?: LogoVariant;
}

// Original sizes — restored to match previous behaviour for all standard logos
const sizes = {
  sm:   { width: 140, height: 42,  className: "h-7 w-auto max-w-[140px]" },
  md:   { width: 170, height: 52,  className: "h-8 w-auto max-w-[170px] md:h-9 md:max-w-[190px]" },
  lg:   { width: 210, height: 64,  className: "h-10 w-auto max-w-[210px] md:h-11 md:max-w-[240px]" },
  hero: { width: 361, height: 109, className: "h-auto w-[clamp(180px,16vw,260px)] max-w-none" },
};

/**
 * The jewellery logo is narrower (173×65 ≈ 2.66:1) than the standard logos (361×109 ≈ 3.31:1).
 * To make it render at the same visual WIDTH as the white logo, we increase its CSS height
 * so that width becomes the constraining dimension.
 *
 * White logo at h-8 (32px)   → width ≈ 32 × 3.31 = 106px
 * Jewellery logo needs 106px → height = 106 / 2.66 ≈ 40px  (h-10)
 */
const jewelleryOverride: Record<keyof typeof sizes, string> = {
  sm:   "h-8 w-auto max-w-[120px]",
  md:   "h-10 w-auto max-w-[160px] md:h-11 md:max-w-[180px]",
  lg:   "h-12 w-auto max-w-[200px] md:h-14 md:max-w-[224px]",
  hero: "h-auto w-[clamp(180px,16vw,260px)] max-w-none",
};

const logoSrc: Record<LogoVariant, string> = {
  white:     images.logoWhite,
  color:     images.logo,
  black:     images.logoBlack,
  jewellery: images.logoJewellery,
};

const logoIntrinsic: Record<LogoVariant, { w: number; h: number }> = {
  white:     { w: 361, h: 109 },
  color:     { w: 361, h: 109 },
  black:     { w: 361, h: 109 },
  jewellery: { w: 173, h: 65  },
};

export function Logo({
  className,
  size = "md",
  showLink = true,
  variant = "color",
}: LogoProps) {
  const { width, height, className: sizeClass } = sizes[size];
  const src = logoSrc[variant];
  const { w: natW, h: natH } = logoIntrinsic[variant];

  // Use the jewellery-specific class override so it renders at the same visual width
  const appliedClass = variant === "jewellery" ? jewelleryOverride[size] : sizeClass;

  const image = (
    <Image
      src={src}
      alt="ceyloe"
      width={natW}
      height={natH}
      className={cn(appliedClass, "object-contain object-left", className)}
      priority={size === "hero"}
    />
  );

  void width; void height; // layout hints only — display controlled by className

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
