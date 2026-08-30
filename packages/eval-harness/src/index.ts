/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Headless Component Evaluation Harness
 */

import fs from "fs";
import path from "path";
import { lintComponentSource, LinterResult } from "@design-wiki/audit-linter";
import { parseComponentAST, classifyComponentDials } from "@design-wiki/harvester";

export interface ComponentEvalReport {
  filePath: string;
  componentName: string;
  passed: boolean;
  healthScore: number;
  grade: "S" | "A" | "B" | "C" | "F";
  a11yScore: number;
  tokenBudgetBytes: number;
  withinContextBudget: boolean;
  antiSlopReport: LinterResult;
  dials: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
  metrics: {
    highSeverityViolations: number;
    mediumSeverityViolations: number;
    lowSeverityViolations: number;
  };
}

export interface EvalHarnessSummary {
  totalEvaluated: number;
  passedCount: number;
  failedCount: number;
  overallHealthScore: number;
  averageA11yScore: number;
  reports: ComponentEvalReport[];
}

export function evaluateComponentFile(filePath: string): ComponentEvalReport {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath, path.extname(filePath));
  const fileSize = Buffer.byteLength(content, "utf-8");

  // 1. Anti-Slop & AST Check
  const slopResult = lintComponentSource(filePath, content);

  // 2. Harvester AST & Dial parsing
  const astMeta = parseComponentAST(filePath, content);
  const dialResult = classifyComponentDials(astMeta, content);

  // 3. A11y AA Scoring
  let a11yScore = 100;
  if (!astMeta.a11y.keyboard_navigable) a11yScore -= 20;
  if (!astMeta.a11y.wai_aria_compliant) a11yScore -= 20;
  if (!astMeta.a11y.fallback_provided) a11yScore -= 15;

  const withinContextBudget = fileSize <= 15 * 1024;
  const passed = slopResult.metrics.highSeverityCount === 0 && slopResult.healthScore >= 85;

  return {
    filePath,
    componentName: fileName,
    passed,
    healthScore: slopResult.healthScore,
    grade: slopResult.grade as "S" | "A" | "B" | "C" | "F",
    a11yScore: Math.max(0, a11yScore),
    tokenBudgetBytes: fileSize,
    withinContextBudget,
    antiSlopReport: slopResult,
    dials: dialResult.dials,
    metrics: {
      highSeverityViolations: slopResult.metrics.highSeverityCount,
      mediumSeverityViolations: slopResult.metrics.mediumSeverityCount,
      lowSeverityViolations: slopResult.metrics.lowSeverityCount,
    },
  };
}

export function runEvalHarness(targetPaths: string[]): EvalHarnessSummary {
  const discoveredFiles: string[] = [];

  for (const target of targetPaths) {
    if (!fs.existsSync(target)) continue;
    const stat = fs.statSync(target);
    if (stat.isFile() && /\.(tsx|jsx|ts|js)$/.test(target)) {
      discoveredFiles.push(target);
    } else if (stat.isDirectory()) {
      function walk(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (!["node_modules", ".git", "dist", ".next", "out"].includes(entry.name)) {
              walk(full);
            }
          } else if (
            /\.(tsx|jsx)$/.test(entry.name) &&
            !entry.name.endsWith(".d.ts") &&
            entry.name !== "utils.ts"
          ) {
            discoveredFiles.push(full);
          }
        }
      }
      walk(target);
    }
  }

  const reports = discoveredFiles.map((f) => evaluateComponentFile(f));
  const total = reports.length;
  const passed = reports.filter((r) => r.passed).length;
  const failed = total - passed;

  const avgHealth = total > 0 ? Math.round(reports.reduce((s, r) => s + r.healthScore, 0) / total) : 100;
  const avgA11y = total > 0 ? Math.round(reports.reduce((s, r) => s + r.a11yScore, 0) / total) : 100;

  return {
    totalEvaluated: total,
    passedCount: passed,
    failedCount: failed,
    overallHealthScore: avgHealth,
    averageA11yScore: avgA11y,
    reports,
  };
}

export * from "./contrast-checker";
export * from "./lighthouse-gate";
