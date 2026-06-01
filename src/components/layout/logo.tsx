import Image from "next/image";
import Link from "next/link";
import { images } from "@/config/images";
import { cn } from "@/lib/utils";

const LOGO_PATH = images.logo;

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLink?: boolean;
}

const sizes = {
  sm: { width: 120, height: 40, className: "h-8 w-auto" },
  md: { width: 150, height: 48, className: "h-10 w-auto md:h-11" },
  lg: { width: 180, height: 58, className: "h-12 w-auto md:h-14" },
};

export function Logo({ className, size = "md", showLink = true }: LogoProps) {
  const { width, height, className: sizeClass } = sizes[size];

  const image = (
    <Image
      src={LOGO_PATH}
      alt="Ceyloe — Fine Gemstones"
      width={width}
      height={height}
      className={cn(sizeClass, "object-contain", className)}
      priority={size !== "lg"}
      unoptimized
    />
  );

  if (!showLink) {
    return <span className="inline-flex shrink-0 items-center">{image}</span>;
  }

  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90"
    >
      {image}
    </Link>
  );
}

export { LOGO_PATH };
