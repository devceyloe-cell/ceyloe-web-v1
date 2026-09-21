import { NextResponse } from "next/server";
import {
  createMfaPendingToken,
  getAdminMfaPending,
  isAdminConfigured,
  setMfaPendingCookie,
} from "@/lib/admin/auth";
import { sendAdminLoginOtpEmail } from "@/lib/email/send";
import { issueAdminLoginOtp } from "@/lib/mongodb/admin-users";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

export async function POST() {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin is not configured" }, { status: 503 });
  }

  const pending = await getAdminMfaPending();
  if (!pending) {
    return NextResponse.json(
      { error: "Sign-in session expired. Enter your password again." },
      { status: 401 },
    );
  }

  let issued;
  try {
    issued = await issueAdminLoginOtp(pending.username);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not resend code";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (!issued?.user.email) {
    return NextResponse.json({ error: "Could not resend code" }, { status: 400 });
  }

  const pendingToken = await createMfaPendingToken(pending.id, pending.username);
  if (pendingToken) await setMfaPendingCookie(pendingToken);

  let mail;
  try {
    mail = await sendAdminLoginOtpEmail(issued.user.email, issued.otp);
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

  return NextResponse.json({
    success: true,
    emailHint: maskEmail(issued.user.email),
    ...(process.env.NODE_ENV !== "production" ? { devOtp: issued.otp } : {}),
  });
}
