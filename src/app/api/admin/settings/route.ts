import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, isAuthenticated } from "@/lib/admin/auth";
import {
  getAdminSecuritySettings,
  saveAdminSecuritySettings,
} from "@/lib/mongodb/admin-security";
import {
  changeAdminPassword,
  getAdminUserById,
  updateAdminProfile,
} from "@/lib/mongodb/admin-users";
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
      emails: profile?.emails ?? [],
      role: profile?.role ?? session.adminRole,
      mfaEnabled: profile?.mfaEnabled ?? false,
      active: profile?.active ?? true,
    },
    canManageSecurity: session.adminRole === "owner",
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

  const { mfaEnabled, mfaRequired, emails, currentPassword, newPassword } = parsed.data;

  if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
    return NextResponse.json(
      { error: "Current password and new password are both required to change password" },
      { status: 400 },
    );
  }

  if (currentPassword && newPassword) {
    try {
      await changeAdminPassword(session.id, currentPassword, newPassword);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not change password";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  let profile = await getAdminUserById(session.id);
  const security = await getAdminSecuritySettings();

  if (emails !== undefined || typeof mfaEnabled === "boolean") {
    try {
      if (typeof mfaEnabled === "boolean" && mfaEnabled && security.mfaRequired === false) {
        const resolvedEmails =
          emails !== undefined
            ? emails
            : profile?.emails ?? [];
        if (resolvedEmails.length === 0) {
          return NextResponse.json(
            { error: "Add at least one MFA email before enabling MFA" },
            { status: 400 },
          );
        }
      }

      profile = await updateAdminProfile(session.id, {
        ...(emails !== undefined ? { emails } : {}),
        ...(typeof mfaEnabled === "boolean" ? { mfaEnabled } : {}),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update profile";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  let nextSecurity = security;
  if (typeof mfaRequired === "boolean") {
    if (session.adminRole !== "owner") {
      return NextResponse.json(
        { error: "Only owners can require MFA for all admins" },
        { status: 403 },
      );
    }
    const saved = await saveAdminSecuritySettings({ mfaRequired });
    if (!saved) {
      return NextResponse.json({ error: "Could not save settings" }, { status: 500 });
    }
    nextSecurity = saved;
  }

  const effectiveMfa =
    nextSecurity.mfaRequired || Boolean(profile?.mfaEnabled);
  if (effectiveMfa && (profile?.emails?.length ?? 0) === 0) {
    return NextResponse.json(
      { error: "Add at least one MFA email before MFA is required" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    security: nextSecurity,
    profile: {
      username: session.username,
      email: profile?.email ?? null,
      emails: profile?.emails ?? [],
      role: profile?.role ?? session.adminRole,
      mfaEnabled: profile?.mfaEnabled ?? false,
      active: profile?.active ?? true,
    },
    canManageSecurity: session.adminRole === "owner",
    passwordChanged: Boolean(currentPassword && newPassword),
  });
}
