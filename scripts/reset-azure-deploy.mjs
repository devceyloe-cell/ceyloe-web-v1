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

console.log("Restarting app...");
await fetch(`https://${publishHost}/api/app/restart`, { method: "POST", headers });
await new Promise((r) => setTimeout(r, 15000));

console.log("Stopping sync triggers...");
await fetch(`https://${publishHost}/api/deployments/sync`, { method: "DELETE", headers });

console.log("Deployments:");
const listRes = await fetch(`https://${publishHost}/api/deployments`, { headers });
const list = await listRes.json();
for (const d of list.slice(0, 3)) {
  console.log(d.id, "status", d.status, "complete", d.complete, "active", d.active);
}
