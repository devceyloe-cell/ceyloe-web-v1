import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_PATH = "/images/Home/imgi_1_ceyloe.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLink?: boolean;
}

const sizes = {
  sm: { width: 100, height: 32, className: "h-7 w-auto" },
  md: { width: 130, height: 42, className: "h-9 w-auto md:h-10" },
  lg: { width: 160, height: 52, className: "h-12 w-auto" },
};

export function Logo({ className, size = "md", showLink = true }: LogoProps) {
  const { width, height, className: sizeClass } = sizes[size];

  const image = (
    <Image
      src={LOGO_PATH}
      alt="Ceyloe — Fine Gemstones"
      width={width}
      height={height}
      className={cn(sizeClass, "logo-gold object-contain", className)}
      priority
    />
  );

  if (!showLink) return image;

  return (
    <Link href="/" className="inline-flex shrink-0 items-center transition-opacity hover:opacity-80">
      {image}
    </Link>
  );
}

export { LOGO_PATH };
