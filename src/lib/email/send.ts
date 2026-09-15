import { getRequestBaseUrl } from "@/lib/request-base-url";
import { isOutlookGraphConfigured, sendViaOutlookGraph } from "@/lib/email/outlook-graph";
import { siteConfig } from "@/config/site";
import type { NextRequest } from "next/server";

export function isEmailSendingConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() ||
      isOutlookGraphConfigured() ||
      (process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim()),
  );
}

/** Prefer branded domain From for Resend; Outlook SMTP must send as the logged-in mailbox. */
function getResendFromAddress() {
  const configured = process.env.EMAIL_FROM?.trim();
  if (configured && !/@(outlook|hotmail|live)\.com/i.test(configured)) {
    return configured;
  }
  return "Ceyloe <noreply@ceyloe.com>";
}

function getSmtpFromAddress() {
  const user = process.env.SMTP_USER?.trim() || "apps.ceyloe@outlook.com";
  const configured = process.env.EMAIL_FROM?.trim();
  // Outlook SMTP rejects From that doesn't match the authenticated account
  if (configured && configured.toLowerCase().includes(user.toLowerCase())) {
    return configured;
  }
  return `Ceyloe <${user}>`;
}

function getReplyTo() {
  return process.env.EMAIL_REPLY_TO?.trim() || "apps.ceyloe@outlook.com";
}

async function sendViaResend(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return false;

  const from = getResendFromAddress();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [options.to],
      reply_to: getReplyTo(),
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend failed (${res.status}): ${body || res.statusText}`);
  }

  return true;
}

async function sendViaSmtp(to: string, subject: string, html: string, text?: string) {
  const host = process.env.SMTP_HOST?.trim() || "smtp-mail.outlook.com";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) return false;

  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: !secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: getSmtpFromAddress(),
      replyTo: getReplyTo(),
      to,
      subject,
      html,
      text,
    });

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("SmtpClientAuthentication is disabled") || message.includes("5.7.139")) {
      console.warn(
        `[email] SMTP AUTH disabled on ${host}. Falling back to next provider if configured.`,
      );
      return false;
    }
    throw error;
  }
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ sent: boolean; loggedOnly?: boolean; provider?: string }> {
  const text = options.text || options.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  // Order: Resend (best deliverability) → Outlook SMTP → Graph
  if (await sendViaResend({ to: options.to, subject: options.subject, html: options.html, text })) {
    return { sent: true, provider: "resend" };
  }
  if (await sendViaSmtp(options.to, options.subject, options.html, text)) {
    return { sent: true, provider: "smtp" };
  }
  if (await sendViaOutlookGraph(options)) {
    return { sent: true, provider: "outlook-graph" };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[email:dev]", options.subject, "→", options.to);
    console.info(options.html);
    return { sent: false, loggedOnly: true };
  }

  throw new Error(
    "Email is not configured. Set SMTP (smtp-mail.outlook.com) or RESEND_API_KEY / Outlook Graph credentials.",
  );
}

export function buildVerificationEmailHtml(verifyUrl: string) {
  const site = siteConfig.url.replace(/\/$/, "");
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
      <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #004B69;">Ceyloe Gemstones</p>
      <h1 style="font-size: 26px; color: #C09A4A; margin: 8px 0 16px;">Confirm your email</h1>
      <p style="font-size: 15px; line-height: 1.6;">
        Thanks for creating a Ceyloe account. Please confirm your email address so we can save your cart and keep your account secure.
      </p>
      <p style="margin: 28px 0;">
        <a href="${verifyUrl}"
           style="display: inline-block; background: #004B69; color: #ffffff; text-decoration: none;
                  padding: 14px 22px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;">
          Confirm email
        </a>
      </p>
      <p style="font-size: 13px; line-height: 1.5; color: #555;">
        Or copy and paste this link into your browser:<br/>
        <a href="${verifyUrl}" style="color: #004B69; word-break: break-all;">${verifyUrl}</a>
      </p>
      <p style="font-size: 12px; color: #888; margin-top: 28px; line-height: 1.5;">
        This link expires in 24 hours. If you did not create an account, you can ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 28px 0 16px;" />
      <p style="font-size: 11px; color: #999; line-height: 1.5;">
        Ceyloe · ${site}<br/>
        Kalgoorlie WA, Australia
      </p>
    </div>
  `.trim();
}

export function buildVerificationEmailText(verifyUrl: string) {
  return [
    "Ceyloe Gemstones",
    "",
    "Confirm your email",
    "",
    "Thanks for creating a Ceyloe account. Open the link below to confirm your email and activate your cart:",
    "",
    verifyUrl,
    "",
    "This link expires in 24 hours. If you did not create an account, ignore this email.",
    "",
    `Ceyloe · ${siteConfig.url}`,
  ].join("\n");
}

export function verificationUrl(request: NextRequest, token: string) {
  const base = getRequestBaseUrl(request);
  return `${base}/api/auth/verify?token=${encodeURIComponent(token)}`;
}

export async function sendVerificationEmail(request: NextRequest, email: string, token: string) {
  const verifyUrl = verificationUrl(request, token);
  const result = await sendEmail({
    to: email,
    subject: "Confirm your Ceyloe account",
    html: buildVerificationEmailHtml(verifyUrl),
    text: buildVerificationEmailText(verifyUrl),
  });

  return { ...result, verifyUrl };
}

export function buildLoginOtpEmailHtml(otp: string) {
  const site = siteConfig.url.replace(/\/$/, "");
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
      <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #004B69;">Ceyloe Gemstones</p>
      <h1 style="font-size: 26px; color: #C09A4A; margin: 8px 0 16px;">Your login code</h1>
      <p style="font-size: 15px; line-height: 1.6;">
        Use this one-time code to sign in to your Ceyloe account. It expires in 10 minutes.
      </p>
      <p style="margin: 28px 0; font-size: 32px; letter-spacing: 0.35em; font-weight: bold; color: #004B69;">
        ${otp}
      </p>
      <p style="font-size: 12px; color: #888; margin-top: 28px; line-height: 1.5;">
        If you did not try to sign in, you can ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 28px 0 16px;" />
      <p style="font-size: 11px; color: #999; line-height: 1.5;">
        Ceyloe · ${site}<br/>
        Kalgoorlie WA, Australia
      </p>
    </div>
  `.trim();
}

export function buildLoginOtpEmailText(otp: string) {
  return [
    "Ceyloe Gemstones",
    "",
    "Your login code",
    "",
    `Code: ${otp}`,
    "",
    "This code expires in 10 minutes. If you did not try to sign in, ignore this email.",
    "",
    `Ceyloe · ${siteConfig.url}`,
  ].join("\n");
}

export async function sendLoginOtpEmail(email: string, otp: string) {
  return sendEmail({
    to: email,
    subject: "Your Ceyloe login code",
    html: buildLoginOtpEmailHtml(otp),
    text: buildLoginOtpEmailText(otp),
  });
}
