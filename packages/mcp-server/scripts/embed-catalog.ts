import fs from "fs";
import path from "path";

const pkgRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(pkgRoot, "../..");
const destDir = path.join(pkgRoot, "catalog");
const destFile = path.join(destDir, "registry.json");

const sources = [
  path.join(repoRoot, "apps/docs/public/r/registry.json"),
  path.join(repoRoot, "packages/registry/dist/r/registry.json"),
];

const source = sources.find((candidate) => fs.existsSync(candidate));

if (!source) {
  const message =
    "MCP catalog embed: compiled registry.json not found. Run `pnpm build:registry` first.";
  if (process.env.CI) {
    throw new Error(message);
  }
  console.warn(`⚠️  ${message} Stdio will fall back to workspace paths or the tiny embedded stub.`);
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(source, destFile);

const bytes = fs.statSync(destFile).size;
let count = 0;
try {
  const parsed: unknown = JSON.parse(fs.readFileSync(destFile, "utf-8"));
  count = Array.isArray(parsed) ? parsed.length : 0;
} catch {
  throw new Error(`MCP catalog embed: copied file is not valid JSON: ${destFile}`);
}

if (count === 0) {
  throw new Error(`MCP catalog embed: ${source} parsed as an empty catalog.`);
}

console.log(`MCP catalog embed: ${count} items (${bytes} bytes) → ${path.relative(repoRoot, destFile)}`);
