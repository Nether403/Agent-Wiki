import fs from "fs";
import path from "path";
import { SLOP_RULES, SlopRule, Severity } from "./rules";

export interface AuditFinding {
  ruleId: string;
  ruleName: string;
  category: string;
  severity: Severity;
  lineNum: number;
  lineText: string;
  filePath: string;
}

export interface AuditReport {
  healthScore: number;
  rating: string;
  totalFiles: number;
  severityCounts: Record<Severity, number>;
  findings: AuditFinding[];
  timestamp: string;
}

const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  ".git",
  "out",
  ".turbo",
  ".pnpm-store",
  "audit-linter",
  "harvester",
  "mcp-server",
  "cli",
  "docs",
  "compiler",
  "scripts",
  "artifacts",
  "scratch",
]);

const VALID_EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js"]);

export function scanFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return fileList;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name) && !entry.name.startsWith(".")) {
        scanFiles(path.join(dir, entry.name), fileList);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (VALID_EXTENSIONS.has(ext)) {
        fileList.push(path.join(dir, entry.name));
      }
    }
  }

  return fileList;
}

export function auditFile(filePath: string, rootDir: string): AuditFinding[] {
  const relativePath = path.relative(rootDir, filePath);
  const findings: AuditFinding[] = [];

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split("\n");

    lines.forEach((line, index) => {
      for (const rule of SLOP_RULES) {
        if (rule.check(line, fileContent, index, relativePath)) {
          findings.push({
            ruleId: rule.id,
            ruleName: rule.name,
            category: rule.category,
            severity: rule.severity,
            lineNum: index + 1,
            lineText: line.trim(),
            filePath: relativePath,
          });
        }
      }
    });
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }

  return findings;
}

export function runAudit(targetDir: string): AuditReport {
  const files = scanFiles(targetDir);
  const findings: AuditFinding[] = [];

  for (const file of files) {
    const fileFindings = auditFile(file, targetDir);
    findings.push(...fileFindings);
  }

  const severityCounts: Record<Severity, number> = {
    High: 0,
    Medium: 0,
    Low: 0,
  };

  findings.forEach((f) => {
    severityCounts[f.severity]++;
  });

  const deductions =
    severityCounts.High * 15 + severityCounts.Medium * 8 + severityCounts.Low * 3;
  const healthScore = Math.max(0, 100 - deductions);

  let rating = "S - Flawless Quality";
  if (healthScore < 50) rating = "F - Serious Refactoring Required";
  else if (healthScore < 70) rating = "C - Moderate Slop Present";
  else if (healthScore < 85) rating = "B - Minor Tweaks Required";
  else if (healthScore < 98) rating = "A - High Standard Integrity";

  return {
    healthScore,
    rating,
    totalFiles: files.length,
    severityCounts,
    findings,
    timestamp: new Date().toISOString().split("T")[0],
  };
}

export * from "./rules";
export * from "./llm-review";
export * from "./dial-classifier";
export * from "./taste-dial-audit";
export * from "./unslop";

