import fs from "fs";
import path from "path";
import { addComponent } from "./add";

export interface DeconstructOptions {
  cwd?: string;
  install?: boolean;
  outputPath?: string;
  registry?: string;
}

interface DetectedSection {
  tag: string;
  role?: string;
  detectedArchetype: string;
  recommendedRegistryComponent: string;
  confidence: number;
}

interface DomDeconstructionResult {
  title: string;
  layoutStructure: "single-column" | "sidebar-main" | "bento-dashboard" | "landing-page";
  detectedSections: DetectedSection[];
  suggestedInstallList: string[];
  cleanTsxScaffold: string;
}

export function deconstructHtmlMarkup(htmlContent: string): DomDeconstructionResult {
  const sections: DetectedSection[] = [];
  const installSet = new Set<string>();

  if (/<nav\b|<header\b/i.test(htmlContent)) {
    sections.push({
      tag: "header",
      role: "banner",
      detectedArchetype: "Navigation Bar",
      recommendedRegistryComponent: "navbar-sticky",
      confidence: 0.95,
    });
    installSet.add("navbar-sticky");
  }

  if (/class=["'][^"']*(?:hero|banner|headline|jumbotron)[^"']*["']/i.test(htmlContent) || /<h1\b/i.test(htmlContent)) {
    sections.push({
      tag: "section",
      role: "region",
      detectedArchetype: "Hero Section",
      recommendedRegistryComponent: "google-gemini-glow-hero",
      confidence: 0.9,
    });
    installSet.add("google-gemini-glow-hero");
  }

  if (/class=["'][^"']*(?:bento|grid-cols|features|cards)[^"']*["']/i.test(htmlContent)) {
    sections.push({
      tag: "section",
      role: "region",
      detectedArchetype: "Bento Feature Grid",
      recommendedRegistryComponent: "bento-spotlight-card",
      confidence: 0.88,
    });
    installSet.add("bento-spotlight-card");
  }

  if (/class=["'][^"']*(?:pricing|plan|tier|subscription)[^"']*["']/i.test(htmlContent) || /\$(?:\d+)/.test(htmlContent)) {
    sections.push({
      tag: "section",
      role: "region",
      detectedArchetype: "Pricing Tier Matrix",
      recommendedRegistryComponent: "pricing-table",
      confidence: 0.92,
    });
    installSet.add("pricing-table");
  }

  if (/<table\b|class=["'][^"']*(?:data-table|datagrid|filter-bar)[^"']*["']/i.test(htmlContent)) {
    sections.push({
      tag: "section",
      role: "region",
      detectedArchetype: "Faceted Data Grid",
      recommendedRegistryComponent: "data-grid-pivot-view",
      confidence: 0.89,
    });
    installSet.add("data-grid-pivot-view");
  }

  if (/<footer\b|class=["'][^"']*(?:footer|bottom-nav)[^"']*["']/i.test(htmlContent)) {
    sections.push({
      tag: "footer",
      role: "contentinfo",
      detectedArchetype: "Footer Mega Menu",
      recommendedRegistryComponent: "footer-mega-menu",
      confidence: 0.96,
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

export async function deconstructCommand(targetInput: string, options: DeconstructOptions = {}): Promise<void> {
  const cwd = path.resolve(options.cwd || process.cwd());
  console.log(`\n🔍 [Deconstruct Engine] Analyzing input reference: ${targetInput}...`);

  let htmlContent = "";
  if (fs.existsSync(targetInput)) {
    htmlContent = fs.readFileSync(targetInput, "utf-8");
  } else if (targetInput.startsWith("<")) {
    htmlContent = targetInput;
  } else {
    console.error(`❌ Input file not found or invalid HTML string: ${targetInput}`);
    process.exit(1);
  }

  const result = deconstructHtmlMarkup(htmlContent);

  console.log(`\n📐 Layout Structure Detected: ${result.layoutStructure}`);
  console.log(`📋 Detected Sections & Components:`);
  result.detectedSections.forEach((s: DetectedSection, idx: number) => {
    console.log(`   ${idx + 1}. [${s.tag}] ${s.detectedArchetype} -> Match: '${s.recommendedRegistryComponent}' (Confidence: ${Math.round(s.confidence * 100)}%)`);
  });

  console.log(`\n📦 Suggested Registry Components to Install:`);
  console.log(`   ${result.suggestedInstallList.join(", ")}`);

  if (options.install) {
    console.log(`\n⚡ Installing suggested components into target workspace...`);
    for (const slug of result.suggestedInstallList) {
      await addComponent(slug, { cwd, registry: options.registry });
    }
  }

  if (options.outputPath) {
    const destPath = path.resolve(cwd, options.outputPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, result.cleanTsxScaffold, "utf-8");
    console.log(`\n✓ Generated zero-slop scaffold written to: ${destPath}`);
  } else {
    console.log(`\n✨ Synthesized Zero-Slop TSX Scaffold:`);
    console.log("----------------------------------------");
    console.log(result.cleanTsxScaffold);
    console.log("----------------------------------------");
    console.log(`Tip: Run with --install to download dependencies, or --output <path> to write to disk.`);
  }
}
