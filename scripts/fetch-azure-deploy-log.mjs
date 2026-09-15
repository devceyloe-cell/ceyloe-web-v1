import { readFileSync } from "node:fs";

const publishPath =
  "C:\\Users\\Thilanka.chameera\\AppData\\Local\\Temp\\ceyloe.PublishSettings";
const xml = readFileSync(publishPath, "utf8");
const profileMatch = xml.match(
  /profileName="ceyloe - Zip Deploy"[^>]*publishUrl="([^"]+)"[^>]*userName="([^"]+)"[^>]*userPWD="([^"]+)"/,
);
const [, publishHost, userName, password] = profileMatch;
const auth = Buffer.from(`${userName}:${password}`).toString("base64");
const headers = { Authorization: `Basic ${auth}` };

const latestRes = await fetch(`https://${publishHost}/api/deployments/latest`, { headers });
const latest = await latestRes.json();
console.log("Latest deployment:", JSON.stringify(latest, null, 2));

const logRes = await fetch(`https://${publishHost}/api/deployments/${latest.id}/log`, { headers });
const text = await logRes.text();
try {
  const logs = JSON.parse(text);
  if (Array.isArray(logs)) {
    for (const entry of logs) console.log(entry.message ?? JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(logs, null, 2));
  }
} catch {
  console.log(text.slice(0, 8000));
}
