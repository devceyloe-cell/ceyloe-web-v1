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
const xml = readFileSync(publishPath, "utf8");
const profileMatch = xml.match(
  /profileName="ceyloe - Zip Deploy"[^>]*publishUrl="([^"]+)"[^>]*userName="([^"]+)"[^>]*userPWD="([^"]+)"/,
);
const siteUrlMatch = xml.match(/destinationAppUrl="([^"]+)"/);
const [, publishHost, userName, password] = profileMatch;
const siteUrl = siteUrlMatch[1];
const auth = `Basic ${Buffer.from(`${userName}:${password}`).toString("base64")}`;

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

const missing = Object.entries(appSettings)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.error("Missing values in .env.local:", missing.join(", "));
  process.exit(1);
}

const res = await fetch(`https://${publishHost}/api/settings`, {
  method: "POST",
  headers: { Authorization: auth, "Content-Type": "application/json" },
  body: JSON.stringify(appSettings),
});

console.log("POST /api/settings:", res.status, res.ok ? "ok" : await res.text());

const getRes = await fetch(`https://${publishHost}/api/settings`, {
  headers: { Authorization: auth },
});
if (getRes.ok) {
  const current = await getRes.json();
  const keys = [
    "MONGODB_URI",
    "MONGODB_DB_NAME",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  ];
  for (const key of keys) {
    console.log(key, current[key] ? "set" : "missing");
  }
}

// Restart app so settings take effect
const restartRes = await fetch(`https://${publishHost}/api/app/restart`, {
  method: "POST",
  headers: { Authorization: auth },
});
console.log("Restart:", restartRes.status, restartRes.ok ? "ok" : await restartRes.text());
console.log("Site:", siteUrl);
