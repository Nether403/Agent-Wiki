import fs from "fs";
import path from "path";
import { Severity } from "./rules";
import { evaluateSource, ratingFromScore, SourceFinding } from "./evaluate";

export type AuditFinding = SourceFinding;

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
  "research",
  "graphify-out",
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
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return evaluateSource(relativePath, fileContent).findings;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

export function runAudit(targetDir: string): AuditReport {
  const files = scanFiles(targetDir);
  const findings: AuditFinding[] = [];

  for (const file of files) {
    findings.push(...auditFile(file, targetDir));
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

  return {
    healthScore,
    rating: ratingFromScore(healthScore),
    totalFiles: files.length,
    severityCounts,
    findings,
    timestamp: new Date().toISOString().split("T")[0],
  };
}

export interface LinterResult {
  filePath: string;
  healthScore: number;
  grade: string;
  findings: AuditFinding[];
  metrics: {
    highSeverityCount: number;
    mediumSeverityCount: number;
    lowSeverityCount: number;
    totalFindings: number;
  };
}

export function lintComponentSource(filePath: string, content: string): LinterResult {
  return evaluateSource(filePath, content);
}

export * from "./rules";
export * from "./evaluate";
export * from "./llm-review";
export * from "./dial-classifier";
export * from "./taste-dial-audit";
export * from "./unslop";
export * from "./axe-runner";
