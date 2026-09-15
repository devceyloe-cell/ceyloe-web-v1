import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

for (const name of ["azure-deploy", "ceyloe-azure.zip"]) {
  const path = join(root, name);
  if (existsSync(path)) {
    rmSync(path, { recursive: true, force: true });
    console.log("Removed:", path);
  }
}
