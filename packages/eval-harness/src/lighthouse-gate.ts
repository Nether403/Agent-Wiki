/**
 * @license Apache-2.0
 * @origin Machine-First Design Agent Wiki
 * Core Web Vitals & Lighthouse Quality Gate Evaluator
 */

export interface CWVBudgetThresholds {
  maxLcpMs: number;       // Good <= 2500ms
  maxCls: number;         // Good <= 0.1
  maxInpMs: number;       // Good <= 200ms
  maxFcpMs: number;       // Good <= 1800ms
  minA11yScore: number;   // >= 95
  minPerfScore: number;   // >= 90
}

export const DEFAULT_CWV_BUDGET: CWVBudgetThresholds = {
  maxLcpMs: 2500,
  maxCls: 0.1,
  maxInpMs: 200,
  maxFcpMs: 1800,
  minA11yScore: 95,
  minPerfScore: 90,
};

export interface CWVEvaluationReport {
  passed: boolean;
  performanceScore: number;
  accessibilityScore: number;
  metrics: {
    lcpMs: number;
    cls: number;
    inpMs: number;
    fcpMs: number;
  };
  violations: string[];
}

export function evaluateCWVBudgets(
  metrics: { lcpMs: number; cls: number; inpMs: number; fcpMs: number; perfScore: number; a11yScore: number },
  budget: CWVBudgetThresholds = DEFAULT_CWV_BUDGET
): CWVEvaluationReport {
  const violations: string[] = [];

  if (metrics.lcpMs > budget.maxLcpMs) violations.push(`LCP ${metrics.lcpMs}ms exceeds budget ${budget.maxLcpMs}ms`);
  if (metrics.cls > budget.maxCls) violations.push(`CLS ${metrics.cls} exceeds budget ${budget.maxCls}`);
  if (metrics.inpMs > budget.maxInpMs) violations.push(`INP ${metrics.inpMs}ms exceeds budget ${budget.maxInpMs}ms`);
  if (metrics.fcpMs > budget.maxFcpMs) violations.push(`FCP ${metrics.fcpMs}ms exceeds budget ${budget.maxFcpMs}ms`);
  if (metrics.a11yScore < budget.minA11yScore) violations.push(`A11y score ${metrics.a11yScore} below minimum ${budget.minA11yScore}`);
  if (metrics.perfScore < budget.minPerfScore) violations.push(`Perf score ${metrics.perfScore} below minimum ${budget.minPerfScore}`);

  return {
    passed: violations.length === 0,
    performanceScore: metrics.perfScore,
    accessibilityScore: metrics.a11yScore,
    metrics: {
      lcpMs: metrics.lcpMs,
      cls: metrics.cls,
      inpMs: metrics.inpMs,
      fcpMs: metrics.fcpMs,
    },
    violations,
  };
}
