import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

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
  console.log(">", command);
  if (body.Output) console.log(body.Output.trim());
  if (body.Error) console.log(body.Error.trim());
  return body;
}

await run("du -sh /home/site/wwwroot/* 2>/dev/null | sort -h | tail -10");
await run("rm -rf /home/site/wwwroot/*");
await run("rm -f /home/site/locks/status.lock /home/site/locks/hooks.lock");
await run("df -h /home");

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

await new Promise((r) => setTimeout(r, 45000));

const zipPath = join(process.cwd(), "ceyloe-azure.zip");
const zip = readFileSync(zipPath);
console.log("Deploying MB:", (zip.length / 1024 / 1024).toFixed(2));

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
console.log("Deploy accepted:", deployRes.status, await deployRes.text());

for (let i = 0; i < 40; i++) {
  await new Promise((r) => setTimeout(r, 10000));
  const statusRes = await fetch(`https://${publishHost}/api/deployments/latest`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!statusRes.ok) continue;
  const status = await statusRes.json();
  console.log("Status:", status.status, status.status_text ?? "");
  if (status.status === 4) {
    console.log("Deployment complete: https://ceyloe-gzaxamckdtakgbdn.canadacentral-01.azurewebsites.net");
    process.exit(0);
  }
  if (status.status === 3) {
    console.error("Deployment failed:", status.id);
    process.exit(1);
  }
}

process.exit(1);
