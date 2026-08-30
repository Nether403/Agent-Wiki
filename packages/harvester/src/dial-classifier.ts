import { ComponentParsedMetadata } from "./ast-parser";

export interface DialScoreResult {
  category: "ui:primitive" | "ui:motion" | "ui:creative" | "ui:editorial" | "ui:block" | "ui:utility";
  dials: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
  tags: string[];
}

export function classifyComponentDials(
  meta: ComponentParsedMetadata,
  fileContent: string
): DialScoreResult {
  let category: DialScoreResult["category"] = "ui:primitive";
  const tags = new Set(meta.tags);

  let designVariance = 3;
  let motionIntensity = 2;
  let visualDensity = 6;

  // Classify by dominant capability
  if (meta.hasWebGL || meta.hasCanvas) {
    category = "ui:creative";
    motionIntensity = 9;
    designVariance = 8;
    visualDensity = 4;
  } else if (meta.hasMotion) {
    category = "ui:motion";
    motionIntensity = 7;
    designVariance = 5;
    visualDensity = 5;
  } else if (/Grid|Bento|Hero|Section|Pricing|Layout/i.test(meta.name) || meta.linesCount > 120) {
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
  } else if (/Loader|Icon|Spinner|Pill/i.test(meta.name) || meta.linesCount < 50) {
    category = "ui:utility";
    designVariance = 2;
    motionIntensity = 4;
    visualDensity = 7;
    tags.add("utility");
  }

  // Density adjustment
  const highSpacing = (fileContent.match(/p[xy]?-(?:16|20|24|32|40|48)/g) || []).length;
  const denseSpacing = (fileContent.match(/p[xy]?-(?:0|1|2|3|4|5|6)/g) || []).length;
  if (highSpacing > denseSpacing) visualDensity = Math.max(1, visualDensity - 2);
  if (denseSpacing > highSpacing) visualDensity = Math.min(10, visualDensity + 2);

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
