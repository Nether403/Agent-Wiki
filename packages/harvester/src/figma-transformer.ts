/**
 * @origin Machine-First Design Agent Wiki Harvester
 * @license MIT
 * @description Figma node tree & Tokens Studio JSON transformer to Tailwind v4 @theme and component specs
 */

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX";
  itemSpacing?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  fills?: Array<{ type: string; color?: FigmaColor; opacity?: number }>;
  strokes?: Array<{ type: string; color?: FigmaColor }>;
  strokeWeight?: number;
  cornerRadius?: number;
  characters?: string;
  children?: FigmaNode[];
}

export interface TransformedFigmaResult {
  tailwindClasses: string[];
  themeTokens: Record<string, string>;
  componentArchetype: string;
  matchedRegistrySlugs: string[];
  suggestedMarkup: string;
}

function rgbToHex(c: FigmaColor): string {
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function transformFigmaNode(node: FigmaNode): TransformedFigmaResult {
  const classes: string[] = [];
  const themeTokens: Record<string, string> = {};
  const matchedSlugs: string[] = [];

  // Layout mode
  if (node.layoutMode === "HORIZONTAL") {
    classes.push("flex", "flex-row");
    if (node.counterAxisAlignItems === "CENTER") classes.push("items-center");
    if (node.primaryAxisAlignItems === "SPACE_BETWEEN") classes.push("justify-between");
  } else if (node.layoutMode === "VERTICAL") {
    classes.push("flex", "flex-col");
    if (node.counterAxisAlignItems === "CENTER") classes.push("items-center");
  }

  // Spacing / Gap
  if (node.itemSpacing) {
    if (node.itemSpacing <= 4) classes.push("gap-1");
    else if (node.itemSpacing <= 8) classes.push("gap-2");
    else if (node.itemSpacing <= 16) classes.push("gap-4");
    else if (node.itemSpacing <= 24) classes.push("gap-6");
    else classes.push("gap-8");
  }

  // Padding
  if (node.paddingTop || node.paddingBottom) {
    const pad = Math.max(node.paddingTop || 0, node.paddingBottom || 0);
    if (pad <= 8) classes.push("py-2");
    else if (pad <= 16) classes.push("py-4");
    else if (pad <= 24) classes.push("py-6");
    else classes.push("py-8");
  }
  if (node.paddingLeft || node.paddingRight) {
    const pad = Math.max(node.paddingLeft || 0, node.paddingRight || 0);
    if (pad <= 8) classes.push("px-2");
    else if (pad <= 16) classes.push("px-4");
    else if (pad <= 24) classes.push("px-6");
    else classes.push("px-8");
  }

  // Background Fills
  if (node.fills && node.fills.length > 0) {
    const solidFill = node.fills.find((f) => f.type === "SOLID" && f.color);
    if (solidFill && solidFill.color) {
      const hex = rgbToHex(solidFill.color);
      themeTokens["--color-surface-custom"] = hex;
      classes.push("bg-card", "text-card-foreground");
    }
  }

  // Borders & Rounded Corners
  if (node.strokes && node.strokes.length > 0) {
    classes.push("border", "border-border");
  }
  if (node.cornerRadius) {
    if (node.cornerRadius >= 16) classes.push("rounded-2xl");
    else if (node.cornerRadius >= 12) classes.push("rounded-xl");
    else if (node.cornerRadius >= 8) classes.push("rounded-lg");
    else if (node.cornerRadius >= 4) classes.push("rounded-md");
  }

  // Classify archetype & matched registry components
  const nodeNameLower = (node.name || "").toLowerCase();
  let archetype = "generic-card";

  if (nodeNameLower.includes("button") || nodeNameLower.includes("cta")) {
    archetype = "button";
    matchedSlugs.push("button", "shimmer-button", "magnetic-button");
  } else if (nodeNameLower.includes("modal") || nodeNameLower.includes("dialog")) {
    archetype = "dialog";
    matchedSlugs.push("dialog", "spring-dialog", "morphing-dialog");
  } else if (nodeNameLower.includes("pricing") || nodeNameLower.includes("tier")) {
    archetype = "pricing-table";
    matchedSlugs.push("pricing-table", "pricing-tier-feature-matrix");
  } else if (nodeNameLower.includes("table") || nodeNameLower.includes("grid")) {
    archetype = "data-grid";
    matchedSlugs.push("data-grid-pivot-view", "reui-data-grid", "data-table-server-faceted");
  } else if (nodeNameLower.includes("hero") || nodeNameLower.includes("banner")) {
    archetype = "hero-section";
    matchedSlugs.push("hero-section", "google-gemini-glow-hero", "dark-brutalist-hero");
  } else if (nodeNameLower.includes("query") || nodeNameLower.includes("filter")) {
    archetype = "query-builder";
    matchedSlugs.push("faceted-query-builder", "faceted-filter-bar");
  } else {
    matchedSlugs.push("card", "bento-spotlight-card", "tilt-card");
  }

  const markup = `<div className="${classes.join(" ")}">\n  {/* Deconstructed from Figma Node: ${node.name} */}\n  {children}\n</div>`;

  return {
    tailwindClasses: classes,
    themeTokens,
    componentArchetype: archetype,
    matchedRegistrySlugs: Array.from(new Set(matchedSlugs)),
    suggestedMarkup: markup,
  };
}
