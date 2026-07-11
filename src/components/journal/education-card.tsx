import {
  BadgeCheck,
  Calendar,
  Flame,
  Gem,
  HelpCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { EducationIconName, EducationTopic } from "@/data/education-content";
import { cn } from "@/lib/utils";

const iconMap: Record<EducationIconName, LucideIcon> = {
  gem: Gem,
  flame: Flame,
  badge: BadgeCheck,
  calendar: Calendar,
  sparkles: Sparkles,
  help: HelpCircle,
};

interface EducationCardProps {
  topic: EducationTopic;
  className?: string;
}

export function EducationCard({ topic, className }: EducationCardProps) {
  const Icon = iconMap[topic.icon];

  return (
    <Link
      href={topic.href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-transform duration-500 hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1a1a]">
        <Image
          src={topic.image}
          alt={topic.imageAlt}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="relative flex flex-1 flex-col items-center px-6 pt-10 pb-7 text-center">
        <div className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-[#C89B3C] bg-[#141414] shadow-md">
          <Icon className="h-6 w-6 text-[#C89B3C]" strokeWidth={1.35} aria-hidden />
        </div>

        <h2 className="font-caslon text-[22px] leading-tight text-[#1a1a1a] md:text-[24px]">
          {topic.number}. {topic.title}
        </h2>
        <p className="font-manrope mt-3 max-w-[260px] text-[13px] leading-[1.55] text-[#555555]">
          {topic.description}
        </p>
        <span className="font-manrope mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#C89B3C]">
          Learn more
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
