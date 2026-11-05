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

function shouldSkipSmtpForOutlookGraph() {
  if (!isOutlookGraphConfigured()) return false;
  const host = (process.env.SMTP_HOST?.trim() || "smtp-mail.outlook.com").toLowerCase();
  return host.includes("outlook") || host.includes("office365") || host.includes("live.com");
}

async function sendViaSmtp(to: string, subject: string, html: string, text?: string) {
  if (shouldSkipSmtpForOutlookGraph()) {
    return false;
  }

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

  // Order: Resend → Outlook Graph (works when SMTP AUTH is disabled) → SMTP
  if (await sendViaResend({ to: options.to, subject: options.subject, html: options.html, text })) {
    return { sent: true, provider: "resend" };
  }
  if (await sendViaOutlookGraph(options)) {
    return { sent: true, provider: "outlook-graph" };
  }
  if (await sendViaSmtp(options.to, options.subject, options.html, text)) {
    return { sent: true, provider: "smtp" };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[email:dev]", options.subject, "→", options.to);
    console.info(options.html);
    return { sent: false, loggedOnly: true };
  }

  throw new Error(
    "Email is not configured. Set RESEND_API_KEY, Outlook Graph (OUTLOOK_CLIENT_ID + OUTLOOK_REFRESH_TOKEN), or SMTP credentials.",
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

export function buildAdminLoginOtpEmailHtml(otp: string) {
  const site = siteConfig.url.replace(/\/$/, "");
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
      <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #004B69;">Ceyloe Admin</p>
      <h1 style="font-size: 26px; color: #C09A4A; margin: 8px 0 16px;">Your admin sign-in code</h1>
      <p style="font-size: 15px; line-height: 1.6;">
        Use this one-time code to finish signing in to the Ceyloe admin console. It expires in 10 minutes.
      </p>
      <p style="margin: 28px 0; font-size: 32px; letter-spacing: 0.35em; font-weight: bold; color: #004B69;">
        ${otp}
      </p>
      <p style="font-size: 12px; color: #888; margin-top: 28px; line-height: 1.5;">
        If you did not try to sign in, secure your account and contact the site owner.
      </p>
      <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 28px 0 16px;" />
      <p style="font-size: 11px; color: #999; line-height: 1.5;">
        Ceyloe · ${site}<br/>
        Kalgoorlie WA, Australia
      </p>
    </div>
  `.trim();
}

export function buildAdminLoginOtpEmailText(otp: string) {
  return [
    "Ceyloe Admin",
    "",
    "Your admin sign-in code",
    "",
    `Code: ${otp}`,
    "",
    "This code expires in 10 minutes. If you did not try to sign in, ignore this email.",
    "",
    `Ceyloe · ${siteConfig.url}`,
  ].join("\n");
}

export async function sendAdminLoginOtpEmail(email: string, otp: string) {
  return sendEmail({
    to: email,
    subject: "Your Ceyloe admin sign-in code",
    html: buildAdminLoginOtpEmailHtml(otp),
    text: buildAdminLoginOtpEmailText(otp),
  });
}

// ─── Order Emails ─────────────────────────────────────────────────────────────

export interface OrderLineItem {
  name: string;
  image: string | null;
  amount: number;   // in cents
  currency: string;
  quantity: number;
}

interface OrderEmailParams {
  customerName: string;
  sessionId: string;
  amountTotal: number; // in cents
  currency: string;    // e.g. "AUD"
  lineItems: OrderLineItem[];
}

interface AdminOrderEmailParams extends OrderEmailParams {
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  paymentStatus?: string;
  orderId?: string;
}

function formatAmount(amountCents: number, currency: string) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}

function buildLineItemsHtml(lineItems: OrderLineItem[]): string {
  if (!lineItems.length) return "";

  const rows = lineItems
    .map((item) => {
      const price = formatAmount(item.amount, item.currency);
      const imgHtml = item.image
        ? `<img src="${item.image}" alt="${item.name}" width="72" height="72"
             style="width:72px;height:72px;object-fit:cover;border-radius:2px;border:1px solid #e8e4dc;display:block;" />`
        : `<div style="width:72px;height:72px;background:#f0ece4;border-radius:2px;border:1px solid #e8e4dc;display:flex;align-items:center;justify-content:center;">
             <span style="font-size:22px;">💎</span>
           </div>`;

      return `
        <tr>
          <td style="padding: 12px 0; vertical-align: top; width: 84px;">${imgHtml}</td>
          <td style="padding: 12px 0 12px 14px; vertical-align: top;">
            <p style="margin: 0 0 4px; font-size: 14px; font-weight: bold; color: #1a1a1a; line-height: 1.4;">${item.name}</p>
            ${item.quantity > 1 ? `<p style="margin: 0 0 4px; font-size: 12px; color: #888;">Qty: ${item.quantity}</p>` : ""}
          </td>
          <td style="padding: 12px 0; vertical-align: top; text-align: right; white-space: nowrap;">
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #C09A4A;">${price}</p>
          </td>
        </tr>
        <tr><td colspan="3" style="padding: 0;"><div style="height: 1px; background: #f0ece4;"></div></td></tr>
      `;
    })
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse;">
      ${rows}
    </table>
  `;
}

function buildLineItemsText(lineItems: OrderLineItem[]): string {
  return lineItems
    .map((item) => {
      const price = formatAmount(item.amount, item.currency);
      const qty = item.quantity > 1 ? ` x${item.quantity}` : "";
      return `  • ${item.name}${qty}  —  ${price}`;
    })
    .join("\n");
}

// ─── Customer Confirmation Email ───────────────────────────────────────────────

export function buildOrderConfirmationEmailHtml(params: OrderEmailParams) {
  const { customerName, sessionId, amountTotal, currency, lineItems } = params;
  const site = siteConfig.url.replace(/\/$/, "");
  const amount = formatAmount(amountTotal, currency);
  const firstName = customerName.split(" ")[0] || "there";
  const refShort = sessionId.slice(-8).toUpperCase();
  const replyEmail = process.env.EMAIL_REPLY_TO?.trim() || "apps.ceyloe@outlook.com";

  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; background: #faf9f7; padding: 32px 24px;">

      <!-- Header -->
      <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #004B69; margin: 0 0 8px;">Ceyloe Gemstones</p>
      <h1 style="font-size: 26px; color: #C09A4A; margin: 0 0 24px; font-weight: normal;">Your order is confirmed ✨</h1>

      <p style="font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
        Dear ${firstName},<br/><br/>
        Thank you for your order. Your payment has been received and your gemstone is now being prepared with care.
      </p>

      <!-- Order Summary -->
      <div style="background: #ffffff; border: 1px solid #e8e4dc; padding: 20px 24px; margin: 0 0 8px; border-radius: 2px;">
        <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #004B69; margin: 0 0 16px;">Order Summary</p>

        <!-- Reference -->
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
          <tr>
            <td style="color: #888;">Order reference</td>
            <td style="text-align: right; font-weight: bold; color: #1a1a1a; letter-spacing: 0.08em;">#${refShort}</td>
          </tr>
        </table>

        <!-- Product rows with image + name -->
        ${buildLineItemsHtml(lineItems)}

        <!-- Total -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
          <tr>
            <td style="padding-top: 12px; font-size: 15px; font-weight: bold; color: #1a1a1a; border-top: 2px solid #e8e4dc;">Total paid</td>
            <td style="padding-top: 12px; text-align: right; font-size: 15px; font-weight: bold; color: #C09A4A; border-top: 2px solid #e8e4dc;">${amount}</td>
          </tr>
        </table>
      </div>

      <!-- What Happens Next -->
      <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #004B69; margin: 28px 0 10px;">What happens next</p>
      <ol style="font-size: 14px; line-height: 1.8; color: #444; padding-left: 20px; margin: 0 0 24px;">
        <li>Our team will contact you within 1–2 business days to confirm delivery details and certification documents.</li>
        <li>Your gemstone will be prepared with insured, fully tracked shipping.</li>
        <li>You will receive a shipping confirmation with tracking information.</li>
      </ol>

      <!-- Contact -->
      <div style="border-top: 1px solid #e8e4dc; padding-top: 20px; margin-top: 8px;">
        <p style="font-size: 14px; color: #555; line-height: 1.7; margin: 0 0 12px;">Questions about your order? We're here to help.</p>
        <p style="font-size: 14px; color: #555; margin: 0; line-height: 1.8;">
          📧 <a href="mailto:${replyEmail}" style="color: #004B69; text-decoration: none;">${replyEmail}</a><br/>
          📞 ${siteConfig.contact.phone}<br/>
          💬 <a href="https://wa.me/${siteConfig.contact.whatsapp}" style="color: #004B69; text-decoration: none;">WhatsApp</a>
        </p>
      </div>

      <!-- Footer -->
      <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 28px 0 16px;" />
      <p style="font-size: 11px; color: #999; line-height: 1.6; margin: 0;">
        Ceyloe Gemstones · <a href="${site}" style="color: #999;">${site}</a><br/>
        Kalgoorlie WA, Australia<br/>
        <span style="font-size: 10px;">Order ref: ${sessionId}</span>
      </p>
    </div>
  `.trim();
}

export function buildOrderConfirmationEmailText(params: OrderEmailParams) {
  const { customerName, sessionId, amountTotal, currency, lineItems } = params;
  const amount = formatAmount(amountTotal, currency);
  const firstName = customerName.split(" ")[0] || "there";
  const refShort = sessionId.slice(-8).toUpperCase();

  return [
    "Ceyloe Gemstones",
    "",
    `Dear ${firstName},`,
    "",
    "Thank you for your order. Your payment has been received and your gemstone is being prepared.",
    "",
    "ORDER SUMMARY",
    `Reference: #${refShort}`,
    "",
    ...(lineItems.length ? [buildLineItemsText(lineItems), ""] : []),
    `Total paid: ${amount}`,
    "",
    "WHAT HAPPENS NEXT",
    "1. Our team will contact you within 1–2 business days to confirm delivery.",
    "2. Your gemstone will be dispatched with insured tracked shipping.",
    "3. You will receive a shipping confirmation with tracking details.",
    "",
    "Questions? Reply to this email or contact us:",
    `Phone: ${siteConfig.contact.phone}`,
    `WhatsApp: https://wa.me/${siteConfig.contact.whatsapp}`,
    "",
    `Ceyloe Gemstones · ${siteConfig.url}`,
    `Order ref: ${sessionId}`,
  ].join("\n");
}

// ─── Admin Notification Email ──────────────────────────────────────────────────

export function buildOrderAdminNotificationHtml(params: AdminOrderEmailParams) {
  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    paymentStatus,
    orderId,
    sessionId,
    amountTotal,
    currency,
    lineItems,
  } = params;
  const amount = formatAmount(amountTotal, currency);
  const refShort = sessionId.slice(-8).toUpperCase();
  const stripeUrl = `https://dashboard.stripe.com/payments/${sessionId}`;
  const statusLabel =
    paymentStatus === "paid"
      ? "Payment completed"
      : paymentStatus === "pending"
        ? "Payment pending"
        : paymentStatus || "Payment completed";
  const now = new Date().toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
    dateStyle: "full",
    timeStyle: "short",
  });

  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; background: #faf9f7; padding: 32px 24px;">
      <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #004B69; margin: 0 0 8px;">Ceyloe Admin</p>
      <h1 style="font-size: 24px; color: #C09A4A; margin: 0 0 8px; font-weight: normal;">New Order Received 🎉</h1>
      <p style="font-size: 13px; color: #888; margin: 0 0 8px;">${now} (AWST)</p>
      <p style="font-size: 13px; margin: 0 0 24px;">
        <span style="display:inline-block;background:#ecfdf5;color:#065f46;padding:4px 10px;border-radius:2px;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;">${statusLabel}</span>
      </p>

      <!-- Customer -->
      <div style="background: #ffffff; border: 1px solid #e8e4dc; padding: 16px 20px; margin: 0 0 16px; border-radius: 2px;">
        <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #004B69; margin: 0 0 10px;">Customer</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.8; color: #1a1a1a;">
          <strong>${customerName}</strong><br/>
          <a href="mailto:${customerEmail}" style="color: #004B69; text-decoration: none;">${customerEmail}</a>
          ${customerPhone ? `<br/>Phone: <a href="tel:${customerPhone}" style="color: #004B69; text-decoration: none;">${customerPhone}</a>` : ""}
        </p>
      </div>

      ${
        shippingAddress
          ? `<div style="background: #ffffff; border: 1px solid #e8e4dc; padding: 16px 20px; margin: 0 0 16px; border-radius: 2px;">
        <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #004B69; margin: 0 0 10px;">Delivery</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #1a1a1a; white-space: pre-line;">${shippingAddress}</p>
      </div>`
          : ""
      }

      <!-- Products -->
      <div style="background: #ffffff; border: 1px solid #e8e4dc; padding: 16px 20px; margin: 0 0 16px; border-radius: 2px;">
        <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #004B69; margin: 0 0 12px;">Order #${refShort}</p>
        ${buildLineItemsHtml(lineItems)}
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
          <tr>
            <td style="padding-top: 12px; font-weight: bold; font-size: 15px; color: #1a1a1a; border-top: 2px solid #e8e4dc;">Total</td>
            <td style="padding-top: 12px; text-align: right; font-weight: bold; font-size: 15px; color: #C09A4A; border-top: 2px solid #e8e4dc;">${amount}</td>
          </tr>
        </table>
      </div>

      <p style="margin: 0 0 24px;">
        <a href="${stripeUrl}" style="display: inline-block; background: #004B69; color: #ffffff; text-decoration: none; padding: 12px 20px; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; border-radius: 2px;">
          View in Stripe Dashboard →
        </a>
      </p>

      <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 24px 0 16px;" />
      <p style="font-size: 11px; color: #999;">Session ID: ${sessionId}${orderId ? `<br/>Order ID: ${orderId}` : ""}</p>
    </div>
  `.trim();
}

export function buildOrderAdminNotificationText(params: AdminOrderEmailParams) {
  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    paymentStatus,
    orderId,
    sessionId,
    amountTotal,
    currency,
    lineItems,
  } = params;
  const amount = formatAmount(amountTotal, currency);
  const refShort = sessionId.slice(-8).toUpperCase();
  const statusLabel =
    paymentStatus === "paid"
      ? "Payment completed"
      : paymentStatus === "pending"
        ? "Payment pending"
        : paymentStatus || "Payment completed";

  return [
    "Ceyloe Admin — New Order",
    "",
    `Payment status: ${statusLabel}`,
    "",
    "CUSTOMER",
    `Name:  ${customerName}`,
    `Email: ${customerEmail}`,
    ...(customerPhone ? [`Phone: ${customerPhone}`] : []),
    "",
    ...(shippingAddress ? ["DELIVERY", shippingAddress, ""] : []),
    `ORDER #${refShort}`,
    ...(lineItems.length ? [buildLineItemsText(lineItems), ""] : []),
    `Total: ${amount}`,
    "",
    `Stripe: https://dashboard.stripe.com/payments/${sessionId}`,
    "",
    `Session ID: ${sessionId}`,
    ...(orderId ? [`Order ID: ${orderId}`] : []),
  ].join("\n");
}
