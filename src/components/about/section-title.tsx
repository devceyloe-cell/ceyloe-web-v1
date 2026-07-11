import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  as?: "h1" | "h2";
  id?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  titleClassName?: string;
  subtitle?: string;
}

export function SectionTitle({
  title,
  as: Tag = "h2",
  id,
  align = "left",
  tone = "dark",
  className,
  titleClassName,
  subtitle,
}: SectionTitleProps) {
  const isLight = tone === "light";

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Tag
        id={id}
        className={cn(
          "font-caslon text-[32px] font-normal leading-[1.15] tracking-tight md:text-[36px]",
          isLight ? "!text-white" : "text-[#222222]",
          titleClassName,
        )}
      >
        {title}
      </Tag>
      <div
        className={cn("mt-2.5 h-px w-10 bg-[#C89B3C]", align === "center" && "mx-auto")}
        aria-hidden
      />
      {subtitle && (
        <p
          className={cn(
            "font-manrope mt-3 max-w-lg text-[14px] leading-[1.5]",
            isLight ? "text-white/85" : "text-[#555555]",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
