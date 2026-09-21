import { NextRequest, NextResponse } from "next/server";
import {
  clearMfaPendingCookie,
  createMfaPendingToken,
  createSessionToken,
  isAdminConfigured,
  setMfaPendingCookie,
  setSessionCookie,
} from "@/lib/admin/auth";
import { sendAdminLoginOtpEmail } from "@/lib/email/send";
import { getAdminSecuritySettings } from "@/lib/mongodb/admin-security";
import { authenticateAdminUser, issueAdminLoginOtp } from "@/lib/mongodb/admin-users";
import { AdminLoginSchema } from "@/lib/validation/schemas";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin is not configured. Set MONGODB_URI and ADMIN_JWT_SECRET, then create an admin user.",
      },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = AdminLoginSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstError?.message || "Invalid username or password" },
      { status: 400 },
    );
  }

  const { username, password } = parsed.data;
  const user = await authenticateAdminUser(username, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const security = await getAdminSecuritySettings();

  if (!security.mfaEnabled) {
    const token = await createSessionToken(user.id, user.username);
    if (!token) {
      return NextResponse.json({ error: "Could not create session" }, { status: 500 });
    }
    await clearMfaPendingCookie();
    await setSessionCookie(token);
    return NextResponse.json({ success: true, needsOtp: false });
  }

  if (!user.email) {
    return NextResponse.json(
      {
        error:
          "MFA is enabled but this admin has no email. Set an email with create-admin or ask an existing admin to update Settings.",
      },
      { status: 403 },
    );
  }

  let issued;
  try {
    issued = await issueAdminLoginOtp(user.username);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not issue OTP";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (!issued) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const pendingToken = await createMfaPendingToken(user.id, user.username);
  if (!pendingToken) {
    return NextResponse.json({ error: "Could not start MFA challenge" }, { status: 500 });
  }

  let mail;
  try {
    mail = await sendAdminLoginOtpEmail(issued.user.email!, issued.otp);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not send verification email";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (!mail.sent && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Could not send verification email. Try again shortly." },
      { status: 502 },
    );
  }

  await setMfaPendingCookie(pendingToken);

  return NextResponse.json({
    success: true,
    needsOtp: true,
    emailHint: maskEmail(issued.user.email!),
    ...(process.env.NODE_ENV !== "production" ? { devOtp: issued.otp } : {}),
  });
}
