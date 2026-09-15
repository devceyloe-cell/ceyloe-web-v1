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

for (const lock of ["status.lock", "hooks.lock"]) {
  const del = await fetch(`https://${publishHost}/api/vfs/site/locks/${lock}`, {
    method: "DELETE",
    headers,
  });
  console.log("DELETE", lock, del.status, (await del.text()).slice(0, 200));
}

await fetch(`https://${publishHost}/api/app/restart`, { method: "POST", headers });
console.log("Restart requested.");
