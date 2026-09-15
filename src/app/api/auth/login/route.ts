import { NextRequest, NextResponse } from "next/server";
import { isUserAuthConfigured } from "@/lib/user/auth";
import { issueLoginOtp } from "@/lib/mongodb/users";
import { sendLoginOtpEmail } from "@/lib/email/send";

/**
 * Step 1 of login: validate account and email a one-time code.
 * Does not create a session until OTP is verified.
 */
export async function POST(request: NextRequest) {
  if (!isUserAuthConfigured()) {
    return NextResponse.json(
      { error: "User login is not configured. Set MONGODB_URI and a JWT secret." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : "";

  if (!email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const issued = await issueLoginOtp(email);
    if (!issued) {
      return NextResponse.json(
        { error: "Account not found. Create an account first." },
        { status: 401 },
      );
    }

    const mail = await sendLoginOtpEmail(issued.user.email, issued.otp);

    return NextResponse.json({
      success: true,
      needsOtp: true,
      email: issued.user.email,
      message: "We sent a 6-digit code to your email. Enter it to sign in.",
      ...(mail.loggedOnly && process.env.NODE_ENV !== "production"
        ? { devOtp: issued.otp }
        : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start login";
    if (message.toLowerCase().includes("confirm your email")) {
      return NextResponse.json(
        {
          error: message,
          needsVerification: true,
          email: email.trim().toLowerCase(),
        },
        { status: 403 },
      );
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
