/**
 * Back up the MongoDB database to a local folder using mongodump.
 *
 * Usage:
 *   npm run db:backup
 *   node --env-file=.env.local scripts/backup-mongodb.mjs
 *   node --env-file=.env.local scripts/backup-mongodb.mjs --out=D:\backups
 *
 * Requires MongoDB Database Tools (mongodump) on PATH, or installed at the
 * default Windows location under Program Files\MongoDB\Tools.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { platform } from "node:os";

function parseArgs(argv) {
  const args = { outRoot: null };
  for (const arg of argv) {
    if (arg.startsWith("--out=")) {
      args.outRoot = arg.slice("--out=".length).trim();
    }
  }
  return args;
}

function findMongodump() {
  const fromPath = spawnSync(
    platform() === "win32" ? "where.exe" : "which",
    ["mongodump"],
    { encoding: "utf8" },
  );
  if (fromPath.status === 0) {
    const first = fromPath.stdout.trim().split(/\r?\n/)[0];
    if (first && existsSync(first)) return first;
  }

  if (platform() === "win32") {
    const toolsRoot = "C:\\Program Files\\MongoDB\\Tools";
    if (existsSync(toolsRoot)) {
      const versions = readdirSync(toolsRoot)
        .map((name) => join(toolsRoot, name, "bin", "mongodump.exe"))
        .filter((p) => existsSync(p))
        .sort()
        .reverse();
      if (versions[0]) return versions[0];
    }
  }

  return null;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function folderSize(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) total += folderSize(full);
    else total += statSync(full).size;
  }
  return total;
}

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function main() {
  const { outRoot } = parseArgs(process.argv.slice(2));
  const uri = process.env.MONGODB_URI?.trim();
  const dbName = process.env.MONGODB_DB_NAME?.trim() || "ceyloe";

  if (!uri) {
    console.error("MONGODB_URI is not set. Use: npm run db:backup");
    process.exit(1);
  }

  const mongodump = findMongodump();
  if (!mongodump) {
    console.error(
      "mongodump not found. Install MongoDB Database Tools:\n" +
        "  winget install --id MongoDB.DatabaseTools -e\n" +
        "  https://www.mongodb.com/try/download/database-tools",
    );
    process.exit(1);
  }

  const root = resolve(outRoot || join(process.cwd(), "backups"));
  const outDir = join(root, `${dbName}-${stamp()}`);
  mkdirSync(outDir, { recursive: true });

  console.log(`Backing up database "${dbName}"…`);
  console.log(`Output: ${outDir}`);

  const result = spawnSync(
    mongodump,
    ["--uri", uri, "--db", dbName, "--out", outDir],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0) {
    console.error(`mongodump failed (exit ${result.status ?? "unknown"}).`);
    process.exit(result.status ?? 1);
  }

  const dbDir = join(outDir, dbName);
  const size = existsSync(dbDir) ? folderSize(dbDir) : folderSize(outDir);
  const files = existsSync(dbDir)
    ? readdirSync(dbDir).filter((n) => n.endsWith(".bson"))
    : [];

  console.log(`\nBackup complete.`);
  console.log(`Location: ${outDir}`);
  console.log(`Size:     ${formatBytes(size)}`);
  if (files.length) {
    console.log(`Collections (${files.length}): ${files.map((f) => f.replace(/\.bson$/, "")).join(", ")}`);
  }
}

main();
