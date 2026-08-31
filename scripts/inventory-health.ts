#!/usr/bin/env tsx
/**
 * Grade histogram over packages/registry/src.
 * Informational only — does not fail CI. Use this to curate keep/merge/drop.
 */

import fs from "fs";
import path from "path";
import { evaluateSource, RULE_COUNT } from "../packages/audit-linter/src/evaluate";

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

function main() {
  const files = walk(srcRoot);
  const grades: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, F: 0 };
  const ruleHits: Record<string, number> = {};
  const curationQueue: Array<{ file: string; score: number; high: string[] }> = [];

  for (const file of files) {
    const rel = path.relative(srcRoot, file);
    const result = evaluateSource(rel, fs.readFileSync(file, "utf-8"));
    grades[result.grade] = (grades[result.grade] || 0) + 1;
    for (const finding of result.findings) {
      ruleHits[finding.ruleId] = (ruleHits[finding.ruleId] || 0) + 1;
    }
    const highOther = result.findings
      .filter((f) => f.severity === "High" && f.ruleId !== "SLOP-020")
      .map((f) => f.ruleId);
    if (highOther.length > 0) {
      curationQueue.push({ file: rel, score: result.healthScore, high: [...new Set(highOther)] });
    }
  }

  const topRules = Object.entries(ruleHits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  console.log("catalog inventory (informational, not a CI gate)");
  console.log(`  source: packages/registry/src`);
  console.log(`  files:  ${files.length}`);
  console.log(`  rules:  ${RULE_COUNT}`);
  console.log(`  grades: ${JSON.stringify(grades)}`);
  console.log("  top rules:");
  for (const [id, count] of topRules) {
    console.log(`    ${id}: ${count}`);
  }
  console.log(`  high-severity excluding SLOP-020 (license): ${curationQueue.length} files`);
  for (const row of curationQueue.slice(0, 25)) {
    console.log(`    ${row.score}/100  ${row.file}  [${row.high.join(", ")}]`);
  }
  if (curationQueue.length > 25) {
    console.log(`    … ${curationQueue.length - 25} more`);
  }
}

main();
