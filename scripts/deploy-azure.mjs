import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(join(process.cwd(), ".env.local"));

const publishPath =
  process.argv[2] ??
  "C:\\Users\\Thilanka.chameera\\AppData\\Local\\Temp\\ceyloe.PublishSettings";
const zipPath = join(process.cwd(), "ceyloe-azure.zip");

if (!existsSync(zipPath)) {
  console.error("Missing ceyloe-azure.zip — run `npm run build:azure` first.");
  process.exit(1);
}

const xml = readFileSync(publishPath, "utf8");
const profileMatch = xml.match(
  /profileName="ceyloe - Zip Deploy"[^>]*publishUrl="([^"]+)"[^>]*userName="([^"]+)"[^>]*userPWD="([^"]+)"/,
);

if (!profileMatch) {
  console.error("Could not parse Zip Deploy profile from publish settings.");
  process.exit(1);
}

const [, publishHost, userName, password] = profileMatch;
const deployUrl = `https://${publishHost}/api/zipdeploy?isAsync=true`;
const auth = Buffer.from(`${userName}:${password}`).toString("base64");

const siteUrlMatch = xml.match(/destinationAppUrl="([^"]+)"/);
const siteUrl = siteUrlMatch?.[1];

if (!siteUrl) {
  console.error("Could not parse destinationAppUrl from publish settings.");
  process.exit(1);
}

const required = [
  "ADMIN_JWT_SECRET",
  "MONGODB_URI",
  "MONGODB_DB_NAME",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing ${key} — set in .env.local`);
    process.exit(1);
  }
}

console.log("Deploying to:", siteUrl);
console.log("ZIP:", zipPath);

const zip = readFileSync(zipPath);
const deployRes = await fetch(deployUrl, {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/zip",
  },
  body: zip,
});

if (!deployRes.ok) {
  console.error("Zip deploy failed:", deployRes.status, await deployRes.text());
  process.exit(1);
}

console.log("Zip deploy accepted:", deployRes.status);

const appSettings = {
  WEBSITES_PORT: "8080",
  SCM_DO_BUILD_DURING_DEPLOYMENT: "false",
  WEBSITE_NODE_DEFAULT_VERSION: "~20",
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  NEXT_PUBLIC_SITE_URL: siteUrl,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  ...(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    ? { NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID }
    : {}),
};

const settingsUrl = `https://${publishHost}/api/settings`;
const settingsRes = await fetch(settingsUrl, {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(appSettings),
});

if (settingsRes.ok) {
  console.log("App settings updated.");
  await fetch(`https://${publishHost}/api/app/restart`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
  });
} else {
  console.warn(
    "App settings API returned",
    settingsRes.status,
    "- run `npm run azure:set-env` or set in Azure Portal.",
  );
}

// Poll deployment status
const statusUrl = `https://${publishHost}/api/deployments/latest`;
for (let i = 0; i < 30; i++) {
  await new Promise((r) => setTimeout(r, 10000));
  const statusRes = await fetch(statusUrl, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!statusRes.ok) continue;
  const status = await statusRes.json();
  console.log("Deploy status:", status.status, status.status_text ?? "");
  if (status.status === 4) {
    console.log("Deployment complete:", siteUrl);
    process.exit(0);
  }
  if (status.status === 3) {
    console.error("Deployment failed:", status.status_text ?? status.log_url);
    process.exit(1);
  }
}

console.log("Deploy still running — check:", siteUrl);
