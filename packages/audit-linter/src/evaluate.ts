import { SLOP_RULES, Severity } from "./rules";

export interface SourceFinding {
  ruleId: string;
  ruleName: string;
  category: string;
  severity: Severity;
  lineNum: number;
  lineText: string;
  filePath: string;
  recommendation: string;
}

export interface SourceEvaluation {
  filePath: string;
  healthScore: number;
  grade: string;
  findings: SourceFinding[];
  metrics: {
    highSeverityCount: number;
    mediumSeverityCount: number;
    lowSeverityCount: number;
    totalFindings: number;
  };
}

export const RULE_COUNT = SLOP_RULES.length;

export function gradeFromScore(healthScore: number): string {
  if (healthScore < 50) return "F";
  if (healthScore < 70) return "C";
  if (healthScore < 85) return "B";
  if (healthScore < 98) return "A";
  return "S";
}

export function ratingFromScore(healthScore: number): string {
  if (healthScore < 50) return "F - Serious Refactoring Required";
  if (healthScore < 70) return "C - Moderate Slop Present";
  if (healthScore < 85) return "B - Minor Tweaks Required";
  if (healthScore < 98) return "A - High Standard Integrity";
  return "S - Flawless Quality";
}

/**
 * Canonical anti-slop evaluator. MCP, CLI, harvester, and eval-harness must
 * call this instead of maintaining private rule copies.
 */
export function evaluateSource(filePath: string, content: string): SourceEvaluation {
  const lines = content.split("\n");
  const findings: SourceFinding[] = [];

  lines.forEach((line, index) => {
    for (const rule of SLOP_RULES) {
      if (rule.check(line, content, index, filePath)) {
        findings.push({
          ruleId: rule.id,
          ruleName: rule.name,
          category: rule.category,
          severity: rule.severity,
          lineNum: index + 1,
          lineText: line.trim(),
          filePath,
          recommendation: rule.description,
        });
      }
    }
  });

  const highSeverityCount = findings.filter((f) => f.severity === "High").length;
  const mediumSeverityCount = findings.filter((f) => f.severity === "Medium").length;
  const lowSeverityCount = findings.filter((f) => f.severity === "Low").length;
  const healthScore = Math.max(
    0,
    100 - (highSeverityCount * 15 + mediumSeverityCount * 8 + lowSeverityCount * 3)
  );

  return {
    filePath,
    healthScore,
    grade: gradeFromScore(healthScore),
    findings,
    metrics: {
      highSeverityCount,
      mediumSeverityCount,
      lowSeverityCount,
      totalFindings: findings.length,
    },
  };
}
