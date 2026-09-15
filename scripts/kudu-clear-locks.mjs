import { readFileSync } from "node:fs";
import { join } from "node:path";

const publishPath =
  "C:\\Users\\Thilanka.chameera\\AppData\\Local\\Temp\\ceyloe.PublishSettings";
const xml = readFileSync(publishPath, "utf8");
const profileMatch = xml.match(
  /profileName="ceyloe - Zip Deploy"[^>]*publishUrl="([^"]+)"[^>]*userName="([^"]+)"[^>]*userPWD="([^"]+)"/,
);
const [, publishHost, userName, password] = profileMatch;
const auth = Buffer.from(`${userName}:${password}`).toString("base64");
const headers = {
  Authorization: `Basic ${auth}`,
  "Content-Type": "application/json",
};

async function run(command) {
  const res = await fetch(`https://${publishHost}/api/command`, {
    method: "POST",
    headers,
    body: JSON.stringify({ command, dir: "/home/site/wwwroot" }),
  });
  const body = await res.json();
  console.log(command);
  console.log(body.Output || body.Error || body);
}

await run("df -h /home");
await run("du -sh /home/site/wwwroot 2>/dev/null || du -sh .");

console.log("Restarting via az...");
import { spawnSync } from "node:child_process";
spawnSync(
  "az",
  [
    "webapp",
    "restart",
    "--resource-group",
    "rg-asiri-health-dev-southeastasia-001",
    "--name",
    "ceyloe",
  ],
  { stdio: "inherit", shell: true },
);

await new Promise((r) => setTimeout(r, 60000));

const zipPath = join(process.cwd(), "ceyloe-azure.zip");
const zip = readFileSync(zipPath);
const deployRes = await fetch(
  `https://${publishHost}/api/zipdeploy?isAsync=true&clean=true`,
  {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/zip",
    },
    body: zip,
  },
);
console.log("Deploy:", deployRes.status, await deployRes.text());
