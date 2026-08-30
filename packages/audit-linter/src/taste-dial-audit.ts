import fs from "fs";
import path from "path";

export interface TasteDialDeclaration {
  design_variance: number;
  motion_intensity: number;
  visual_density: number;
}

export interface DialAuditFinding {
  dial: "DESIGN_VARIANCE" | "MOTION_INTENSITY" | "VISUAL_DENSITY";
  declaredValue: number;
  inferredRange: [number, number];
  severity: "High" | "Medium" | "Low";
  message: string;
  recommendation: string;
}

export interface ComponentTasteAuditResult {
  filePath: string;
  slug: string;
  declaredDials: TasteDialDeclaration;
  findings: DialAuditFinding[];
  consistent: boolean;
  score: number;
}

export interface CatalogTasteAuditSummary {
  totalAudited: number;
  consistentCount: number;
  flaggedCount: number;
  averageScore: number;
  results: ComponentTasteAuditResult[];
}

/**
 * Evaluates whether a component's declared Taste Dials align with its AST and code characteristics.
 */
export function auditTasteDials(
  code: string,
  declaredDials: TasteDialDeclaration,
  filePath: string = "component.tsx"
): ComponentTasteAuditResult {
  const slug = path.basename(filePath, path.extname(filePath));
  const findings: DialAuditFinding[] = [];

  // --- 1. MOTION_INTENSITY AUDIT (1-10) ---
  const hasWebGL = /WebGL|Shader|PerspectiveCamera|Mesh|three/i.test(code);
  const hasCanvas = /<canvas|requestAnimationFrame|getContext\("2d"\)/i.test(code);
  const hasMotionReact = /motion\/react|framer-motion|useSpring|useMotionValue|AnimatePresence|layoutId/i.test(code);
  const hasContinuousAnimation = /animate-marquee|animate-spin|animate-bounce|animate-\[spin|setInterval/i.test(code);
  const hasCssTransition = /transition-colors|transition-transform|transition-opacity/i.test(code);

  let expectedMotionRange: [number, number] = [1, 3];
  if (hasWebGL || (hasCanvas && code.includes("requestAnimationFrame"))) {
    expectedMotionRange = [7, 10];
  } else if (hasMotionReact) {
    expectedMotionRange = [4, 8];
  } else if (hasContinuousAnimation) {
    expectedMotionRange = [4, 8];
  } else if (hasCssTransition) {
    expectedMotionRange = [1, 4];
  }

  if (declaredDials.motion_intensity < expectedMotionRange[0] - 1) {
    findings.push({
      dial: "MOTION_INTENSITY",
      declaredValue: declaredDials.motion_intensity,
      inferredRange: expectedMotionRange,
      severity: "Medium",
      message: `Declared motion_intensity (${declaredDials.motion_intensity}) is lower than expected based on active animation libraries.`,
      recommendation: `Increase motion_intensity to ${expectedMotionRange[0]}-${expectedMotionRange[1]} to reflect motion/canvas characteristics.`,
    });
  } else if (declaredDials.motion_intensity > expectedMotionRange[1] + 1 && !hasMotionReact && !hasCanvas && !hasWebGL && !hasContinuousAnimation) {
    findings.push({
      dial: "MOTION_INTENSITY",
      declaredValue: declaredDials.motion_intensity,
      inferredRange: expectedMotionRange,
      severity: "Low",
      message: `Declared high motion_intensity (${declaredDials.motion_intensity}) but component lacks dynamic motion or spring physics.`,
      recommendation: `Calibrate motion_intensity to ${expectedMotionRange[0]}-${expectedMotionRange[1]} or add spring micro-interactions.`,
    });
  }

  // --- 2. DESIGN_VARIANCE AUDIT (1-10) ---
  const hasAsymmetry = /rotate-\[|-rotate-|col-span-[2345]|row-span-|gap-8|bento/i.test(code);
  const hasBrutalist = /border-2|border-black|shadow-\[|font-mono|uppercase\s+tracking/i.test(code);
  const isRigidPrimitive = /^(button|input|badge|card|separator|skeleton)$/i.test(slug);

  let expectedVarianceRange: [number, number] = [2, 7];
  if (hasAsymmetry || hasBrutalist || hasWebGL) {
    expectedVarianceRange = [5, 10];
  } else if (isRigidPrimitive) {
    expectedVarianceRange = [1, 4];
  }

  if (isRigidPrimitive && declaredDials.design_variance > 5) {
    findings.push({
      dial: "DESIGN_VARIANCE",
      declaredValue: declaredDials.design_variance,
      inferredRange: expectedVarianceRange,
      severity: "Low",
      message: `Standard primitive '${slug}' has high variance (${declaredDials.design_variance}), expected conservative range.`,
      recommendation: `Adjust design_variance to 2-4 for predictable form/action primitives.`,
    });
  }

  // --- 3. VISUAL_DENSITY AUDIT (1-10) ---
  const hasDenseTable = /<table|<thead|<tbody|tabular-nums|data-grid/i.test(code);
  const hasAiryWhitespace = /py-20|py-24|py-32|p-12|p-16|h-screen/i.test(code);

  let expectedDensityRange: [number, number] = [3, 8];
  if (hasDenseTable) {
    expectedDensityRange = [7, 10];
  } else if (hasAiryWhitespace) {
    expectedDensityRange = [1, 4];
  }

  if (hasDenseTable && declaredDials.visual_density < 6) {
    findings.push({
      dial: "VISUAL_DENSITY",
      declaredValue: declaredDials.visual_density,
      inferredRange: expectedDensityRange,
      severity: "Low",
      message: `Dense analytical table '${slug}' declared low density (${declaredDials.visual_density}).`,
      recommendation: `Calibrate visual_density to 7-10 for analytical tables and metric displays.`,
    });
  }

  const deductions = findings.length * 10;
  const score = Math.max(0, 100 - deductions);

  return {
    filePath,
    slug,
    declaredDials,
    findings,
    consistent: findings.length === 0,
    score,
  };
}

/**
 * Audits all components in a registry directory for Taste Dial consistency
 */
export function auditCatalogTasteDials(registryDir: string): CatalogTasteAuditSummary {
  const results: ComponentTasteAuditResult[] = [];

  // Look for compiled registry.json to get accurate component dial declarations
  const registryJsonPaths = [
    path.resolve(registryDir, "../../dist/r/registry.json"),
    path.resolve(registryDir, "../../../apps/docs/public/r/registry.json"),
    path.resolve(process.cwd(), "packages/registry/dist/r/registry.json"),
    path.resolve(process.cwd(), "apps/docs/public/r/registry.json"),
    path.resolve(process.cwd(), "../registry/dist/r/registry.json"),
    path.resolve(process.cwd(), "../../apps/docs/public/r/registry.json"),
  ];

  const registryItemMap: Record<string, any> = {};
  for (const regPath of registryJsonPaths) {
    if (fs.existsSync(regPath)) {
      try {
        const items = JSON.parse(fs.readFileSync(regPath, "utf-8"));
        if (Array.isArray(items)) {
          items.forEach((item) => {
            if (item.name && item.dials) {
              registryItemMap[item.name.toLowerCase()] = item;
            }
          });
          break;
        }
      } catch {}
    }
  }

  const scan = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!["node_modules", ".git", "dist", ".next", "lib"].includes(entry.name)) {
          scan(fullPath);
        }
      } else if (/\.(tsx|ts)$/.test(entry.name) && !entry.name.endsWith(".d.ts") && !entry.name.includes("utils")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const slug = path.basename(entry.name, path.extname(entry.name)).toLowerCase();

        // 1. Check registry.json for calibrated dials
        const regItem = registryItemMap[slug];

        let dials: TasteDialDeclaration = regItem?.dials || {
          design_variance: 5,
          motion_intensity: 5,
          visual_density: 5,
        };

        // 2. Or check frontmatter
        const fmMatch = content.match(/dials:\s*\n\s*design_variance:\s*(\d+)\s*\n\s*motion_intensity:\s*(\d+)\s*\n\s*visual_density:\s*(\d+)/);
        if (fmMatch) {
          dials = {
            design_variance: parseInt(fmMatch[1], 10),
            motion_intensity: parseInt(fmMatch[2], 10),
            visual_density: parseInt(fmMatch[3], 10),
          };
        }

        const res = auditTasteDials(content, dials, fullPath);
        results.push(res);
      }
    }
  };

  scan(registryDir);

  const consistentCount = results.filter((r) => r.consistent).length;
  const flaggedCount = results.length - consistentCount;
  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 100;

  return {
    totalAudited: results.length,
    consistentCount,
    flaggedCount,
    averageScore,
    results,
  };
}
