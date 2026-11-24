import { NextRequest, NextResponse } from "next/server";
import { isAdminConfigured } from "@/lib/admin/auth";
import { sendAdminPasswordResetEmail } from "@/lib/email/send";
import {
  isValidAdminEmail,
  issueAdminPasswordResetOtp,
} from "@/lib/mongodb/admin-users";
import { ADMIN_RATE_LIMITS, consumeRateLimit, getRequestIp } from "@/lib/rate-limit";

const GENERIC_OK =
  "If that account exists, a reset code was sent to the username email address.";

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

  if (!username || !isValidAdminEmail(username)) {
    // Still generic for non-emails to avoid leaking format rules aggressively
    return NextResponse.json({
      success: true,
      message: GENERIC_OK,
    });
  }

  let issued: Awaited<ReturnType<typeof issueAdminPasswordResetOtp>> = null;
  try {
    issued = await issueAdminPasswordResetOtp(username);
  } catch (err) {
    console.error("[admin/forgot-password]", err instanceof Error ? err.message : err);
  }

  if (issued) {
    try {
      const mail = await sendAdminPasswordResetEmail(issued.user.username, issued.otp);
      if (!mail.sent && !mail.loggedOnly && process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Could not send reset email. Try again shortly." },
          { status: 502 },
        );
      }
    } catch (err) {
      console.error("[admin/forgot-password] email", err instanceof Error ? err.message : err);
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Could not send reset email. Try again shortly." },
          { status: 502 },
        );
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: GENERIC_OK,
    ...(process.env.NODE_ENV !== "production" && issued ? { devOtp: issued.otp } : {}),
  });
}
