import { SLOP_RULES, scanCssAntiPatterns, SlopRule, Severity } from "./rules";
import { runLlmTasteReview, LLMTasteReviewResult } from "./llm-review";

export type TaxonomyCategory =
  | "ui:primitive"
  | "ui:motion"
  | "ui:creative"
  | "ui:editorial"
  | "ui:block"
  | "ui:media"
  | "ui:utility";

export interface ComponentMetadataInput {
  name: string;
  category?: TaxonomyCategory;
  tags?: string[];
  hasCanvas?: boolean;
  hasWebGL?: boolean;
  hasMotion?: boolean;
  linesCount?: number;
  complexity?: "low" | "medium" | "high";
  origin?: string;
  license?: string;
  author?: string;
  defaultDials?: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
}

export interface DialScoreResult {
  category: TaxonomyCategory;
  dials: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
  tags: string[];
}

export interface SlopViolation {
  ruleId: string;
  name: string;
  severity: Severity;
  lineNum: number;
  lineText: string;
  recommendation: string;
}

export interface SlopReviewReport {
  pass: boolean;
  healthScore: number;
  rating: string;
  violations: SlopViolation[];
  summary: string;
  blocked: boolean;
}

export interface LLMReviewResult {
  pass: boolean;
  craftScore: number;
  critique: string;
  recommendations: string[];
  suggestedDials: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
}

/**
 * Quantitatively scores ingested components on the 3 Taste Dials (1-10)
 * and verifies taxonomy category & technical tags
 */
export function classifyComponentDials(
  meta: ComponentMetadataInput,
  fileContent: string
): DialScoreResult {
  let category: TaxonomyCategory = meta.category || "ui:primitive";
  const tags = new Set(meta.tags || []);

  let designVariance = meta.defaultDials?.design_variance ?? 3;
  let motionIntensity = meta.defaultDials?.motion_intensity ?? 2;
  let visualDensity = meta.defaultDials?.visual_density ?? 6;

  // 1. Dial Scoring: Category & Structure tells (if not preset)
  if (!meta.defaultDials) {
    if (meta.hasWebGL || meta.hasCanvas || /<canvas\b/i.test(fileContent)) {
      category = "ui:creative";
      motionIntensity = 9;
      designVariance = 8;
      visualDensity = 3;
      tags.add("webgl");
      tags.add("canvas");
      tags.add("threejs");
    } else if (meta.hasMotion || /motion|AnimatePresence|LayoutGroup|useSpring/i.test(fileContent)) {
      category = "ui:motion";
      motionIntensity = 7;
      designVariance = 5;
      visualDensity = 5;
      tags.add("framer-motion");
    } else if (/Grid|Bento|Hero|Section|Pricing|Layout/i.test(meta.name) || (meta.linesCount && meta.linesCount > 140)) {
      category = "ui:block";
      designVariance = 6;
      motionIntensity = 3;
      visualDensity = 6;
      tags.add("bento-grid");
    } else if (/Diagram|Metric|Stat|Table|Analytics/i.test(meta.name)) {
      category = "ui:editorial";
      designVariance = 5;
      motionIntensity = 1;
      visualDensity = 9;
      tags.add("analytical");
      tags.add("svg");
    } else if (/Loader|Icon|Spinner|Pill|Matrix/i.test(meta.name) || (meta.linesCount && meta.linesCount < 50)) {
      category = "ui:utility";
      designVariance = 2;
      motionIntensity = 4;
      visualDensity = 7;
      tags.add("utility");
    }
  } else {
    if (meta.hasWebGL || meta.hasCanvas || /<canvas\b/i.test(fileContent)) {
      tags.add("webgl");
      tags.add("canvas");
      tags.add("threejs");
    }
  }

  // 2. Motion adjustments
  if (fileContent.includes("AnimatePresence") || fileContent.includes("LayoutGroup")) {
    motionIntensity = Math.min(10, motionIntensity + 2);
  }
  if (fileContent.includes("useSpring") || fileContent.includes("stiffness")) {
    motionIntensity = Math.min(10, motionIntensity + 1);
    tags.add("spring-physics");
  }

  // 3. Design Variance adjustments
  if (fileContent.includes("col-span-") && fileContent.includes("row-span-")) {
    designVariance = Math.min(10, designVariance + 2);
  }
  if (/border-2|border-black|shadow-\[|brutalist/i.test(fileContent)) {
    designVariance = Math.min(10, designVariance + 2);
    tags.add("brutalist");
  }
  if (fileContent.includes("backdrop-blur")) {
    tags.add("glassmorphism");
  }

  // 4. Visual Density adjustments based on Tailwind spacing tokens
  const highSpacingCount = (fileContent.match(/\b(p[xy]?|gap)-(?:16|20|24|32|40|48|64)\b/g) || []).length;
  const denseSpacingCount = (fileContent.match(/\b(p[xy]?|gap)-(?:0|1|2|3|4|5|6)\b/g) || []).length;

  if (highSpacingCount > denseSpacingCount * 1.5) {
    visualDensity = Math.max(1, visualDensity - 2); // Generous whitespace
  } else if (denseSpacingCount > highSpacingCount * 1.5) {
    visualDensity = Math.min(10, visualDensity + 2); // Dense layout
  }

  return {
    category,
    dials: {
      design_variance: designVariance,
      motion_intensity: motionIntensity,
      visual_density: visualDensity,
    },
    tags: Array.from(tags),
  };
}

/**
 * Automated anti-slop review script to block substandard or AI-slop assets
 * utilizing all 21 SLOP_RULES and CSS arbitrary value checks
 */
export function reviewComponentSlop(
  code: string,
  meta?: ComponentMetadataInput,
  filePath?: string
): SlopReviewReport {
  const lines = code.split("\n");
  const violations: SlopViolation[] = [];
  const activeFilePath = filePath || (meta ? `${meta.name}.tsx` : "component.tsx");

  lines.forEach((line, index) => {
    for (const check of SLOP_RULES) {
      if (check.check(line, code, index, activeFilePath)) {
        violations.push({
          ruleId: check.id,
          name: check.name,
          severity: check.severity,
          lineNum: index + 1,
          lineText: line.trim(),
          recommendation: check.description,
        });
      }
    }
  });

  // Check CSS Arbitrary Anti-Patterns (e.g. p-[17px], m-[13px])
  const cssAntiPatterns = scanCssAntiPatterns(code);
  cssAntiPatterns.forEach((p) => {
    violations.push({
      ruleId: "SLOP-007",
      name: "Non-Token Arbitrary Pixel Spacing / Sizing",
      severity: "Low",
      lineNum: p.lineNum,
      lineText: p.lineSnippet,
      recommendation: `Replace arbitrary CSS escape '${p.arbitraryValue}' with recommended token '${p.recommendedToken}'.`,
    });
  });

  const highCount = violations.filter((v) => v.severity === "High").length;
  const medCount = violations.filter((v) => v.severity === "Medium").length;
  const lowCount = violations.filter((v) => v.severity === "Low").length;

  const deductions = highCount * 15 + medCount * 8 + lowCount * 3;
  const healthScore = Math.max(0, 100 - deductions);

  let rating = "S - Flawless Quality";
  if (healthScore < 50) rating = "F - Serious Refactoring Required";
  else if (healthScore < 70) rating = "C - Moderate Slop Present";
  else if (healthScore < 85) rating = "B - Minor Tweaks Required";
  else if (healthScore < 98) rating = "A - High Standard Integrity";

  const blocked = highCount > 0 || healthScore < 85;

  return {
    pass: !blocked,
    healthScore,
    rating,
    violations,
    summary: blocked
      ? `BLOCKED: Found ${highCount} High-severity and ${medCount} Medium-severity slop flags.`
      : `PASSED: Clean component craft with health score ${healthScore}/100.`,
    blocked,
  };
}

/**
 * Generates an automated LLM review prompt and performs simulated/heuristic evaluation
 */
export function evaluateLLMReview(
  code: string,
  meta: ComponentMetadataInput
): LLMReviewResult {
  const tasteResult: LLMTasteReviewResult = runLlmTasteReview(code, {
    componentName: meta.name,
    filePath: `${meta.name}.tsx`,
  });

  const recommendations: string[] = tasteResult.remediationPlan;

  return {
    pass: tasteResult.pass,
    craftScore: tasteResult.craftScore,
    critique: tasteResult.critique,
    recommendations,
    suggestedDials: tasteResult.dials,
  };
}
