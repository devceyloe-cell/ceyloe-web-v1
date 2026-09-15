type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

function getOutlookConfig() {
  const clientId = process.env.OUTLOOK_CLIENT_ID?.trim();
  const clientSecret = process.env.OUTLOOK_CLIENT_SECRET?.trim();
  const refreshToken = process.env.OUTLOOK_REFRESH_TOKEN?.trim();
  const tenant = process.env.OUTLOOK_TENANT?.trim() || "consumers";
  if (!clientId || !refreshToken) return null;
  return { clientId, clientSecret, refreshToken, tenant };
}

export function isOutlookGraphConfigured() {
  return Boolean(getOutlookConfig());
}

async function getAccessToken(): Promise<string> {
  const config = getOutlookConfig();
  if (!config) throw new Error("Outlook Graph is not configured");

  const body = new URLSearchParams({
    client_id: config.clientId,
    grant_type: "refresh_token",
    refresh_token: config.refreshToken,
    scope: "https://graph.microsoft.com/Mail.Send offline_access User.Read",
  });
  if (config.clientSecret) {
    body.set("client_secret", config.clientSecret);
  }

  const res = await fetch(`https://login.microsoftonline.com/${config.tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as TokenResponse;
  if (!res.ok || !data.access_token) {
    throw new Error(
      data.error_description ||
        data.error ||
        "Could not refresh Outlook access token. Re-run scripts/setup-outlook-graph.mjs",
    );
  }

  return data.access_token;
}

export async function sendViaOutlookGraph(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  if (!isOutlookGraphConfigured()) return false;

  const accessToken = await getAccessToken();
  const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        subject: options.subject,
        body: {
          contentType: "HTML",
          content: options.html,
        },
        toRecipients: [{ emailAddress: { address: options.to } }],
      },
      saveToSentItems: true,
    }),
  });

  if (!res.ok && res.status !== 202) {
    const text = await res.text().catch(() => "");
    throw new Error(`Outlook Graph send failed (${res.status}): ${text || res.statusText}`);
  }

  return true;
}
