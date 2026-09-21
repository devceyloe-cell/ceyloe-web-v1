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

function maskEmails(emails: string[]) {
  if (emails.length === 0) return "";
  if (emails.length === 1) return maskEmail(emails[0]);
  return `${maskEmail(emails[0])} (+${emails.length - 1} more)`;
}

async function sendOtpToAll(emails: string[], otp: string) {
  const results = await Promise.allSettled(
    emails.map((email) => sendAdminLoginOtpEmail(email, otp)),
  );
  const sent = results.some(
    (r) => r.status === "fulfilled" && (r.value.sent || r.value.loggedOnly),
  );
  return { sent };
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

  if (!issued || issued.user.emails.length === 0) {
    return NextResponse.json({ error: "Could not resend code" }, { status: 400 });
  }

  const pendingToken = await createMfaPendingToken(pending.id, pending.username);
  if (pendingToken) await setMfaPendingCookie(pendingToken);

  let mail;
  try {
    mail = await sendOtpToAll(issued.user.emails, issued.otp);
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
    emailHint: maskEmails(issued.user.emails),
    ...(process.env.NODE_ENV !== "production" ? { devOtp: issued.otp } : {}),
  });
}
