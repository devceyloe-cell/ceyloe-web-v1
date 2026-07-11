import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}

export function ImageCard({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 60vw",
}: ImageCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-black/20 shadow-[0_18px_50px_rgba(0,0,0,0.28)]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={cn("object-cover", imageClassName)}
        sizes={sizes}
      />
    </div>
  );
}
