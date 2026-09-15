import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const publishPath =
  "C:\\Users\\Thilanka.chameera\\AppData\\Local\\Temp\\ceyloe.PublishSettings";
const zipPath = join(process.cwd(), "ceyloe-azure.zip");
const xml = readFileSync(publishPath, "utf8");
const profileMatch = xml.match(
  /profileName="ceyloe - Zip Deploy"[^>]*publishUrl="([^"]+)"[^>]*userName="([^"]+)"[^>]*userPWD="([^"]+)"/,
);
const [, publishHost, userName, password] = profileMatch;
const auth = Buffer.from(`${userName}:${password}`).toString("base64");

console.log("ZIP size MB:", (statSync(zipPath).size / 1024 / 1024).toFixed(2));

const listRes = await fetch(`https://${publishHost}/api/deployments`, {
  headers: { Authorization: `Basic ${auth}` },
});
const list = await listRes.json();
console.log("Recent deployments:");
for (const d of list.slice(0, 5)) {
  console.log(d.id, "status", d.status, d.end_time, d.message);
}

console.log("Sync zip deploy...");
const zip = readFileSync(zipPath);
const deployRes = await fetch(`https://${publishHost}/api/zipdeploy`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/zip",
  },
  body: zip,
});
console.log("Deploy response:", deployRes.status, await deployRes.text());

const latestRes = await fetch(`https://${publishHost}/api/deployments/latest`, {
  headers: { Authorization: `Basic ${auth}` },
});
console.log("Latest:", JSON.stringify(await latestRes.json(), null, 2));
