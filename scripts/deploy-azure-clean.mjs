import { readFileSync } from "node:fs";
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
const zip = readFileSync(zipPath);

console.log("Deploying with clean=true, size MB:", (zip.length / 1024 / 1024).toFixed(2));
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
  const status = await statusRes.json();
  console.log("Status:", status.status, status.id, status.status_text ?? "");
  if (status.status === 4) {
    console.log("Deployment complete.");
    process.exit(0);
  }
  if (status.status === 3) {
    console.error("Deployment failed.");
    process.exit(1);
  }
}

console.error("Timed out waiting for deployment.");
process.exit(1);
