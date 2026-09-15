/**
 * One-time Microsoft Graph auth for sending mail.
 *
 * Option A (preferred): Authentication → Allow public client flows = Yes
 * Option B: Certificates & secrets → create secret → OUTLOOK_CLIENT_SECRET in .env.local
 *
 * Permissions (delegated): Mail.Send, User.Read, offline_access
 *
 * Run:
 *   node --env-file=.env.local scripts/setup-outlook-graph.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const clientId = process.env.OUTLOOK_CLIENT_ID?.trim();
const clientSecret = process.env.OUTLOOK_CLIENT_SECRET?.trim();
const tenant =
  process.env.OUTLOOK_TENANT?.trim() || "c3295e25-fff6-49f2-8def-c5e8f8f09e94";

if (!clientId) {
  console.error("Set OUTLOOK_CLIENT_ID in .env.local first.");
  process.exit(1);
}

const scope = "https://graph.microsoft.com/Mail.Send offline_access User.Read openid profile";

console.log("Client:", clientId);
console.log("Tenant:", tenant);
console.log("Client secret:", clientSecret ? "set" : "not set (trying public client)");

const deviceRes = await fetch(
  `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/devicecode`,
  {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, scope }),
  },
);

const device = await deviceRes.json();
if (!deviceRes.ok) {
  console.error("Device code request failed:", device.error, device.error_description || "");
  console.error(
    "\nFix in Azure Portal → App registration:\n" +
      "  - Authentication → Allow public client flows = Yes\n" +
      "  - OR Certificates & secrets → New client secret → OUTLOOK_CLIENT_SECRET\n",
  );
  process.exit(1);
}

console.log("\n" + (device.message || `Open https://login.microsoft.com/device and enter ${device.user_code}`) + "\n");
console.log("Sign in as apps.ceyloe@outlook.com\n");

const intervalMs = Math.max(3, Number(device.interval) || 5) * 1000;
const expiresAt = Date.now() + Number(device.expires_in || 900) * 1000;
let tokens = null;

while (Date.now() < expiresAt) {
  await new Promise((r) => setTimeout(r, intervalMs));

  const params = {
    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    client_id: clientId,
    device_code: device.device_code,
  };
  if (clientSecret) params.client_secret = clientSecret;

  const tokenRes = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });

  const data = await tokenRes.json();
  if (tokenRes.ok && data.access_token) {
    tokens = data;
    break;
  }

  if (data.error === "authorization_pending") continue;
  if (data.error === "slow_down") {
    await new Promise((r) => setTimeout(r, intervalMs));
    continue;
  }

  console.error("Auth failed:", data.error, data.error_description || "");
  if (String(data.error_description || "").includes("client_secret") || data.error === "invalid_client") {
    console.error(
      "\nYour app is a confidential client. Do ONE of these:\n" +
        "1) Azure → Authentication → Allow public client flows = Yes\n" +
        "2) Azure → Certificates & secrets → New client secret\n" +
        "   then set OUTLOOK_CLIENT_SECRET in .env.local and re-run this script\n",
    );
  }
  process.exit(1);
}

if (!tokens?.refresh_token) {
  console.error("No refresh token returned. Ensure offline_access permission is granted.");
  process.exit(1);
}

const envPath = resolve(process.cwd(), ".env.local");
let envText = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const upsert = (key, value) => {
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(envText)) envText = envText.replace(re, `${key}=${value}`);
  else envText = `${envText.trimEnd()}\n${key}=${value}\n`;
};

upsert("OUTLOOK_CLIENT_ID", clientId);
upsert("OUTLOOK_TENANT", tenant);
upsert("OUTLOOK_REFRESH_TOKEN", tokens.refresh_token);
writeFileSync(envPath, envText, "utf8");
console.log("Saved OUTLOOK_REFRESH_TOKEN to .env.local");

const meRes = await fetch("https://graph.microsoft.com/v1.0/me", {
  headers: { Authorization: `Bearer ${tokens.access_token}` },
});
const me = await meRes.json();
const mailbox = me.mail || me.userPrincipalName || "(unknown)";
console.log("Signed in as:", mailbox);

const sendRes = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${tokens.access_token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: {
      subject: "Ceyloe mail setup OK",
      body: {
        contentType: "HTML",
        content: "<p>Microsoft Graph can send Ceyloe confirmation emails.</p>",
      },
      toRecipients: [{ emailAddress: { address: mailbox } }],
    },
    saveToSentItems: true,
  }),
});

if (sendRes.ok || sendRes.status === 202) {
  console.log(`Test email sent to ${mailbox}`);
  console.log("Restart the Next.js server, then try Create account again.");
} else {
  console.error("Test send failed:", sendRes.status, await sendRes.text());
  console.error("In Azure → API permissions, add Mail.Send (delegated) and grant consent.");
  process.exit(1);
}
