/**
 * Push variables from .env.local to linked Vercel project (all environments).
 *
 * Usage: node scripts/sync-vercel-env.mjs [.env.local]
 */
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const SKIP = new Set(["VERCEL_OIDC_TOKEN"]);
const envFile = process.argv[2] || ".env.local";
const raw = await readFile(envFile, "utf8");
const vars = {};

for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (!m) continue;
  const name = m[1];
  let value = m[2];
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  if (SKIP.has(name)) continue;
  vars[name] = value;
}

const targets = "production,preview,development";
let ok = 0;
let fail = 0;

for (const [name, value] of Object.entries(vars)) {
  const args = ["env", "add", name, targets, "--yes", "--force", "--value", value];
  if (name.startsWith("NEXT_PUBLIC_")) {
    args.push("--no-sensitive");
  } else {
    args.push("--sensitive");
  }
  const r = spawnSync("vercel", args, {
    stdio: "pipe",
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (r.status === 0) {
    console.log(`✓ ${name}`);
    ok++;
  } else {
    console.error(`✗ ${name}:`, (r.stderr || r.stdout || "").trim());
    fail++;
  }
}

console.log(`\nDone: ${ok} added, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
