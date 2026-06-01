import Image from "next/image";

interface CmsImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export function CmsImage({ src, alt, fill, className, priority }: CmsImageProps) {
  const isLocal = src.startsWith("/");

  if (isLocal) {
    return <Image src={src} alt={alt} fill={fill} className={className} priority={priority} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={fill ? `absolute inset-0 h-full w-full object-cover ${className ?? ""}` : className} />
  );
}
