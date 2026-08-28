import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
  id?: string;
}

export function Container({ children, className, as: Tag = "div", id }: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full max-w-[1440px] px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
