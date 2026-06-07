import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "emerald";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-primary text-white hover:bg-[#222222] font-medium uppercase tracking-[0.1em]",
  secondary:
    "bg-surface-elevated text-heading hover:bg-border border border-border font-medium uppercase tracking-[0.08em]",
  ghost: "text-foreground hover:opacity-70 font-medium",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-white font-medium uppercase tracking-[0.08em]",
  emerald:
    "bg-primary text-white hover:bg-[#222222] font-medium uppercase tracking-[0.1em]",
};

const sizes = {
  sm: "px-4 py-2 text-[11px]",
  md: "px-6 py-3 text-xs",
  lg: "px-8 py-4 text-xs",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
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
