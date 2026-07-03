import { readFileSync } from "node:fs";

const publishPath =
  process.argv[2] ??
  "C:\\Users\\Thilanka.chameera\\AppData\\Local\\Temp\\ceyloe.PublishSettings";
const xml = readFileSync(publishPath, "utf8");
const profileMatch = xml.match(
  /profileName="ceyloe - Zip Deploy"[^>]*publishUrl="([^"]+)"[^>]*userName="([^"]+)"[^>]*userPWD="([^"]+)"/,
);
const [, publishHost, userName, password] = profileMatch;
const auth = `Basic ${Buffer.from(`${userName}:${password}`).toString("base64")}`;

const res = await fetch(`https://${publishHost}/api/deployments/latest`, {
  headers: { Authorization: auth },
});
const deploy = await res.json();
console.log(JSON.stringify(deploy, null, 2));

if (deploy.log_url) {
  const logRes = await fetch(deploy.log_url, { headers: { Authorization: auth } });
  const entries = await logRes.json();
  console.log("\n--- LOG ---\n");
  for (const entry of entries) {
    console.log(entry.message);
    if (entry.details_url) {
      const detailRes = await fetch(entry.details_url, { headers: { Authorization: auth } });
      console.log(await detailRes.text());
    }
  }
}
