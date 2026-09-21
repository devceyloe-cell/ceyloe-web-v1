import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, isAuthenticated } from "@/lib/admin/auth";
import {
  getAdminSecuritySettings,
  saveAdminSecuritySettings,
} from "@/lib/mongodb/admin-security";
import { getAdminUserById, updateAdminProfile } from "@/lib/mongodb/admin-users";
import { AdminSecuritySettingsSchema } from "@/lib/validation/schemas";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [security, profile] = await Promise.all([
    getAdminSecuritySettings(),
    getAdminUserById(session.id),
  ]);

  return NextResponse.json({
    security,
    profile: {
      username: session.username,
      email: profile?.email ?? null,
    },
  });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = AdminSecuritySettingsSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstError?.message || "Invalid settings" },
      { status: 400 },
    );
  }

  const { mfaEnabled, email } = parsed.data;

  let profile = await getAdminUserById(session.id);
  if (email) {
    try {
      profile = await updateAdminProfile(session.id, { email });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update email";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  if (mfaEnabled && !profile?.email && !email) {
    return NextResponse.json(
      { error: "Set an admin email before enabling MFA" },
      { status: 400 },
    );
  }

  const security = await saveAdminSecuritySettings({ mfaEnabled });
  if (!security) {
    return NextResponse.json({ error: "Could not save settings" }, { status: 500 });
  }

  return NextResponse.json({
    security,
    profile: {
      username: session.username,
      email: profile?.email ?? null,
    },
  });
}
