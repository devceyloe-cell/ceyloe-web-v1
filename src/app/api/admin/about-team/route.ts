import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { getAboutTeam, saveAboutTeam } from "@/lib/mongodb/about-team";
import type { AboutTeamSection } from "@/lib/about/team";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const section = await getAboutTeam();
  return NextResponse.json({ section, mongoConfigured: isMongoConfigured() });
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is required to save Our Team." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as Partial<AboutTeamSection>;
  const saved = await saveAboutTeam(body);

  if (!saved) {
    return NextResponse.json({ error: "Could not save Our Team." }, { status: 500 });
  }

  return NextResponse.json({ section: saved });
}
