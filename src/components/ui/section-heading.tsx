import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  italicHighlight?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  italicHighlight,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-12 md:mb-16", align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="subheading-caps mb-4 tracking-[0.2em] text-rich-gold">{eyebrow}</p>
      )}
      <h2 className="font-caslon text-3xl md:text-4xl lg:text-5xl">
        {title}
        {italicHighlight && <span className="italic"> {italicHighlight}</span>}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-6 max-w-2xl text-on-surface-variant",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
