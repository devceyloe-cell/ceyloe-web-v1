import Image from "next/image";
import type { AboutTeamMember } from "@/data/about-content";

interface TeamCardProps {
  member: AboutTeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  return (
    <article className="group flex max-h-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.07)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] focus-within:ring-2 focus-within:ring-[#C89B3C]/60">
      {/* Square frame matches square portraits — prevents face cropping from aspect mismatch */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-[#ece8e2]">
        <Image
          src={member.image}
          alt={`Portrait of ${member.name}, ${member.role} at Ceyloe`}
          fill
          loading="lazy"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 py-4 text-center md:px-5">
        <h3 className="font-caslon text-[22px] leading-tight text-[#C89B3C] md:text-2xl">
          {member.name}
        </h3>
        <p className="font-manrope mt-0.5 text-[12px] font-semibold leading-snug text-[#222222]">
          {member.role}
        </p>
        <p className="font-manrope mt-2 line-clamp-4 text-[13px] leading-[1.45] text-[#555555]">
          {member.bio}
        </p>
      </div>
    </article>
  );
}
