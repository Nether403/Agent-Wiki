import fs from "fs";
import path from "path";
import { evaluateSource, RULE_COUNT } from "@design-wiki/audit-linter";

export function auditLocalPath(targetPath: string = process.cwd()): void {
  const resolved = path.resolve(targetPath);
  console.log(`\n🛡️ Running Anti-Slop Audit on: ${resolved}`);
  console.log(`   Rulepack: @design-wiki/audit-linter (${RULE_COUNT} rules)\n`);

  if (!fs.existsSync(resolved)) {
    console.error(`❌ Path "${resolved}" does not exist.`);
    return;
  }

  const stat = fs.statSync(resolved);
  const filesToScan: string[] = [];

  if (stat.isFile()) {
    filesToScan.push(resolved);
  } else {
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory() && !["node_modules", ".next", "dist", ".git", "research", "graphify-out"].includes(e.name)) {
          walk(path.join(dir, e.name));
        } else if (e.isFile() && /\.(tsx|ts|jsx|js)$/.test(e.name)) {
          filesToScan.push(path.join(dir, e.name));
        }
      }
    };
    walk(resolved);
  }

  console.log(`📂 Scanned ${filesToScan.length} code file(s)...\n`);
  let totalViolations = 0;
  let highCount = 0;

  filesToScan.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const result = evaluateSource(path.relative(process.cwd(), file), content);
    if (result.findings.length === 0) return;

    highCount += result.metrics.highSeverityCount;
    totalViolations += result.metrics.totalFindings;
    console.log(`📁 File: ${path.relative(process.cwd(), file)} (${result.findings.length} flags, score ${result.healthScore}/100)`);
    result.findings.forEach((f) => {
      console.log(`   - Line ${f.lineNum}: ${f.ruleName} (${f.ruleId}) [${f.severity}]`);
      console.log(`     Snippet: \`${f.lineText.slice(0, 60)}\``);
      console.log(`     Remedy:  ${f.recommendation}\n`);
    });
  });

  if (totalViolations === 0) {
    console.log(`🎉 Zero slop flags. Workspace matches the ${RULE_COUNT}-rule pack.`);
  } else {
    console.log(`⚠️ Total violations: ${totalViolations} (${highCount} High-severity).`);
  }
}
