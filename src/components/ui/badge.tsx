import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "sapphire" | "emerald" | "muted" | "outline";
  className?: string;
}

export function Badge({ children, variant = "gold", className }: BadgeProps) {
  const variants = {
    gold: "bg-gold/10 text-gold border-gold/25",
    sapphire: "bg-sapphire/10 text-sapphire border-sapphire/25",
    emerald: "bg-emerald/10 text-emerald border-emerald/25",
    muted: "bg-surface-elevated text-muted border-border",
    outline: "bg-transparent text-gold border-gold/40",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
