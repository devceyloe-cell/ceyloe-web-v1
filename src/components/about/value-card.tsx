import { Gem, Leaf, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ValueIconName = "quality" | "trust" | "ethical" | "craftsmanship";

interface ValueCardProps {
  title: string;
  description: string;
  icon: ValueIconName;
  className?: string;
  showDivider?: boolean;
}

const valueIcons: Record<ValueIconName, LucideIcon> = {
  quality: Gem,
  trust: ShieldCheck,
  ethical: Leaf,
  craftsmanship: Sparkles,
};

export function ValueCard({
  title,
  description,
  icon,
  className,
  showDivider = false,
}: ValueCardProps) {
  const Icon = valueIcons[icon];

  return (
    <div
      className={cn(
        "relative flex h-full flex-col items-center px-5 py-3 text-center",
        showDivider && "xl:border-l xl:border-[#C89B3C]/50",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center text-[#C89B3C]">
        <Icon className="h-9 w-9" strokeWidth={1.25} aria-hidden />
      </div>
      <h3 className="font-caslon mt-4 text-[20px] leading-tight !text-[#C89B3C] md:text-[22px]">
        {title}
      </h3>
      <p className="font-manrope mt-2.5 max-w-[190px] text-[13px] leading-[1.55] !text-white/88">
        {description}
      </p>
    </div>
  );
}
