/**
 * Send a one-off test email using the same env vars as production (SMTP / Resend).
 *
 * Usage:
 *   node --env-file=.env.local scripts/send-test-email.mjs [to@email.com]
 *
 * Default recipient: SMTP_USER or apps.ceyloe@outlook.com
 */

async function sendViaResend(to, subject, html, text) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;

  const from =
    process.env.EMAIL_FROM?.trim() && !/@(outlook|hotmail|live)\.com/i.test(process.env.EMAIL_FROM)
      ? process.env.EMAIL_FROM.trim()
      : "Ceyloe <noreply@ceyloe.com>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: process.env.EMAIL_REPLY_TO?.trim() || "apps.ceyloe@outlook.com",
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend failed (${res.status}): ${body || res.statusText}`);
  }
  return "resend";
}

async function sendViaSmtp(to, subject, html, text) {
  const host = process.env.SMTP_HOST?.trim() || "smtp-mail.outlook.com";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) return null;

  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
  });

  const from = `Ceyloe <${user}>`;

  await transporter.sendMail({
    from,
    replyTo: process.env.EMAIL_REPLY_TO?.trim() || user,
    to,
    subject,
    html,
    text,
  });

  return "smtp";
}

async function sendViaOutlookGraph(to, subject, html) {
  const clientId = process.env.OUTLOOK_CLIENT_ID?.trim();
  const refreshToken = process.env.OUTLOOK_REFRESH_TOKEN?.trim();
  const tenant = process.env.OUTLOOK_TENANT?.trim() || "consumers";
  if (!clientId || !refreshToken) return null;

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    scope: "https://graph.microsoft.com/Mail.Send offline_access User.Read",
  });
  const clientSecret = process.env.OUTLOOK_CLIENT_SECRET?.trim();
  if (clientSecret) body.set("client_secret", clientSecret);

  const tokenRes = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || "Outlook token refresh failed");
  }

  const mailRes = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: "HTML", content: html },
        toRecipients: [{ emailAddress: { address: to } }],
      },
      saveToSentItems: true,
    }),
  });

  if (!mailRes.ok && mailRes.status !== 202) {
    const err = await mailRes.text().catch(() => "");
    throw new Error(`Outlook Graph send failed (${mailRes.status}): ${err}`);
  }
  return "outlook-graph";
}

async function main() {
  const to =
    process.argv[2]?.trim() ||
    process.env.SMTP_USER?.trim() ||
    "apps.ceyloe@outlook.com";

  const subject = "Ceyloe — manual email test";
  const html = `
    <p style="font-family: Georgia, serif;">This is a manual test from <strong>scripts/send-test-email.mjs</strong>.</p>
    <p>Sent at: ${new Date().toISOString()}</p>
  `.trim();
  const text = `Ceyloe manual email test at ${new Date().toISOString()}`;

  console.log(`Sending test email to: ${to}`);
  console.log(`RESEND_API_KEY: ${process.env.RESEND_API_KEY?.trim() ? "set" : "not set"}`);
  console.log(`SMTP: ${process.env.SMTP_USER?.trim() ? process.env.SMTP_USER : "not configured"}`);

  let provider = null;
  if (process.env.RESEND_API_KEY?.trim()) {
    try {
      provider = await sendViaResend(to, subject, html, text);
    } catch (e) {
      console.warn("Resend failed, trying SMTP:", e.message);
    }
  }
  if (!provider) {
    try {
      provider = await sendViaSmtp(to, subject, html, text);
    } catch (e) {
      console.warn("SMTP failed:", e.message);
    }
  }
  if (!provider) {
    try {
      provider = await sendViaOutlookGraph(to, subject, html);
    } catch (e) {
      console.warn("Outlook Graph failed:", e.message);
    }
  }

  if (!provider) {
    console.error("No email provider configured. Set RESEND_API_KEY or SMTP_* in .env.local");
    process.exit(1);
  }

  console.log(`✅ Sent via ${provider}`);
}

main().catch((err) => {
  console.error("❌ Failed:", err.message || err);
  process.exit(1);
});
