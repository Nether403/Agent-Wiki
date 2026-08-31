import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

interface CatalogSeed {
  utils: string;
  slugs: string[];
  sources: Record<string, string>;
}

const repoRoot = path.resolve(__dirname, "..");
const seed = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "catalog-seed.json"), "utf-8")
) as CatalogSeed;
const fixtureDir = path.join(repoRoot, "packages/eval-harness/fixture");
const generatedDir = path.join(fixtureDir, ".generated");
const tsconfigPath = path.join(fixtureDir, "tsconfig.json");

function fail(message: string): never {
  console.error(`❌ compile-seed: ${message}`);
  process.exit(1);
}

if (!Array.isArray(seed.slugs) || seed.slugs.length === 0) {
  fail("catalog-seed.json has no slugs.");
}

fs.rmSync(generatedDir, { recursive: true, force: true });
fs.mkdirSync(generatedDir, { recursive: true });

const utilsSrc = path.join(repoRoot, seed.utils);
if (!fs.existsSync(utilsSrc)) {
  fail(`utils source missing: ${seed.utils}`);
}
fs.copyFileSync(utilsSrc, path.join(generatedDir, "utils.ts"));

const exports: string[] = [];

for (const slug of seed.slugs) {
  const rel = seed.sources[slug];
  if (!rel) {
    fail(`catalog-seed.json has no source path for slug "${slug}".`);
  }
  const abs = path.join(repoRoot, rel);
  if (!fs.existsSync(abs)) {
    fail(`source missing for ${slug}: ${rel}`);
  }
  let source = fs.readFileSync(abs, "utf-8");
  source = source.replace(/from\s+["']\.\.\/lib\/utils["']/g, 'from "./utils"');
  const destName = `${slug}.tsx`;
  fs.writeFileSync(path.join(generatedDir, destName), source, "utf-8");
  exports.push(`export * from "./${slug}";`);
}

fs.writeFileSync(
  path.join(generatedDir, "index.ts"),
  `${exports.join("\n")}\nexport { cn } from "./utils";\n`,
  "utf-8"
);

console.log(`compile-seed: ${seed.slugs.length} slugs → ${path.relative(repoRoot, generatedDir)}`);

try {
  execFileSync("pnpm", ["exec", "tsc", "--noEmit", "-p", tsconfigPath], {
    cwd: repoRoot,
    stdio: "inherit",
  });
} catch {
  fail("tsc --noEmit failed for the compile seed fixture.");
}

console.log("compile-seed: tsc --noEmit OK");
