import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-light tracking-tight text-heading sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 max-w-2xl text-muted sm:text-base", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
