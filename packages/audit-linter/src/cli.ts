#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { runAudit, runLlmTasteReview, auditCatalogTasteDials, SLOP_RULES } from "./index";

function main() {
  const args = process.argv.slice(2);
  const baseDir = process.env.INIT_CWD || process.cwd();

  if (args[0] === "taste" || args[0] === "taste-dials") {
    const candidatePaths = [
      args[1] ? (path.isAbsolute(args[1]) ? args[1] : path.resolve(baseDir, args[1])) : null,
      path.resolve(baseDir, "packages/registry/src"),
      path.resolve(process.cwd(), "packages/registry/src"),
      path.resolve(process.cwd(), "../registry/src"),
      path.resolve(process.cwd(), "../../packages/registry/src"),
      path.resolve(process.cwd(), "src"),
    ].filter(Boolean) as string[];

    const target = candidatePaths.find((p) => fs.existsSync(p)) || process.cwd();

    console.log(`\n🎛️ =======================================================`);
    console.log(`🎛️ DESIGN AGENT WIKI: TASTE DIAL CONSISTENCY AUDITOR`);
    console.log(`🎛️ Verifying 1-10 Dial Calibration (Variance, Motion, Density)`);
    console.log(`🎛️ Target: ${target}`);
    console.log(`🎛️ =======================================================\n`);

    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      const summary = auditCatalogTasteDials(target);
      console.log(`📊 Catalog Taste Summary:`);
      console.log(`   - Components Audited: ${summary.totalAudited}`);
      console.log(`   - Consistent Dials:   ${summary.consistentCount} (${Math.round((summary.consistentCount / summary.totalAudited) * 100)}%)`);
      console.log(`   - Flagged Dials:      ${summary.flaggedCount}`);
      console.log(`   - Average Score:      ${summary.averageScore}/100\n`);

      console.log(`| Component | Variance | Motion | Density | Consistency | Score |`);
      console.log(`| :--- | :--- | :--- | :--- | :--- | :--- |`);
      summary.results.forEach((r) => {
        const status = r.consistent ? "✅ Consistent" : "⚠️ Needs Calibration";
        console.log(`| ${r.slug.padEnd(20)} | ${r.declaredDials.design_variance.toString().padEnd(8)} | ${r.declaredDials.motion_intensity.toString().padEnd(6)} | ${r.declaredDials.visual_density.toString().padEnd(7)} | ${status.padEnd(17)} | ${r.score}/100 |`);
      });

      if (summary.flaggedCount > 0) {
        console.log(`\n⚠️ Calibration Recommendations:`);
        summary.results
          .filter((r) => !r.consistent)
          .forEach((r) => {
            console.log(`  - [${r.slug}]:`);
            r.findings.forEach((f) => console.log(`      * [${f.dial}] ${f.recommendation}`));
          });
      }

      console.log(`\n🎉 Taste Dial Consistency Verification Complete! Score: ${summary.averageScore}/100\n`);
      process.exit(0);
    } else {
      console.log(`❌ Target not found or not a directory: ${target}`);
      process.exit(1);
    }
  }

  if (args[0] === "review") {
    const targetFile = args[1]
      ? path.isAbsolute(args[1])
        ? args[1]
        : path.resolve(baseDir, args[1])
      : path.resolve(process.cwd(), "packages/registry/src/primitives/button.tsx");

    if (!targetFile || !fs.existsSync(targetFile)) {
      console.error(`❌ Error: Must specify a valid component file to review. Example: pnpm --filter @design-wiki/audit-linter review ./components/ui/button.tsx`);
      process.exit(1);
    }

    const code = fs.readFileSync(targetFile, "utf-8");
    const compName = path.basename(targetFile, path.extname(targetFile));
    console.log(`\n🎨 Running Automated Taste Audit & LLM Review for: ${compName}`);
    console.log(`📂 File: ${targetFile}\n`);

    const result = runLlmTasteReview(code, { componentName: compName, filePath: targetFile });

    console.log(`📊 Taste Review Scorecard:`);
    console.log(`   - Status:       ${result.pass ? "✅ PASS" : "❌ REJECTED / NEEDS REMEDIATION"}`);
    console.log(`   - Health Score: ${result.craftScore}/100 (${result.rating})`);
    console.log(`   - Calibrated Taste Dials (1-10):`);
    console.log(`       * Design Variance:  ${result.dials.design_variance}/10 (1: rigid standard · 10: avant-garde/brutalist)`);
    console.log(`       * Motion Intensity: ${result.dials.motion_intensity}/10 (1: static/CSS hover · 10: GPU WebGL/springs)`);
    console.log(`       * Visual Density:   ${result.dials.visual_density}/10 (1: generous space · 10: compact analytical)`);
    console.log(`   - Guardrail Check:`);
    console.log(`       * Shaders & Canvas Safe:    ${result.guardrails.shadersSafe ? "✅ Pass" : "⚠️ Missing fallback"}
      * Glassmorphism Curated:    ${result.guardrails.glassmorphismSafe ? "✅ Pass" : "⚠️ Blanket blur without border tokens"}
      * Spacing / Token Rhythm:   ${result.guardrails.tokenRhythmSafe ? "✅ Pass" : "⚠️ Arbitrary pixel escapes detected"}
      * Surfaces Shaded / Tokens: ${result.guardrails.surfacesSafe !== false ? "✅ Pass" : "⚠️ Raw unshaded backgrounds detected"}`);

    if (result.cssArbitraryViolations.length > 0) {
      console.log(`\n🚫 Arbitrary CSS Anti-Patterns Detected (${result.cssArbitraryViolations.length}):`);
      result.cssArbitraryViolations.forEach((v) => {
        console.log(`   - [Line ${v.lineNum}] Found '${v.arbitraryValue}' -> Suggested replacement: '${v.recommendedToken}'`);
      });
    }

    if (result.violations.length > 0) {
      console.log(`\n⚠️ Rule Violations (${result.violations.length}):`);
      result.violations.forEach((v) => {
        console.log(`   - [Line ${v.lineNum}] [${v.severity}] ${v.ruleName} (${v.ruleId}): ${v.recommendation}`);
      });
    }

    console.log(`\n💡 LLM Design Critique:\n   ${result.critique}\n`);
    if (!result.pass) {
      process.exit(1);
    }
    process.exit(0);
  }

  const rawTarget = args[0] || baseDir;
  const targetDir = path.isAbsolute(rawTarget)
    ? rawTarget
    : fs.existsSync(path.resolve(baseDir, rawTarget))
    ? path.resolve(baseDir, rawTarget)
    : path.resolve(process.cwd(), rawTarget);

  console.log(`\n🛡️ Starting Machine-First Anti-Slop Audit (${SLOP_RULES.length} pattern rules from packages/audit-linter)...`);
  console.log(`📂 Scanning target: ${targetDir}`);

  const report = runAudit(targetDir);

  console.log(`\n📊 Audit Complete:`);
  console.log(`   - Scanned Files: ${report.totalFiles}`);
  console.log(`   - Health Score: ${report.healthScore}/100 (${report.rating})`);
  console.log(`   - High Flags:   ${report.severityCounts.High}`);
  console.log(`   - Medium Flags: ${report.severityCounts.Medium}`);
  console.log(`   - Low Flags:    ${report.severityCounts.Low}`);
  console.log(`   - Total Flags:  ${report.findings.length}`);

  let markdown = `# 📊 Completed Workspace Design Audit & Anti-Slop Scorecard\n`;
  markdown += `> Generated on: ${report.timestamp} (Automated Machine-First Audit Task)\n`;
  markdown += `> Target Workspace: \`${targetDir}\`\n\n`;
  markdown += `---\n\n`;
  markdown += `## 🏎️ Executive Summary\n\n`;
  markdown += `| Metrics & Scores | Value | Assessment |\n`;
  markdown += `| :--- | :--- | :--- |\n`;
  markdown += `| **Health Index Score** | **${report.healthScore}/100** | **${report.rating}** |\n`;
  markdown += `| High Severity Flags | ${report.severityCounts.High} | Instant failure potential (TypeScript/logic) |\n`;
  markdown += `| Medium Severity Flags | ${report.severityCounts.Medium} | Design alignment tells (vibe gradients, colors) |\n`;
  markdown += `| Low Severity Flags | ${report.severityCounts.Low} | Micro-detailing flags (spacing, transitions) |\n`;
  markdown += `| Total Scanned Files | ${report.totalFiles} | Source base breadth checked |\n\n`;
  markdown += `---\n\n`;
  markdown += `## 🚫 Detailed Anti-Pattern Detections\n\n`;

  if (report.findings.length === 0) {
    markdown += `### 🎉 Zero Slop Detected!\nAll components align perfectly with clean patterns. Excellent engineering hygiene!\n`;
  } else {
    const grouped: Record<string, typeof report.findings> = {};
    report.findings.forEach((f) => {
      if (!grouped[f.filePath]) grouped[f.filePath] = [];
      grouped[f.filePath].push(f);
    });

    for (const [file, items] of Object.entries(grouped)) {
      markdown += `### 📁 File: \`${file}\` (${items.length} findings)\n\n`;
      markdown += `| Line | Severity | Category | Rule Detected | Match Snippet |\n`;
      markdown += `| :--- | :--- | :--- | :--- | :--- |\n`;
      items.forEach((item) => {
        const safeSnippet = item.lineText.replace(/\|/g, "\\|").slice(0, 80);
        markdown += `| **${item.lineNum}** | \`${item.severity}\` | ${item.category} | **${item.ruleName}** (${item.ruleId}) | \`${safeSnippet}\` |\n`;
      });
      markdown += `\n`;
    }
  }

  const outReportPath = path.join(baseDir, "artifacts", "COMPLETED-DESIGN-AUDIT.md");
  if (args.includes("--write-report")) {
    fs.mkdirSync(path.dirname(outReportPath), { recursive: true });
    fs.writeFileSync(outReportPath, markdown, "utf-8");
    console.log(`\n📁 Report written to: ${outReportPath}`);
  }

  if (report.severityCounts.High > 0) {
    console.error(`\n❌ Failed: ${report.severityCounts.High} High-severity anti-slop violations found.`);
    process.exit(1);
  }
}

main();

