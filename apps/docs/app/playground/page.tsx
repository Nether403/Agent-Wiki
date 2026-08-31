/**
 * @origin Machine-First Design Agent Wiki
 * @license MIT
 * Interactive Taste Dial Playground for Next.js 15 & Tailwind v4
 */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sliders,
  Sparkles,
  Layers,
  Terminal,
  Check,
  Copy,
  ArrowRight,
  Filter,
  Code2,
  Box,
  Eye,
} from "lucide-react";

interface ComponentPreset {
  slug: string;
  name: string;
  category: string;
  variance: number;
  motion: number;
  density: number;
  description: string;
  installCommand: string;
  sampleCode: string;
}

const PRESET_COMPONENTS: ComponentPreset[] = [
  {
    slug: "faceted-query-builder",
    name: "Faceted Query Builder",
    category: "ui:primitive",
    variance: 3,
    motion: 2,
    density: 7,
    description: "Cloudscape-inspired nested filter condition builder with AND/OR group toggles.",
    installCommand: "npx design-wiki add faceted-query-builder",
    sampleCode: `import { FacetedQueryBuilder } from "@/components/ui/faceted-query-builder";\n\nexport default function FilterView() {\n  return <FacetedQueryBuilder onQueryChange={console.log} />;\n}`,
  },
  {
    slug: "diff-hunk-viewer",
    name: "Diff Hunk Viewer",
    category: "ui:editorial",
    variance: 4,
    motion: 2,
    density: 8,
    description: "GitHub Primer style split and unified git diff viewer with line additions and inline comments.",
    installCommand: "npx design-wiki add diff-hunk-viewer",
    sampleCode: `import { DiffHunkViewer } from "@/components/ui/diff-hunk-viewer";\n\nexport default function ReviewView() {\n  return <DiffHunkViewer fileName="src/agent.ts" />;\n}`,
  },
  {
    slug: "multi-pane-workspace",
    name: "Multi-Pane Workspace",
    category: "ui:block",
    variance: 5,
    motion: 3,
    density: 8,
    description: "Enterprise 3-pane IDE workbench layout with collapsible tree explorer and telemetry drawer.",
    installCommand: "npx design-wiki add multi-pane-workspace",
    sampleCode: `import { MultiPaneWorkspace } from "@/components/ui/multi-pane-workspace";\n\nexport default function App() {\n  return <MultiPaneWorkspace title="Agent Studio" />;\n}`,
  },
  {
    slug: "data-grid-pivot-view",
    name: "Data Grid Pivot View",
    category: "ui:block",
    variance: 4,
    motion: 2,
    density: 8,
    description: "High-density enterprise data grid with column grouping chips and summary aggregation rows.",
    installCommand: "npx design-wiki add data-grid-pivot-view",
    sampleCode: `import { DataGridPivotView } from "@/components/ui/data-grid-pivot-view";\n\nexport default function TableView() {\n  return <DataGridPivotView />;\n}`,
  },
  {
    slug: "combobox-grouped-async",
    name: "Combobox Grouped Async",
    category: "ui:primitive",
    variance: 3,
    motion: 2,
    density: 7,
    description: "Ariakit-inspired accessible multi-select combobox with category headings and tag removal.",
    installCommand: "npx design-wiki add combobox-grouped-async",
    sampleCode: `import { ComboboxGroupedAsync } from "@/components/ui/combobox-grouped-async";\n\nexport default function FormView() {\n  return <ComboboxGroupedAsync label="Select Assets" />;\n}`,
  },
  {
    slug: "floating-dock",
    name: "Floating Dock",
    category: "ui:motion",
    variance: 6,
    motion: 8,
    density: 4,
    description: "macOS-style magnification dock with fluid spring physics and accessible tooltip pills.",
    installCommand: "npx design-wiki add floating-dock",
    sampleCode: `import { FloatingDock } from "@/components/ui/floating-dock";\n\nexport default function Nav() {\n  return <FloatingDock />;\n}`,
  },
  {
    slug: "google-gemini-glow-hero",
    name: "Google Gemini Glow Hero",
    category: "ui:block",
    variance: 8,
    motion: 6,
    density: 4,
    description: "Atmospheric multi-layered radial glow hero with responsive typography and primary action button.",
    installCommand: "npx design-wiki add google-gemini-glow-hero",
    sampleCode: `import { GoogleGeminiGlowHero } from "@/components/ui/google-gemini-glow-hero";\n\nexport default function Hero() {\n  return <GoogleGeminiGlowHero />;\n}`,
  },
];

export default function TasteDialPlaygroundPage() {
  const [variance, setVariance] = useState<number>(5);
  const [motion, setMotion] = useState<number>(4);
  const [density, setDensity] = useState<number>(6);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSlug, setSelectedSlug] = useState<string>("faceted-query-builder");
  const [copied, setCopied] = useState<boolean>(false);

  const filteredComponents = useMemo(() => {
    return PRESET_COMPONENTS.filter((comp) => {
      if (selectedCategory !== "all" && comp.category !== selectedCategory) return false;
      const varianceDiff = Math.abs(comp.variance - variance);
      const motionDiff = Math.abs(comp.motion - motion);
      const densityDiff = Math.abs(comp.density - density);
      return varianceDiff <= 4 && motionDiff <= 5 && densityDiff <= 4;
    });
  }, [variance, motion, density, selectedCategory]);

  const activeComponent = useMemo(() => {
    return (
      PRESET_COMPONENTS.find((c) => c.slug === selectedSlug) ||
      filteredComponents[0] ||
      PRESET_COMPONENTS[0]
    );
  }, [selectedSlug, filteredComponents]);

  const handleCopyInstall = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-xs">
                DW
              </span>
              Agent Wiki
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Taste Dial Playground
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/llms.txt"
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              llms.txt
            </Link>
          </div>
        </div>
      </header>

      {/* Main Studio */}
      <main className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Aesthetic Taste Dial Calibration Studio
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            Calibrate the 3 canonical Taste Dials (Variance, Motion, Density) to preview matching zero-slop UI components, test responsive layout density, and generate copy-pasteable CLI commands.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Controls: Taste Dials */}
          <section className="lg:col-span-4 space-y-6" aria-label="Taste Dial Controls">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Sliders className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-foreground">Active Calibration Matrix</h2>
              </div>

              <div className="mt-5 space-y-5">
                {/* Variance Dial */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <label htmlFor="variance-dial" className="text-foreground">
                      DESIGN_VARIANCE
                    </label>
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-primary font-bold">
                      {variance} / 10
                    </span>
                  </div>
                  <input
                    id="variance-dial"
                    type="range"
                    min="1"
                    max="10"
                    value={variance}
                    onChange={(e) => setVariance(Number(e.target.value))}
                    className="mt-2 w-full accent-primary cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>1: Rigid Baseline</span>
                    <span>5: Balanced SaaS</span>
                    <span>10: Asymmetric</span>
                  </div>
                </div>

                {/* Motion Dial */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <label htmlFor="motion-dial" className="text-foreground">
                      MOTION_INTENSITY
                    </label>
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-primary font-bold">
                      {motion} / 10
                    </span>
                  </div>
                  <input
                    id="motion-dial"
                    type="range"
                    min="1"
                    max="10"
                    value={motion}
                    onChange={(e) => setMotion(Number(e.target.value))}
                    className="mt-2 w-full accent-primary cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>1: Static/Hover</span>
                    <span>5: Springs</span>
                    <span>10: WebGL Shaders</span>
                  </div>
                </div>

                {/* Density Dial */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <label htmlFor="density-dial" className="text-foreground">
                      VISUAL_DENSITY
                    </label>
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-primary font-bold">
                      {density} / 10
                    </span>
                  </div>
                  <input
                    id="density-dial"
                    type="range"
                    min="1"
                    max="10"
                    value={density}
                    onChange={(e) => setDensity(Number(e.target.value))}
                    className="mt-2 w-full accent-primary cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>1: Generous Space</span>
                    <span>6: Balanced</span>
                    <span>10: Dense B2B</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-foreground">Taxonomy Category</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["all", "ui:primitive", "ui:block", "ui:motion", "ui:editorial"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "border border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat === "all" ? "All Domains" : cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right Stage: Matching Components & Live Inspector */}
          <section className="lg:col-span-8 space-y-6" aria-label="Component Preview Stage">
            {/* Matching Components Carousel / Grid */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Calibrated Registry Matches ({filteredComponents.length})
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground">Click component to inspect</span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredComponents.map((item) => (
                  <div
                    key={item.slug}
                    onClick={() => setSelectedSlug(item.slug)}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      activeComponent.slug === item.slug
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-background hover:border-border/80 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-semibold text-foreground">{item.name}</span>
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                      <span>V:{item.variance}</span>
                      <span>•</span>
                      <span>M:{item.motion}</span>
                      <span>•</span>
                      <span>D:{item.density}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Component Code & Installation Inspector */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{activeComponent.name}</h3>
                  <p className="text-xs text-muted-foreground">{activeComponent.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyInstall(activeComponent.installCommand)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied Command" : "Copy Install CLI"}
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
                  <span className="font-mono">{activeComponent.installCommand}</span>
                  <span className="text-[10px] text-emerald-500 font-semibold">100/100 Health Score</span>
                </div>

                <div className="rounded-lg border border-border bg-zinc-950 p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
                  <pre className="text-xs leading-relaxed">{activeComponent.sampleCode}</pre>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
