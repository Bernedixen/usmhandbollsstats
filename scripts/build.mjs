import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const filesToCopy = [
  "index.html",
  "app.js",
  "styles.css",
  "manifest.webmanifest",
];

await fs.rm(distDir, { recursive: true, force: true });
await fs.mkdir(path.join(distDir, "data"), { recursive: true });

for (const file of filesToCopy) {
  await fs.copyFile(path.join(rootDir, file), path.join(distDir, file));
}

await copyDirectory(path.join(rootDir, "data"), path.join(distDir, "data"));

console.log(`Built web assets into ${distDir}`);

async function copyDirectory(sourceDir, targetDir) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  await fs.mkdir(targetDir, { recursive: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
      continue;
    }

    await fs.copyFile(sourcePath, targetPath);
  }
}
