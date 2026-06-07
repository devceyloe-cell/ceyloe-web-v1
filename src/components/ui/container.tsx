import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
  wide?: boolean;
}

export function Container({ children, className, as: Tag = "div", wide = false }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        wide ? "max-w-[1420px]" : "max-w-[1200px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
