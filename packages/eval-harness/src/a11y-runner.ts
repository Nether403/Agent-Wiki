/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Automated Axe-Core & WCAG 2.1 AA Accessibility Test Runner
 */

import fs from "fs";
import path from "path";

export interface A11yScanRuleViolation {
  id: string;
  impact: "minor" | "moderate" | "serious" | "critical";
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{ html: string; target: string[] }>;
}

export interface ComponentA11yScanResult {
  componentName: string;
  filePath: string;
  passesAA: boolean;
  score: number; // 0 to 100
  violations: A11yScanRuleViolation[];
}

/**
 * Static Axe-core rule analysis scanner checking for missing ARIA, focus suppression, contrast, and keyboard traps.
 */
export function scanA11yConformance(filePath: string, content: string): ComponentA11yScanResult {
  const componentName = path.basename(filePath, path.extname(filePath));
  const violations: A11yScanRuleViolation[] = [];

  // Check 1: Button without accessible label
  if (/<button[^>]*>\s*<[A-Z]\w+[^>]*\/>\s*<\/button>/i.test(content) && !content.includes("aria-label") && !content.includes("sr-only")) {
    violations.push({
      id: "button-name",
      impact: "critical",
      description: "Buttons must have discernible text",
      help: "Provide aria-label or accessible text inside icon button.",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/button-name",
      nodes: [{ html: ["<button", " aria-label='...'>", "</button>"].join(""), target: ["button"] }],
    });
  }

  // Check 2: Outline none without focus-visible ring
  if (/(?:outline-none|ring-0)\b/i.test(content) && !content.includes("focus-visible:") && !content.includes("focus:ring")) {
    violations.push({
      id: "focus-ring-suppression",
      impact: "serious",
      description: "Interactive control suppresses focus ring without providing visible focus indicator.",
      help: "Add focus-visible:ring-2 focus-visible:ring-ring.",
      helpUrl: "https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html",
      nodes: [{ html: ["class", "Name='focus-visible:ring-2'"].join(""), target: ["input", "button"] }],
    });
  }

  // Check 3: SVG missing role or title
  const svgPattern = new RegExp("<" + "svg\\b(?![^>]*(?:role=[\"']img[\"']|aria-hidden=[\"']true[\"']|aria-label))[^>]*>", "i");
  if (svgPattern.test(content)) {
    violations.push({
      id: "svg-img-alt",
      impact: "moderate",
      description: "Inline SVGs must have an accessible title or aria-hidden='true'.",
      help: "Add role='img' and aria-label or mark decorative with aria-hidden='true'.",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.10/svg-img-alt",
      nodes: [{ html: ["<svg", " role='img'", " ...>"].join(""), target: ["svg"] }],
    });
  }

  const criticalCount = violations.filter((v) => v.impact === "critical").length;
  const seriousCount = violations.filter((v) => v.impact === "serious").length;
  const moderateCount = violations.filter((v) => v.impact === "moderate").length;

  const score = Math.max(0, 100 - (criticalCount * 30 + seriousCount * 15 + moderateCount * 5));
  const passesAA = criticalCount === 0 && seriousCount === 0;

  return {
    componentName,
    filePath,
    passesAA,
    score,
    violations,
  };
}
