import { readFileSync } from "node:fs";

const publishPath =
  process.argv[2] ??
  "C:\\Users\\Thilanka.chameera\\AppData\\Local\\Temp\\ceyloe.PublishSettings";
const xml = readFileSync(publishPath, "utf8");
const profileMatch = xml.match(
  /profileName="ceyloe - Zip Deploy"[^>]*publishUrl="([^"]+)"[^>]*userName="([^"]+)"[^>]*userPWD="([^"]+)"/,
);
if (!profileMatch) {
  console.error("Could not parse Zip Deploy profile.");
  process.exit(1);
}
const [, publishHost, userName, password] = profileMatch;
const auth = Buffer.from(`${userName}:${password}`).toString("base64");
const statusRes = await fetch(`https://${publishHost}/api/deployments/latest`, {
  headers: { Authorization: `Basic ${auth}` },
});
console.log("status:", statusRes.status);
console.log(JSON.stringify(await statusRes.json(), null, 2));
