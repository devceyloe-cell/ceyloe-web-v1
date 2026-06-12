import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "btn-stitch-primary",
  secondary:
    "border border-deep-navy bg-transparent text-deep-navy font-manrope text-sm font-semibold uppercase tracking-wider px-8 py-4 hover:bg-deep-navy hover:text-white transition-colors",
  ghost: "link-stitch text-rich-gold hover:text-deep-navy bg-transparent px-0 py-0",
  outline:
    "border border-pale-gold text-pale-gold font-manrope text-xs font-bold uppercase tracking-widest px-8 py-3 hover:bg-pale-gold hover:text-deep-navy transition-all",
  gold: "btn-stitch-gold",
};

const sizes = {
  sm: "px-6 py-3 text-xs",
  md: "px-8 py-4 text-sm",
  lg: "px-10 py-5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        variant !== "ghost" && sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";
