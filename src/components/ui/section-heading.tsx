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
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-medium tracking-tight text-heading sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 max-w-2xl font-light text-muted", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
