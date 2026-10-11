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

/**
 * Fixed-width, fixed-height boxes with object-contain + object-left.
 * The height must be tall enough so WIDTH is always the constraining dimension —
 * that way all logo variants render at the same visual width regardless of their
 * source aspect ratio.
 *
 * Formula: box height >= boxWidth / narrowestAspectRatio
 * Narrowest logo: jewellery (173×65 ≈ 2.66:1)
 * md example: 140px / 2.66 ≈ 53px → use h-14 (56px) so width always constrains.
 */
const sizes = {
  sm:   { w: 120, h: 46,  className: "w-[120px] h-[46px]" },
  md:   { w: 140, h: 54,  className: "w-[140px] h-[54px] md:w-[158px] md:h-[60px]" },
  lg:   { w: 175, h: 66,  className: "w-[175px] h-[66px] md:w-[200px] md:h-[76px]" },
  hero: { w: 361, h: 109, className: "w-[clamp(180px,16vw,260px)] h-auto" },
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
  const { w, h, className: sizeClass } = sizes[size];
  const src = logoSrc[variant];
  const { w: natW, h: natH } = logoIntrinsic[variant];

  const image = (
    <Image
      src={src}
      alt="ceyloe"
      width={natW}
      height={natH}
      className={cn(sizeClass, "object-contain object-left", className)}
      priority={size === "hero"}
    />
  );

  void w; void h; // used via className only

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
