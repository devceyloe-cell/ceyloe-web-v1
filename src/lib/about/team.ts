import type { AboutTeamMember } from "@/data/about-content";
import { aboutTeam, aboutTeamIntro } from "@/data/about-content";

export type AboutTeamSection = {
  title: string;
  intro: string;
  members: AboutTeamMember[];
  updatedAt?: string;
};

export const DEFAULT_ABOUT_TEAM: AboutTeamSection = {
  title: "Our Team",
  intro: aboutTeamIntro,
  members: aboutTeam.map((m) => ({ ...m })),
};

export function normalizeAboutTeam(
  input: Partial<AboutTeamSection> | null | undefined,
): AboutTeamSection {
  const base = DEFAULT_ABOUT_TEAM;
  const members = Array.isArray(input?.members)
    ? input!.members
        .map((item, index) => ({
          id: String(item?.id || `member-${index + 1}`),
          name: String(item?.name || "").trim(),
          role: String(item?.role || "").trim(),
          bio: String(item?.bio || "").trim(),
          image: String(item?.image || "").trim(),
          objectPosition: item?.objectPosition
            ? String(item.objectPosition).trim()
            : "center center",
        }))
        .filter((item) => item.name && item.image)
    : base.members;

  return {
    title: String(input?.title || base.title).trim() || base.title,
    intro: String(input?.intro ?? base.intro).trim() || base.intro,
    members: members.length > 0 ? members : base.members,
    updatedAt: input?.updatedAt,
  };
}
