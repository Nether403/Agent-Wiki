#!/usr/bin/env node
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Headless Eval Harness CLI
 */

import fs from "fs";
import path from "path";
import { runEvalHarness } from "./index";

function main() {
  const args = process.argv.slice(2);
  const rootDir = path.resolve(__dirname, "../../..");
  const targets = (args.length > 0 ? args : ["packages/registry/src"]).map((t) => {
    if (path.isAbsolute(t)) return t;
    if (fs.existsSync(path.resolve(process.cwd(), t))) return path.resolve(process.cwd(), t);
    return path.resolve(rootDir, t);
  });

  console.log("=============================================================");
  console.log("🧪  DESIGN AGENT WIKI: HEADLESS EVALUATION HARNESS");
  console.log(`📁  Target Paths: ${targets.join(", ")}`);
  console.log("=============================================================");

  const summary = runEvalHarness(targets);

  console.log(`\n📊  Evaluation Results:`);
  console.log(`   - Components Evaluated:  ${summary.totalEvaluated}`);
  console.log(`   - Passed Integrity Gate: ${summary.passedCount}`);
  console.log(`   - Failed Gate:           ${summary.failedCount}`);
  console.log(`   - Overall Health Score:  ${summary.overallHealthScore}/100`);
  console.log(`   - Average A11y AA Score: ${summary.averageA11yScore}/100\n`);

  const failing = summary.reports.filter((r) => !r.passed);
  if (failing.length > 0) {
    console.log("⚠️  Failing Component Breakdown:");
    failing.forEach((f) => {
      console.log(`   [FAIL] ${f.componentName} (Score: ${f.healthScore}/100, High Severity Violations: ${f.metrics.highSeverityViolations})`);
      f.antiSlopReport.findings.forEach((finding) => {
        console.log(`      * [${finding.severity}] ${finding.ruleId}: ${finding.ruleName} (Line ${finding.lineNum}: "${finding.lineText}")`);
      });
    });
    process.exit(1);
  } else {
    console.log("✅ [EVAL HARNESS PASSED] All tested components strictly satisfy zero-slop & A11y AA gates.\n");
    process.exit(0);
  }
}

main();
