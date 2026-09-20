import { TeamEditor } from "@/components/admin/team-editor";
import { isMongoConfigured } from "@/config/env";
import { getAboutTeam } from "@/lib/mongodb/about-team";

export default async function AdminTeamPage() {
  const section = await getAboutTeam();

  return <TeamEditor initial={section} mongoConfigured={isMongoConfigured()} />;
}
