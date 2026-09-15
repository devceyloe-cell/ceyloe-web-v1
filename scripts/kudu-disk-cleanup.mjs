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

const listRes = await fetch(`https://${publishHost}/api/vfs/site/wwwroot/`, { headers });
const entries = await listRes.json();
console.log("wwwroot entries:");
for (const entry of entries) {
  console.log(entry.name, entry.size, entry.mime);
}

async function run(command) {
  const res = await fetch(`https://${publishHost}/api/command`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ command, dir: "/home/site/wwwroot" }),
  });
  const body = await res.json();
  console.log(">", command, body.ExitCode, (body.Output || body.Error || "").trim());
}

await run("rm -rf azure-deploy");
await run("rm -rf node_modules");
await run("rm -rf public");
await run("rm -rf .next");
await run("du -sh .");
await run("df -h /home");
