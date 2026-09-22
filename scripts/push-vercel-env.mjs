import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const cwd = process.argv[2] || process.cwd();
const content = fs.readFileSync(path.join(cwd, ".env.local"), "utf8");

function parseEnv(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1);
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = parseEnv(content);
// Production site URL for Stripe redirects (override local)
env.NEXT_PUBLIC_SITE_URL = "https://ceyloe-web.vercel.app";

const skip = new Set([
  "VERCEL_OIDC_TOKEN",
]);

const keys = Object.keys(env).filter((k) => {
  if (skip.has(k)) return false;
  const v = env[k];
  return v !== undefined && String(v).length > 0;
});

function run(cmd, args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    if (input != null) {
      child.stdin.write(input);
      child.stdin.end();
    }
    child.on("close", (code) => {
      resolve({ code, out, err });
    });
    child.on("error", reject);
  });
}

const envs = ["production", "preview", "development"];
const publicPrefix = "NEXT_PUBLIC_";

for (const key of keys) {
  const value = env[key];
  const isPublic = key.startsWith(publicPrefix);
  for (const target of envs) {
    const args = [
      "vercel",
      "env",
      "add",
      key,
      target,
      "--force",
      "--yes",
    ];
    if (isPublic) args.push("--no-sensitive");
    const { code, out, err } = await run("npx", args, value + "\n");
    const msg = (out + err).trim().split(/\r?\n/).slice(-2).join(" | ");
    console.log(`${key}@${target}: exit=${code} ${msg}`);
  }
}

console.log(`Done. Pushed ${keys.length} keys × ${envs.length} envs.`);
