import Link from "next/link";
import { cn } from "@/lib/utils";

interface AboutButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const buttonBase =
  "inline-flex h-12 w-[200px] items-center justify-center font-manrope text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]";

export function PrimaryButton({ href, children, className }: AboutButtonProps) {
  return (
    <Link
      href={href}
      className={cn(buttonBase, "bg-[#C89B3C] text-white hover:bg-[#B8872F]", className)}
    >
      {children}
    </Link>
  );
}

export function SecondaryButton({ href, children, className }: AboutButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonBase,
        "border border-[#C89B3C] text-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#080808]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
