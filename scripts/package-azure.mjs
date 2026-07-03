import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const outDir = join(root, "azure-deploy");
const azureSiteUrl =
  process.env.AZURE_SITE_URL ??
  "https://ceyloe-gzaxamckdtakgbdn.canadacentral-01.azurewebsites.net";

function loadEnvFile(path) {
  const vars = {};
  if (!existsSync(path)) return vars;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars;
}

if (!existsSync(standaloneDir)) {
  console.error("Missing .next/standalone — run `npm run build` first.");
  process.exit(1);
}

if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true });
}

mkdirSync(outDir, { recursive: true });
cpSync(standaloneDir, outDir, { recursive: true });
cpSync(join(root, ".next", "static"), join(outDir, ".next", "static"), { recursive: true });
cpSync(join(root, "public"), join(outDir, "public"), { recursive: true });

for (const extra of ["ceyloe-azure.zip"]) {
  const p = join(outDir, extra);
  if (existsSync(p)) rmSync(p);
}

const pkgPath = join(outDir, "package.json");
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.scripts = { ...pkg.scripts, start: "node server.js" };
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
}

const localEnv = loadEnvFile(join(root, ".env.local"));
const productionEnv = {
  ADMIN_JWT_SECRET: localEnv.ADMIN_JWT_SECRET,
  MONGODB_URI: localEnv.MONGODB_URI,
  MONGODB_DB_NAME: localEnv.MONGODB_DB_NAME ?? "ceyloe",
  STRIPE_SECRET_KEY: localEnv.STRIPE_SECRET_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: localEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SITE_URL: azureSiteUrl,
};

const envLines = Object.entries(productionEnv)
  .filter(([, value]) => Boolean(value))
  .map(([key, value]) => `${key}=${value}`);

if (envLines.length) {
  writeFileSync(join(outDir, ".env.production"), `${envLines.join("\n")}\n`, "utf8");
  console.log("Wrote .env.production for Azure runtime");
}

writeFileSync(
  join(outDir, "startup.sh"),
  `#!/bin/sh
cd "$(dirname "$0")"
export NODE_ENV=production
export PORT="\${PORT:-8080}"
exec node server.js
`,
  "utf8",
);

writeFileSync(
  join(outDir, "web.config"),
  `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="Node">
          <match url="/*" />
          <action type="Rewrite" url="server.js" />
        </rule>
      </rules>
    </rewrite>
    <iisnode nodeProcessCommandLine="node" watchedFiles="web.config;*.js" />
  </system.webServer>
</configuration>
`,
  "utf8",
);

console.log("Azure package ready:", outDir);
console.log("Zip azure-deploy/ and deploy to Azure App Service (Linux: startup command = startup.sh)");

const zipPath = join(root, "ceyloe-azure.zip");
if (existsSync(zipPath)) rmSync(zipPath);

const tar = spawnSync("tar", ["-a", "-cf", zipPath, "-C", outDir, "."], {
  stdio: "inherit",
});

if (tar.status !== 0) {
  console.error("Failed to create ceyloe-azure.zip via tar — install tar or zip manually.");
  process.exit(1);
}

console.log("Created:", zipPath);
