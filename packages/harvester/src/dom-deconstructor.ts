/**
 * @origin Machine-First Design Agent Wiki Harvester
 * @license MIT
 * @description HTML and DOM structure deconstructor mapping arbitrary web pages into Agent Wiki component trees
 */

export interface DeconstructedSection {
  tag: string;
  role?: string;
  detectedArchetype: string;
  recommendedRegistryComponent: string;
  confidence: number;
  extractedTextSnippet?: string;
}

export interface DomDeconstructionResult {
  title: string;
  layoutStructure: "single-column" | "sidebar-main" | "bento-dashboard" | "landing-page";
  detectedSections: DeconstructedSection[];
  suggestedInstallList: string[];
  cleanTsxScaffold: string;
}

export function deconstructHtmlMarkup(htmlContent: string): DomDeconstructionResult {
  const sections: DeconstructedSection[] = [];
  const installSet = new Set<string>();

  // Check for navigation / header
  if (/<nav\b|<header\b/i.test(htmlContent)) {
    sections.push({
      tag: "header",
      role: "banner",
      detectedArchetype: "Navigation Bar",
      recommendedRegistryComponent: "navbar-sticky",
      confidence: 0.95,
      extractedTextSnippet: "Top navigation header with responsive actions",
    });
    installSet.add("navbar-sticky");
  }

  // Check for hero block
  if (/class=["'][^"']*(?:hero|banner|headline|jumbotron)[^"']*["']/i.test(htmlContent) || /<h1\b/i.test(htmlContent)) {
    sections.push({
      tag: "section",
      role: "region",
      detectedArchetype: "Hero Section",
      recommendedRegistryComponent: "google-gemini-glow-hero",
      confidence: 0.9,
      extractedTextSnippet: "Main promotional hero section with call-to-action",
    });
    installSet.add("google-gemini-glow-hero");
  }

  // Check for bento grid / feature cards
  if (/class=["'][^"']*(?:bento|grid-cols|features|cards)[^"']*["']/i.test(htmlContent)) {
    sections.push({
      tag: "section",
      role: "region",
      detectedArchetype: "Bento Feature Grid",
      recommendedRegistryComponent: "bento-spotlight-card",
      confidence: 0.88,
      extractedTextSnippet: "Feature showcase bento grid with spotlight hover",
    });
    installSet.add("bento-spotlight-card");
  }

  // Check for pricing table
  if (/class=["'][^"']*(?:pricing|plan|tier|subscription)[^"']*["']/i.test(htmlContent) || /\$(?:\d+)/.test(htmlContent)) {
    sections.push({
      tag: "section",
      role: "region",
      detectedArchetype: "Pricing Tier Matrix",
      recommendedRegistryComponent: "pricing-table",
      confidence: 0.92,
      extractedTextSnippet: "Interactive pricing tier table with feature checks",
    });
    installSet.add("pricing-table");
  }

  // Check for data table / query filter
  if (/<table\b|class=["'][^"']*(?:data-table|datagrid|filter-bar)[^"']*["']/i.test(htmlContent)) {
    sections.push({
      tag: "section",
      role: "region",
      detectedArchetype: "Faceted Data Grid",
      recommendedRegistryComponent: "data-grid-pivot-view",
      confidence: 0.89,
      extractedTextSnippet: "High-density data table with sorting and faceted filtering",
    });
    installSet.add("data-grid-pivot-view");
  }

  // Check for footer
  if (/<footer\b|class=["'][^"']*(?:footer|bottom-nav)[^"']*["']/i.test(htmlContent)) {
    sections.push({
      tag: "footer",
      role: "contentinfo",
      detectedArchetype: "Footer Mega Menu",
      recommendedRegistryComponent: "footer-mega-menu",
      confidence: 0.96,
      extractedTextSnippet: "Sitemap footer links and copyright branding",
    });
    installSet.add("footer-mega-menu");
  }

  const layoutStructure =
    installSet.has("data-grid-pivot-view")
      ? "bento-dashboard"
      : installSet.has("google-gemini-glow-hero")
      ? "landing-page"
      : "single-column";

  const cleanScaffold = `// Auto-synthesized zero-slop layout scaffold
import React from "react";
${Array.from(installSet)
  .map(
    (slug) =>
      `import { ${slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("")} } from "@/components/ui/${slug}";`
  )
  .join("\n")}

export default function DeconstructedPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      ${sections
        .map(
          (s) =>
            `<${s.recommendedRegistryComponent
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join("")} />`
        )
        .join("\n      ")}
    </div>
  );
}
`;

  return {
    title: "Deconstructed Web Layout",
    layoutStructure,
    detectedSections: sections,
    suggestedInstallList: Array.from(installSet),
    cleanTsxScaffold: cleanScaffold,
  };
}
