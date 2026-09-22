import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb/client";
import {
  DEFAULT_ABOUT_TEAM,
  normalizeAboutTeam,
  type AboutTeamSection,
} from "@/lib/about/team";

const SETTINGS_KEY = "about-team";
const REVALIDATE_SECONDS = 60;

async function fetchAboutTeam(): Promise<AboutTeamSection> {
  try {
    const db = await getDb();
    if (!db) return DEFAULT_ABOUT_TEAM;

    const doc = await db.collection("site_settings").findOne({ key: SETTINGS_KEY });
    if (!doc) return DEFAULT_ABOUT_TEAM;

    return normalizeAboutTeam(doc as Partial<AboutTeamSection>);
  } catch {
    return DEFAULT_ABOUT_TEAM;
  }
}

export const getAboutTeam = unstable_cache(fetchAboutTeam, ["about-team"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["about-team"],
});

export async function saveAboutTeam(
  input: Partial<AboutTeamSection>,
): Promise<AboutTeamSection | null> {
  const db = await getDb();
  if (!db) return null;

  const normalized = normalizeAboutTeam({
    ...input,
    updatedAt: new Date().toISOString(),
  });

  await db.collection("site_settings").updateOne(
    { key: SETTINGS_KEY },
    {
      $set: {
        key: SETTINGS_KEY,
        title: normalized.title,
        intro: normalized.intro,
        members: normalized.members,
        updatedAt: normalized.updatedAt,
      },
    },
    { upsert: true },
  );

  return normalized;
}
