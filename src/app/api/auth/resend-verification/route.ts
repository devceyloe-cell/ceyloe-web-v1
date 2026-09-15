import { NextRequest, NextResponse } from "next/server";
import { isUserAuthConfigured } from "@/lib/user/auth";
import { issueVerificationToken } from "@/lib/mongodb/users";
import { sendVerificationEmail } from "@/lib/email/send";

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
    const issued = await issueVerificationToken(email);
    if (!issued) {
      return NextResponse.json({ error: "Account not found. Create an account first." }, { status: 404 });
    }

    const mail = await sendVerificationEmail(request, issued.user.email, issued.verificationToken);

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent. Check your inbox.",
      ...(mail.loggedOnly && process.env.NODE_ENV !== "production"
        ? { devVerifyUrl: mail.verifyUrl }
        : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not resend confirmation";
    const status = message.includes("already verified") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
