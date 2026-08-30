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

// 20 anti-slop rules for automated ingestion gating
const HARVESTER_SLOP_CHECKS: Array<{
  id: string;
  name: string;
  severity: "High" | "Medium" | "Low";
  regex: RegExp;
  recommendation: string;
}> = [
  {
    id: "SLOP-001",
    name: "Hardcoded Indigo Color",
    severity: "Medium",
    regex: /bg-indigo-(?:500|600|700)|text-indigo-(?:500|600)|(?:#4f46e5|#6366f1)/i,
    recommendation: "Replace hardcoded indigo with semantic Tailwind tokens (bg-primary, text-primary-foreground).",
  },
  {
    id: "SLOP-002",
    name: "Purple-to-Blue Linear Gradient",
    severity: "Medium",
    regex: /from-purple-500\s+to-blue-500|bg-gradient-to-[r|tr|tl|b]\s+from-fuchsia/i,
    recommendation: "Replace generic linear gradients with subtle solid card backgrounds accented by structural borders.",
  },
  {
    id: "SLOP-003",
    name: "Blanket Glassmorphism",
    severity: "Low",
    regex: /bg-white\/10\s+backdrop-blur|bg-white\/5\s+backdrop-blur/i,
    recommendation: "Use solid card surfaces with crisp border-border instead of blanket glassmorphism blur.",
  },
  {
    id: "SLOP-004",
    name: "Chained Type Assertions",
    severity: "High",
    regex: /as\s+\w+\s+as\s+\w+/i,
    recommendation: "Remove chained assertions (as any as). Define explicit TypeScript interfaces and type guards.",
  },
  {
    id: "SLOP-005",
    name: "Conditional Empty Object Spreads",
    severity: "High",
    regex: /\.\.\.\s*\(\s*[^?]+\s*\?\s*\{[^}]*\}\s*:\s*\{\s*\}\s*\)/i,
    recommendation: "Use explicit fallback keys instead of ad-hoc conditional empty spreads.",
  },
  {
    id: "SLOP-006",
    name: "Blanket Transition All",
    severity: "Low",
    regex: /transition-all\s+duration-(?:300|500)/i,
    recommendation: "Target mutable styles explicitly (e.g. transition-colors duration-200) rather than transition-all.",
  },
  {
    id: "SLOP-007",
    name: "Non-Token Arbitrary Pixel Spacing",
    severity: "Low",
    regex: /(?:p|m|gap)-\[(?:\d+px|\d+rem)\]/i,
    recommendation: "Replace arbitrary pixel units (p-[17px]) with Tailwind spacing steps (p-4).",
  },
  {
    id: "SLOP-008",
    name: "Decorative Emojis in Cards/Buttons",
    severity: "Medium",
    regex: /(?:<span>|<li>|<button>)\s*[\uD800-\uDBFF][\uDC00-\uDFFF]\s*(?:<\/span>|<\/li>|<\/button>)/i,
    recommendation: "Replace decorative emojis with semantic SVG vector icons from lucide-react.",
  },
  {
    id: "SLOP-009",
    name: "Incomplete Code / Mock TODOs",
    severity: "High",
    regex: /\/\/\s*TODO:\s*(?:implement|add\s+logic|finish|mock)/i,
    recommendation: "Deliver complete, functional code without truncation or placeholder comments.",
  },
  {
    id: "SLOP-010",
    name: "Missing Interactive A11y Label",
    severity: "High",
    regex: /<button[^>]*>\s*<[A-Z]\w+[^>]*\/>\s*<\/button>/i,
    recommendation: "Add aria-label or accessible <span className='sr-only'> text to icon-only buttons.",
  },
  {
    id: "SLOP-011",
    name: "Inline SVG Missing Role or Title",
    severity: "Medium",
    regex: /<svg\b(?![^>]*(?:role=["']img["']|aria-hidden=["']true["']|aria-label))[^>]*>/i,
    recommendation: "Add role='img' and aria-label or title to inline SVGs.",
  },
  {
    id: "SLOP-012",
    name: "Focus Ring Suppression Without Replacement",
    severity: "High",
    regex: /(?:outline-none|ring-0)\b/i,
    recommendation: "Provide focus-visible rings (focus-visible:ring-2) when removing default focus outlines.",
  },
  {
    id: "SLOP-013",
    name: "Layout-Triggering Transitions",
    severity: "Medium",
    regex: /transition-\[(?:height|width|margin|padding)\]/i,
    recommendation: "Animate transform or opacity instead of layout properties (height/width).",
  },
  {
    id: "SLOP-014",
    name: "Canvas Loop Missing Reduced Motion Check",
    severity: "Medium",
    regex: /requestAnimationFrame/i,
    recommendation: "Check window.matchMedia('(prefers-reduced-motion: reduce)') before running canvas loops.",
  },
  {
    id: "SLOP-015",
    name: "External Image Missing Fallback Dimensions",
    severity: "High",
    regex: /<img[^>]+src=["']http[^"']+["'](?!.*(?:width=|height=|aspect-))/i,
    recommendation: "Specify explicit width, height, or aspect-ratio on image elements.",
  },
  {
    id: "SLOP-016",
    name: "Missing LayoutGroup or Key During Morph",
    severity: "Low",
    regex: /layoutId=(?!.*key=)/i,
    recommendation: "Ensure components with layoutId inside arrays have unique stable React keys.",
  },
  {
    id: "SLOP-017",
    name: "Implicit Any Props on Component Export",
    severity: "Medium",
    regex: /export\s+(?:function|const)\s+\w+\s*=\s*\([^)]*:\s*any\s*\)/i,
    recommendation: "Define explicit TypeScript interfaces for component props instead of any.",
  },
  {
    id: "SLOP-018",
    name: "Repetitive Centered Card Layout Pattern",
    severity: "Medium",
    regex: /grid-cols-3.*items-center.*text-center.*rounded-xl.*p-6/i,
    recommendation: "Introduce asymmetrical rhythm or editorial layout styling.",
  },
  {
    id: "SLOP-019",
    name: "Deep Relative Import Bypassing Aliases",
    severity: "High",
    regex: /import\s+.*from\s+["'](?:\.\.\/){3,}/i,
    recommendation: "Use standard import path aliases (@/components/ui/...).",
  },
  {
    id: "SLOP-020",
    name: "Missing Mandatory License Attribution",
    severity: "High",
    regex: /^$/i, // Handled separately in header check
    recommendation: "Inject upstream license attribution header before publication.",
  },
  {
    id: "SLOP-021",
    name: "Raw Unshaded Background",
    severity: "Medium",
    regex: /(?:bg-white|bg-black)\b|bg-\[#(?:fff|ffffff|000|000000)\]/i,
    recommendation: "Replace raw unshaded background with semantic tokens (bg-card, bg-background, bg-muted) and dark variant.",
  },
];

/**
 * Quantitatively scores ingested components on the 3 Taste Dials (1-10)
 */
export function classifyComponentDials(
  meta: ComponentParsedMetadata,
  fileContent: string
): DialScoreResult {
  let category: TaxonomyCategory = meta.category || "ui:primitive";
  const tags = new Set(meta.tags);

  let designVariance = 3;
  let motionIntensity = 2;
  let visualDensity = 6;

  // 1. Dial Scoring: Category & Structure tells
  if (meta.hasWebGL || meta.hasCanvas) {
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
  } else if (/Diagram|Metric|Stat|Table|Analytics/i.test(meta.name)) {
    category = "ui:editorial";
    designVariance = 4;
    motionIntensity = 1;
    visualDensity = 8;
    tags.add("editorial");
  } else if (/Loader|Icon|Spinner|Pill|Matrix/i.test(meta.name) || meta.linesCount < 50) {
    category = "ui:utility";
    designVariance = 2;
    motionIntensity = 4;
    visualDensity = 7;
    tags.add("utility");
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
  const lines = code.split("\n");
  const violations: SlopViolation[] = [];

  lines.forEach((line, index) => {
    for (const check of HARVESTER_SLOP_CHECKS) {
      if (check.id === "SLOP-020") continue; // Special handling for attribution
      if (check.id === "SLOP-012" && (line.includes("focus-visible:") || line.includes("focus:ring"))) {
        continue; // Handled focus ring replacement
      }
      if (check.id === "SLOP-014" && code.includes("prefers-reduced-motion")) {
        continue; // Has reduced motion support in file
      }
      if (check.id === "SLOP-021" && (line.includes("dark:bg-") || line.includes("bg-white/") || line.includes("bg-black/"))) {
        continue; // Handled with dark mode token or backdrop opacity
      }

      if (check.regex.test(line)) {
        violations.push({
          ruleId: check.id,
          name: check.name,
          severity: check.severity,
          lineNum: index + 1,
          lineText: line.trim(),
          recommendation: check.recommendation,
        });
      }
    }
  });

  // Check SLOP-020: License attribution header
  if (!code.includes("@license") && !code.includes("SPDX-License-Identifier")) {
    violations.push({
      ruleId: "SLOP-020",
      name: "Missing Mandatory License Attribution",
      severity: "High",
      lineNum: 1,
      lineText: lines[0] || "",
      recommendation: "Inject upstream license attribution header before publication.",
    });
  }

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
