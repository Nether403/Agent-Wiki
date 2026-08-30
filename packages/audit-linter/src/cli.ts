#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { runAudit } from "./index";

function main() {
  const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  console.log(`\n🛡️ Starting Machine-First Anti-Slop Audit (20 AST & Pattern Rules)...`);
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

  const outReportPath = path.join(targetDir, "COMPLETED-DESIGN-AUDIT.md");
  fs.writeFileSync(outReportPath, markdown, "utf-8");
  console.log(`\n📁 Report written to: ${outReportPath}`);

  if (report.severityCounts.High > 0) {
    console.error(`\n❌ Failed: ${report.severityCounts.High} High-severity anti-slop violations found.`);
    process.exit(1);
  }
}

main();
