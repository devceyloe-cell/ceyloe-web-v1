import { NextRequest, NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/admin/auth";
import { isEmailSendingConfigured, sendAdminPasswordResetEmail } from "@/lib/email/send";
import { issueAdminPasswordResetOtp } from "@/lib/mongodb/admin-users";
import { ADMIN_RATE_LIMITS, consumeRateLimit, getRequestIp } from "@/lib/rate-limit";

const GENERIC_OK =
  "If that account exists, a reset code was sent to the email on file.";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin is not configured" }, { status: 503 });
  }

  const ip = getRequestIp(request);
  const limited = await consumeRateLimit(
    `admin-forgot:${ip}`,
    ADMIN_RATE_LIMITS.forgotPassword.limit,
    ADMIN_RATE_LIMITS.forgotPassword.windowMs,
  );
  if (!limited.allowed) {
    return NextResponse.json(
      {
        error: `Too many reset requests. Try again in ${limited.retryAfterSeconds} seconds.`,
      },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" ? body.username.trim() : "";

  if (!username) {
    return NextResponse.json({ success: true, message: GENERIC_OK });
  }

  let issued: Awaited<ReturnType<typeof issueAdminPasswordResetOtp>> = null;
  try {
    issued = await issueAdminPasswordResetOtp(username);
  } catch (err) {
    console.error("[admin/forgot-password]", err instanceof Error ? err.message : err);
  }

  if (!issued) {
    // Do not reveal whether the account exists
    return NextResponse.json({ success: true, message: GENERIC_OK });
  }

  if (!isEmailSendingConfigured() && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Email is not configured. Contact the site owner to reset your password." },
      { status: 503 },
    );
  }

  try {
    const mail = await sendAdminPasswordResetEmail(issued.sendTo, issued.otp);
    if (!mail.sent && !mail.loggedOnly) {
      return NextResponse.json(
        { error: "Could not send reset email. Try again shortly." },
        { status: 502 },
      );
    }
    if (!mail.sent && mail.loggedOnly && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Could not send reset email. Try again shortly." },
        { status: 502 },
      );
    }

    console.info(
      `[admin/forgot-password] reset code sent via ${mail.provider || "dev-log"} to ${maskEmail(issued.sendTo)}`,
    );

    return NextResponse.json({
      success: true,
      message: GENERIC_OK,
      emailHint: maskEmail(issued.sendTo),
      ...(process.env.NODE_ENV !== "production" ? { devOtp: issued.otp } : {}),
    });
  } catch (err) {
    console.error("[admin/forgot-password] email", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Could not send reset email. Try again shortly." },
      { status: 502 },
    );
  }
}
