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

const res = await fetch(`https://${publishHost}/api/command`, {
  method: "POST",
  headers: { Authorization: auth, "Content-Type": "application/json" },
  body: JSON.stringify({
    command: "printenv MONGODB_URI MONGODB_DB_NAME STRIPE_SECRET_KEY NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    dir: "/home/site/wwwroot",
  }),
});

console.log(await res.text());
