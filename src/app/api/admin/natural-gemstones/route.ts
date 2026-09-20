import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { isMongoConfigured } from "@/config/env";
import { getNaturalGemstones, saveNaturalGemstones } from "@/lib/mongodb/natural-gemstones";
import type { NaturalGemstonesSection } from "@/lib/gemstones/natural-categories";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const section = await getNaturalGemstones();
  return NextResponse.json({ section, mongoConfigured: isMongoConfigured() });
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MongoDB is required to save Natural Gemstones." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as Partial<NaturalGemstonesSection>;
  const saved = await saveNaturalGemstones(body);

  if (!saved) {
    return NextResponse.json({ error: "Could not save Natural Gemstones." }, { status: 500 });
  }

  return NextResponse.json({ section: saved });
}
