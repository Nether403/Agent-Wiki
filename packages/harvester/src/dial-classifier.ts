import { evaluateSource, ratingFromScore } from "@design-wiki/audit-linter";
import { ComponentParsedMetadata, TaxonomyCategory } from "./ast-parser";

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
  severity: "High" | "Medium" | "Low";
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

// Anti-slop review is delegated to @design-wiki/audit-linter (evaluateSource).

export function classifyComponentDials(
  meta: ComponentParsedMetadata,
  fileContent: string
): DialScoreResult {
  let category: TaxonomyCategory = meta.category || "ui:primitive";
  const tags = new Set(meta.tags);

  let designVariance = meta.defaultDials?.design_variance ?? 3;
  let motionIntensity = meta.defaultDials?.motion_intensity ?? 2;
  let visualDensity = meta.defaultDials?.visual_density ?? 6;

  // 1. Dial Scoring: Category & Structure tells (if defaultDials not explicitly preset)
  if (!meta.defaultDials) {
    if (/^ai-|^ai[A-Z]|Prompt|Reasoning|Streaming|ToolCall|ArtifactSandbox/i.test(meta.name)) {
      category = "ui:ai-native";
      designVariance = 6;
      motionIntensity = 4;
      visualDensity = 6;
      tags.add("ai-native");
      tags.add("agent-ui");
    } else if (/Workflow|Pipeline|NodeGraph|FlowCanvas/i.test(meta.name)) {
      category = "ui:workflow";
      designVariance = 6;
      motionIntensity = 5;
      visualDensity = 7;
      tags.add("workflow");
      tags.add("node-graph");
    } else if (meta.hasWebGL || meta.hasCanvas) {
      category = "ui:creative";
      motionIntensity = 9;
      designVariance = 8;
      visualDensity = 3;
      tags.add("webgl");
      tags.add("canvas");
    } else if (meta.hasMotion) {
      category = "ui:motion";
      motionIntensity = 7;
      designVariance = 5;
      visualDensity = 5;
      tags.add("motion/react");
    } else if (/Grid|Bento|Hero|Section|Pricing|Layout/i.test(meta.name) || meta.linesCount > 140) {
      category = "ui:block";
      designVariance = 6;
      motionIntensity = 3;
      visualDensity = 6;
      tags.add("layout-block");
    } else if (/Diagram|Metric|Stat|Table|Analytics|Chart|Heatmap|Matrix|Sankey|Gantt/i.test(meta.name)) {
      category = "ui:editorial";
      designVariance = 5;
      motionIntensity = 1;
      visualDensity = 9;
      tags.add("editorial");
    } else if (/Loader|Icon|Spinner|Pill|Matrix/i.test(meta.name) || meta.linesCount < 50) {
      category = "ui:utility";
      designVariance = 2;
      motionIntensity = 4;
      visualDensity = 7;
      tags.add("utility");
    }
  } else {
    if (meta.hasWebGL || meta.hasCanvas) {
      tags.add("webgl");
      tags.add("canvas");
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
    tags.add("asymmetry");
  }
  if (/border-2|border-black|shadow-\[|brutalist/i.test(fileContent)) {
    designVariance = Math.min(10, designVariance + 2);
    tags.add("brutalist");
  }

  // 4. Visual Density adjustments based on Tailwind spacing tokens
  const highSpacingCount = (fileContent.match(/p[xy]?-(?:16|20|24|32|40|48|64)/g) || []).length;
  const denseSpacingCount = (fileContent.match(/p[xy]?-(?:0|1|2|3|4|5|6)/g) || []).length;

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
 */
export function reviewComponentSlop(
  code: string,
  meta?: ComponentParsedMetadata
): SlopReviewReport {
  const result = evaluateSource(meta?.name ? `${meta.name}.tsx` : "harvested.tsx", code);
  const violations: SlopViolation[] = result.findings.map((f) => ({
    ruleId: f.ruleId,
    name: f.ruleName,
    severity: f.severity,
    lineNum: f.lineNum,
    lineText: f.lineText,
    recommendation: f.recommendation,
  }));

  const highCount = result.metrics.highSeverityCount;
  const medCount = result.metrics.mediumSeverityCount;
  const blocked = highCount > 0 || result.healthScore < 85;

  return {
    pass: !blocked,
    healthScore: result.healthScore,
    rating: ratingFromScore(result.healthScore),
    violations,
    summary: blocked
      ? `BLOCKED: Found ${highCount} High-severity and ${medCount} Medium-severity slop flags.`
      : `PASSED: Clean component craft with health score ${result.healthScore}/100.`,
    blocked,
  };
}

/**
 * Generates an automated LLM review prompt and performs simulated/heuristic evaluation
 */
export function evaluateLLMReview(
  code: string,
  meta: ComponentParsedMetadata
): LLMReviewResult {
  const slopReport = reviewComponentSlop(code, meta);
  const dials = classifyComponentDials(meta, code);

  // Heuristic evaluation matching LLM design judge criteria
  const craftScore = slopReport.healthScore;
  const pass = slopReport.pass;

  const recommendations: string[] = slopReport.violations.map(
    (v) => `[Line ${v.lineNum}] ${v.name}: ${v.recommendation}`
  );

  if (recommendations.length === 0) {
    recommendations.push("Component exhibits flawless design hygiene and deterministic styling.");
  }

  const critique = pass
    ? `Component '${meta.name}' successfully passed automated craft review. Adheres to zero-slop constraints with appropriate visual density (${dials.dials.visual_density}/10) and motion discipline (${dials.dials.motion_intensity}/10).`
    : `Component '${meta.name}' failed automated design review due to detected slop anti-patterns. Found ${slopReport.violations.length} violations requiring remediation.`;

  return {
    pass,
    craftScore,
    critique,
    recommendations,
    suggestedDials: dials.dials,
  };
}
