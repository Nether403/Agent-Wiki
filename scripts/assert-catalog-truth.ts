import fs from "fs";
import path from "path";

interface CatalogContract {
  ruleSource: string;
  componentSource: string;
  mcpEntry: string;
  mcpTools: string[];
  retiredMcpTools: string[];
  forbiddenDocPhrases: string[];
  compileSeed?: string;
}

interface CatalogSeed {
  slugs: string[];
  sources: Record<string, string>;
  utils: string;
}

interface CatalogStats {
  componentCount: number;
  ruleCount: number;
  mcpTools: string[];
  categories: Record<string, number>;
}

const root = path.resolve(__dirname, "..");

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf-8");
}

function fail(message: string): never {
  console.error(`❌ catalog truth: ${message}`);
  process.exit(1);
}

function main() {
  const contract = JSON.parse(read("catalog-contract.json")) as CatalogContract;
  const statsPath = path.join(root, "catalog-stats.json");
  if (!fs.existsSync(statsPath)) {
    fail("catalog-stats.json missing. Run `pnpm build:registry` first.");
  }
  const stats = JSON.parse(fs.readFileSync(statsPath, "utf-8")) as CatalogStats;

  const registry = JSON.parse(read("apps/docs/public/r/registry.json")) as Array<{ name: string; category?: string }>;
  if (stats.componentCount !== registry.length) {
    fail(`catalog-stats.componentCount (${stats.componentCount}) != registry.json length (${registry.length})`);
  }

  const ruleSrc = read(contract.ruleSource);
  const ruleIds = [...ruleSrc.matchAll(/id:\s*"SLOP-(\d+)"/g)].map((m) => m[1]);
  if (ruleIds.length !== stats.ruleCount) {
    fail(`catalog-stats.ruleCount (${stats.ruleCount}) != SLOP ids in ${contract.ruleSource} (${ruleIds.length})`);
  }
  if (ruleIds.length !== 50) {
    fail(`Expected 50 SLOP rules, found ${ruleIds.length}`);
  }

  const serverSrc = read(contract.mcpEntry);
  const registered = [...serverSrc.matchAll(/registerTool\(\s*(?:\n\s*)?"([^"]+)"/g)].map((m) => m[1]);
  const expected = contract.mcpTools;
  const missing = expected.filter((t) => !registered.includes(t));
  const extra = registered.filter((t) => !expected.includes(t));
  if (missing.length || extra.length) {
    fail(`MCP tools drifted. missing=${missing.join(",") || "—"} extra=${extra.join(",") || "—"}`);
  }

  const retiredStillLive = contract.retiredMcpTools.filter((t) => registered.includes(t));
  if (retiredStillLive.length) {
    fail(`Retired MCP tools are still registered: ${retiredStillLive.join(", ")}`);
  }

  const seedRel = contract.compileSeed ?? "catalog-seed.json";
  const seedPath = path.join(root, seedRel);
  if (!fs.existsSync(seedPath)) {
    fail(`${seedRel} missing.`);
  }
  const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8")) as CatalogSeed;
  if (!Array.isArray(seed.slugs) || seed.slugs.length === 0) {
    fail(`${seedRel} has no slugs.`);
  }
  const registryNames = new Set(registry.map((item) => item.name));
  for (const slug of seed.slugs) {
    if (!registryNames.has(slug)) {
      fail(`compile seed slug "${slug}" is not in registry.json`);
    }
    const sourceRel = seed.sources?.[slug];
    if (!sourceRel || !fs.existsSync(path.join(root, sourceRel))) {
      fail(`compile seed source missing for "${slug}": ${sourceRel ?? "(unset)"}`);
    }
  }
  if (seed.utils && !fs.existsSync(path.join(root, seed.utils))) {
    fail(`compile seed utils missing: ${seed.utils}`);
  }

  const docsToScan = [
    "README.md",
    "SKILL.md",
    "CATALOG.md",
    ".github/workflows/audit-guardrails.yml",
    "packages/mcp-server/README.md",
    "packages/audit-linter/README.md",
  ];
  for (const doc of docsToScan) {
    const body = read(doc);
    for (const phrase of contract.forbiddenDocPhrases) {
      if (body.includes(phrase)) {
        fail(`${doc} still contains stale claim: "${phrase}"`);
      }
    }
    for (const tool of contract.retiredMcpTools) {
      if (body.includes(tool)) {
        fail(`${doc} still advertises retired MCP tool: ${tool}`);
      }
    }
  }

  console.log("catalog truth: OK");
  console.log(`  components: ${stats.componentCount}`);
  console.log(`  rules:      ${stats.ruleCount} (${contract.ruleSource})`);
  console.log(`  mcp tools:  ${registered.length}`);
  console.log(`  compile seed: ${seed.slugs.join(", ")}`);
  console.log(`  categories: ${JSON.stringify(stats.categories)}`);
}

main();
