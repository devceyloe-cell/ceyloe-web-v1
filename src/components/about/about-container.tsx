import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

interface AboutContainerProps {
  children: React.ReactNode;
  className?: string;
}

/** About-page content width capped at 1280px for denser luxury layouts. */
export function AboutContainer({ children, className }: AboutContainerProps) {
  return <Container className={cn("max-w-[1280px]", className)}>{children}</Container>;
}
