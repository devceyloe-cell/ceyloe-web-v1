import { NextRequest, NextResponse } from "next/server";
import { isUserAuthConfigured } from "@/lib/user/auth";
import { issueLoginOtp } from "@/lib/mongodb/users";
import { sendLoginOtpEmail } from "@/lib/email/send";

export async function POST(request: NextRequest) {
  if (!isUserAuthConfigured()) {
    return NextResponse.json({ error: "User accounts are not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : "";

  if (!email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const issued = await issueLoginOtp(email);
    if (!issued) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const mail = await sendLoginOtpEmail(issued.user.email, issued.otp);

    return NextResponse.json({
      success: true,
      message: "A new login code was sent to your email.",
      ...(mail.loggedOnly && process.env.NODE_ENV !== "production"
        ? { devOtp: issued.otp }
        : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not resend code";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
