import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const publishPath =
  "C:\\Users\\Thilanka.chameera\\AppData\\Local\\Temp\\ceyloe.PublishSettings";
const xml = readFileSync(publishPath, "utf8");
const profileMatch = xml.match(
  /profileName="ceyloe - Zip Deploy"[^>]*publishUrl="([^"]+)"[^>]*userName="([^"]+)"[^>]*userPWD="([^"]+)"/,
);
const [, publishHost, userName, password] = profileMatch;
const auth = Buffer.from(`${userName}:${password}`).toString("base64");
const headers = { Authorization: `Basic ${auth}` };

console.log("Waiting 3 minutes for stuck deployment...");
await new Promise((r) => setTimeout(r, 180000));

const locks = await fetch(`https://${publishHost}/api/vfs/site/locks/`, { headers });
console.log("Locks:", await locks.text());

const latestRes = await fetch(`https://${publishHost}/api/deployments/latest`, { headers });
console.log("Latest:", JSON.stringify(await latestRes.json(), null, 2));

const deploy = spawnSync(
  "npm",
  ["run", "deploy:azure", "--", publishPath],
  { stdio: "inherit", shell: true },
);
process.exit(deploy.status ?? 1);
