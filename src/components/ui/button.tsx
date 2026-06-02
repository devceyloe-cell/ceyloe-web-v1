import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "emerald";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-primary text-white hover:bg-gold hover:text-brand-navy font-normal tracking-wide",
  secondary:
    "bg-surface-elevated text-heading hover:bg-gold/10 border border-border hover:border-gold/40",
  ghost: "text-foreground hover:text-gold hover:bg-surface-elevated",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-white",
  emerald:
    "bg-emerald text-white hover:bg-gold hover:text-brand-navy font-normal tracking-wide",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";
