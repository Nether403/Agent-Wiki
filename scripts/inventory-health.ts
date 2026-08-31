#!/usr/bin/env tsx
/**
 * Keep / drop / experimental table over packages/registry/src.
 * Informational only — does not fail CI. Promote slugs into catalog-core.json explicitly.
 */

import fs from "fs";
import path from "path";
import { evaluateSource, RULE_COUNT } from "../packages/audit-linter/src/evaluate";
import { loadCatalogCoreSlugs } from "../packages/cli/src/utils/catalog-core";

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "lib", "tokens"]);
const srcRoot = path.resolve(__dirname, "../packages/registry/src");

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith(".")) walk(full, out);
    } else if (/\.(tsx|ts)$/.test(entry.name) && !entry.name.endsWith(".d.ts") && entry.name !== "utils.ts") {
      out.push(full);
    }
  }
  return out;
}

function slugFromFile(file: string): string {
  return path.basename(file, path.extname(file));
}

function main() {
  const files = walk(srcRoot);
  const core = loadCatalogCoreSlugs();
  const grades: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, F: 0 };
  const ruleHits: Record<string, number> = {};

  const keep: Array<{ slug: string; file: string; score: number }> = [];
  const review: Array<{ slug: string; file: string; score: number; high: string[] }> = [];
  const drop: Array<{ slug: string; file: string; score: number; high: string[] }> = [];
  const experimental: Array<{ slug: string; file: string; score: number }> = [];

  for (const file of files) {
    const rel = path.relative(srcRoot, file);
    const slug = slugFromFile(file);
    const result = evaluateSource(rel, fs.readFileSync(file, "utf-8"));
    grades[result.grade] = (grades[result.grade] || 0) + 1;
    for (const finding of result.findings) {
      ruleHits[finding.ruleId] = (ruleHits[finding.ruleId] || 0) + 1;
    }
    const highOther = [
      ...new Set(
        result.findings
          .filter((f) => f.severity === "High" && f.ruleId !== "SLOP-020")
          .map((f) => f.ruleId)
      ),
    ];
    const inCore = core.has(slug);

    if (inCore && highOther.length > 0) {
      review.push({ slug, file: rel, score: result.healthScore, high: highOther });
    } else if (inCore) {
      keep.push({ slug, file: rel, score: result.healthScore });
    } else if (highOther.length > 0) {
      drop.push({ slug, file: rel, score: result.healthScore, high: highOther });
    } else {
      experimental.push({ slug, file: rel, score: result.healthScore });
    }
  }

  keep.sort((a, b) => a.slug.localeCompare(b.slug));
  review.sort((a, b) => a.score - b.score);
  drop.sort((a, b) => a.score - b.score || a.slug.localeCompare(b.slug));
  experimental.sort((a, b) => a.slug.localeCompare(b.slug));

  const topRules = Object.entries(ruleHits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  console.log("catalog inventory (informational, not a CI gate)");
  console.log(`  source: packages/registry/src`);
  console.log(`  files:  ${files.length}`);
  console.log(`  rules:  ${RULE_COUNT}`);
  console.log(`  core:   ${core.size} slugs in catalog-core.json`);
  console.log(`  grades: ${JSON.stringify(grades)}`);
  console.log("  top rules:");
  for (const [id, count] of topRules) {
    console.log(`    ${id}: ${count}`);
  }

  console.log(`\nKEEP (trusted core, no high-severity except license SLOP-020): ${keep.length}`);
  for (const row of keep) {
    console.log(`    ${row.score}/100  ${row.slug}  ${row.file}`);
  }

  console.log(`\nREVIEW (in catalog-core.json but has high-severity flags): ${review.length}`);
  if (review.length === 0) {
    console.log("    (none)");
  }
  for (const row of review) {
    console.log(`    ${row.score}/100  ${row.slug}  ${row.file}  [${row.high.join(", ")}]`);
  }

  console.log(`\nDROP candidates (not core, high-severity excluding SLOP-020): ${drop.length}`);
  const dropPreview = drop.slice(0, 40);
  for (const row of dropPreview) {
    console.log(`    ${row.score}/100  ${row.slug}  ${row.file}  [${row.high.join(", ")}]`);
  }
  if (drop.length > dropPreview.length) {
    console.log(`    … ${drop.length - dropPreview.length} more`);
  }

  console.log(`\nEXPERIMENTAL (not core, no drop flag): ${experimental.length}`);
  console.log("    Promote into catalog-core.json only after dogfood + compile/axe. Sample:");
  for (const row of experimental.slice(0, 15)) {
    console.log(`    ${row.score}/100  ${row.slug}  ${row.file}`);
  }
  if (experimental.length > 15) {
    console.log(`    … ${experimental.length - 15} more`);
  }

  const missingCore = [...core].filter((slug) => !files.some((file) => slugFromFile(file) === slug));
  if (missingCore.length > 0) {
    console.log(`\n⚠️  catalog-core.json slugs with no matching source file: ${missingCore.join(", ")}`);
  }
}

main();
