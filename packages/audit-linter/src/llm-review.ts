import { SLOP_RULES, scanCssAntiPatterns, CssAntiPatternMatch, Severity } from "./rules";

export interface TasteDials {
  design_variance: number; // 1-10 (1: rigid standard grid · 10: avant-garde editorial/brutalist)
  motion_intensity: number; // 1-10 (1: static/CSS hover · 10: GPU WebGL shaders/springs)
  visual_density: number; // 1-10 (1: generous whitespace · 10: compact analytical UI)
}

export interface ReviewFinding {
  ruleId: string;
  ruleName: string;
  category: string;
  severity: Severity;
  lineNum: number;
  lineText: string;
  recommendation: string;
}

export interface LLMTasteReviewResult {
  componentName: string;
  pass: boolean;
  craftScore: number;
  rating: string;
  dials: TasteDials;
  critique: string;
  cssArbitraryViolations: CssAntiPatternMatch[];
  violations: ReviewFinding[];
  remediationPlan: string[];
  guardrails: {
    shadersSafe: boolean;
    glassmorphismSafe: boolean;
    tokenRhythmSafe: boolean;
    surfacesSafe?: boolean;
  };
}

/**
 * Pipes code through the 20 Anti-Slop Rules and CSS Anti-Pattern Scanner,
 * then computes calibrated 1-10 Dial scores and a comprehensive craft critique.
 */
export function runLlmTasteReview(
  code: string,
  options: {
    componentName?: string;
    filePath?: string;
  } = {}
): LLMTasteReviewResult {
  const componentName = options.componentName || "unnamed-component";
  const filePath = options.filePath || `${componentName}.tsx`;
  const lines = code.split("\n");

  // 1. Run 20 Anti-Slop Rules
  const violations: ReviewFinding[] = [];
  lines.forEach((line, index) => {
    for (const rule of SLOP_RULES) {
      if (rule.check(line, code, index, filePath)) {
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          category: rule.category,
          severity: rule.severity,
          lineNum: index + 1,
          lineText: line.trim(),
          recommendation: rule.description,
        });
      }
    }
  });

  // 2. Run CSS Arbitrary Anti-Pattern Scanner (p-[17px], m-[13px], etc.)
  const cssArbitraryViolations = scanCssAntiPatterns(code);

  // 3. Calibrate Taste Dials (1-10) with layout safety guardrails
  let designVariance = 3;
  let motionIntensity = 2;
  let visualDensity = 6;

  const hasCanvas = /<canvas\b/i.test(code);
  const hasWebGL = /WebGL|Shader|Renderer|PerspectiveCamera|Mesh|three/i.test(code);
  const hasMotion = /motion|AnimatePresence|LayoutGroup|useSpring/i.test(code);
  const hasReducedMotion = /prefers-reduced-motion/i.test(code);
  const hasFallback = code.includes("fallback") || code.includes("reducedMotion") || hasReducedMotion;

  // Guardrail statuses
  const shadersSafe = !(hasCanvas || hasWebGL) || (hasReducedMotion && hasFallback);
  const hasGlassmorphism = /backdrop-blur/i.test(code);
  const glassmorphismSafe = !hasGlassmorphism || (code.includes("border-border") && !code.includes("bg-white/10"));
  const tokenRhythmSafe = cssArbitraryViolations.length === 0;
  const surfacesSafe = !violations.some((v) => v.ruleId === "SLOP-021");

  // Dial Calibration
  if (hasWebGL || (hasCanvas && /requestAnimationFrame/i.test(code))) {
    // Creative shaders & WebGL backdrops
    motionIntensity = 9;
    designVariance = 8;
    visualDensity = 3; // Open decorative spatial ratio

    // Check if safely curated
    if (!shadersSafe) {
      // Missing reduced motion / fallback limits safe motion deployment
      motionIntensity = 7;
    }
  } else if (hasMotion) {
    // Spring motion & micro-interactions
    motionIntensity = 6;
    designVariance = 4;
    visualDensity = 5;

    if (code.includes("useSpring") || code.includes("stiffness")) {
      motionIntensity = Math.min(10, motionIntensity + 1);
    }
    if (code.includes("LayoutGroup") || code.includes("AnimatePresence")) {
      motionIntensity = Math.min(10, motionIntensity + 1);
    }
  } else if (/Grid|Bento|Hero|Section|Pricing|Layout/i.test(code) || lines.length > 150) {
    // Structural layout blocks
    designVariance = 6;
    motionIntensity = 3;
    visualDensity = 6;
  } else if (/Diagram|Metric|Stat|Table|Analytics/i.test(code)) {
    // Analytical editorial layouts
    designVariance = 4;
    motionIntensity = 1;
    visualDensity = 8;
  }

  // Adjust Design Variance based on asymmetry, editorial rules, or brutalism
  if (code.includes("col-span-") && code.includes("row-span-")) {
    designVariance = Math.min(10, designVariance + 2);
  }
  if (/border-2|border-black|shadow-\[|brutalist/i.test(code)) {
    designVariance = Math.min(10, designVariance + 2);
  }
  if (hasGlassmorphism && glassmorphismSafe) {
    designVariance = Math.min(10, designVariance + 1);
  }

  // Penalize variance and density consistency if arbitrary spacing breaks layout
  if (cssArbitraryViolations.length > 0) {
    // Arbitrary pixel hacks like p-[17px] degrade layout rhythm
    designVariance = Math.max(1, designVariance - 1);
  }

  // Adjust Visual Density based on Tailwind class frequency
  const highSpacingCount = (code.match(/\b(p[xy]?|gap)-(?:16|20|24|32|40|48|64)\b/g) || []).length;
  const compactSpacingCount = (code.match(/\b(p[xy]?|gap)-(?:0|1|2|3|4|5|6)\b/g) || []).length;

  if (highSpacingCount > compactSpacingCount * 1.5) {
    visualDensity = Math.max(1, visualDensity - 2); // Generous whitespace
  } else if (compactSpacingCount > highSpacingCount * 1.5) {
    visualDensity = Math.min(10, visualDensity + 2); // Dense analytical rhythm
  }

  // 4. Scoring Calculations
  const highCount = violations.filter((v) => v.severity === "High").length;
  const medCount = violations.filter((v) => v.severity === "Medium").length;
  const lowCount = violations.filter((v) => v.severity === "Low").length + cssArbitraryViolations.length;

  const deductions = highCount * 15 + medCount * 8 + lowCount * 3;
  const craftScore = Math.max(0, 100 - deductions);

  let rating = "S - Flawless Quality";
  if (craftScore < 50) rating = "F - Serious Refactoring Required";
  else if (craftScore < 70) rating = "C - Moderate Slop Present";
  else if (craftScore < 85) rating = "B - Minor Tweaks Required";
  else if (craftScore < 98) rating = "A - High Standard Integrity";

  const pass = highCount === 0 && craftScore >= 85;

  // 5. Remediation Recommendations
  const remediationPlan: string[] = [];

  cssArbitraryViolations.forEach((v) => {
    remediationPlan.push(
      `[Line ${v.lineNum}] Replace arbitrary CSS escape '${v.arbitraryValue}' with tokenized equivalent '${v.recommendedToken}'.`
    );
  });

  violations.forEach((v) => {
    remediationPlan.push(`[Line ${v.lineNum}] ${v.ruleName} (${v.ruleId}): ${v.recommendation}`);
  });

  if (!shadersSafe) {
    remediationPlan.push(
      "Creative Canvas/Shader Guardrail: Add 'prefers-reduced-motion' listener and a static CSS fallback."
    );
  }

  if (remediationPlan.length === 0) {
    remediationPlan.push("Component exhibits flawless design hygiene and deterministic styling.");
  }

  // 6. Detailed Critique
  const critique = pass
    ? `Component '${componentName}' adheres to high-craft standards (Health Score: ${craftScore}/100, Rating: ${rating}). Calibrated Dials: Variance ${designVariance}/10, Motion ${motionIntensity}/10, Density ${visualDensity}/10. Guardrails verified: Shaders Safe: ${shadersSafe}, Glassmorphism Safe: ${glassmorphismSafe}, Token Rhythm Safe: ${tokenRhythmSafe}.`
    : `Component '${componentName}' failed automated taste review (Health Score: ${craftScore}/100, Rating: ${rating}). Detected ${violations.length} rule violation(s) and ${cssArbitraryViolations.length} arbitrary CSS anti-pattern(s). Review remediation plan to prevent unstyled layout breaks.`;

  return {
    componentName,
    pass,
    craftScore,
    rating,
    dials: {
      design_variance: designVariance,
      motion_intensity: motionIntensity,
      visual_density: visualDensity,
    },
    critique,
    cssArbitraryViolations,
    violations,
    remediationPlan,
    guardrails: {
      shadersSafe,
      glassmorphismSafe,
      tokenRhythmSafe,
      surfacesSafe,
    },
  };
}
