"use client";

import * as React from "react";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Search,
  ExternalLink,
  Copy,
  Check,
  Sliders,
  Zap,
  ArrowRight,
  Flame,
} from "lucide-react";

interface ComponentCardData {
  name: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  variance: number;
  motion: number;
  density: number;
}

const CATALOG_SEED: ComponentCardData[] = [
  // Primitives
  {
    name: "button",
    title: "Button",
    category: "ui:primitive",
    description: "Polymorphic button with accessible variants and focus rings.",
    tags: ["tailwind-v4", "accessible", "radix-primitive"],
    variance: 2,
    motion: 2,
    density: 6,
  },
  {
    name: "input",
    title: "Input",
    category: "ui:primitive",
    description: "Accessible text input with error state and focus ring.",
    tags: ["tailwind-v4", "form", "accessible"],
    variance: 2,
    motion: 1,
    density: 7,
  },
  {
    name: "dialog",
    title: "Dialog",
    category: "ui:primitive",
    description: "Headless modal with focus trap and backdrop escape.",
    tags: ["radix-primitives", "modal", "a11y"],
    variance: 3,
    motion: 3,
    density: 5,
  },
  {
    name: "tabs",
    title: "Tabs",
    category: "ui:primitive",
    description: "Accessible tablist with keyboard arrow navigation.",
    tags: ["radix-primitives", "navigation", "headless"],
    variance: 3,
    motion: 2,
    density: 6,
  },
  {
    name: "switch",
    title: "Switch",
    category: "ui:primitive",
    description: "Accessible toggle switch with spring thumb.",
    tags: ["radix-primitives", "toggle", "form"],
    variance: 2,
    motion: 3,
    density: 7,
  },
  {
    name: "badge",
    title: "Badge",
    category: "ui:primitive",
    description: "Contrast-checked status pill using semantic design tokens.",
    tags: ["tailwind-v4", "indicator", "badge"],
    variance: 2,
    motion: 1,
    density: 8,
  },
  {
    name: "card",
    title: "Card",
    category: "ui:primitive",
    description: "Structural surface card with crisp border and zero slop.",
    tags: ["tailwind-v4", "surface", "layout"],
    variance: 3,
    motion: 1,
    density: 6,
  },
  {
    name: "dropdown-menu",
    title: "Dropdown Menu",
    category: "ui:primitive",
    description: "Keyboard-navigable dropdown with arrow navigation and ARIA menu attributes.",
    tags: ["radix-primitives", "menu", "navigation", "headless"],
    variance: 3,
    motion: 2,
    density: 6,
  },
  {
    name: "tooltip",
    title: "Tooltip",
    category: "ui:primitive",
    description: "Micro-tooltip with delay timers and instant focus visibility for screen readers.",
    tags: ["radix-primitives", "tooltip", "micro-interaction", "a11y"],
    variance: 2,
    motion: 2,
    density: 7,
  },
  {
    name: "avatar",
    title: "Avatar",
    category: "ui:primitive",
    description: "Fallback-aware image avatar with initials display and smooth loading states.",
    tags: ["radix-primitives", "avatar", "image", "headless"],
    variance: 2,
    motion: 1,
    density: 6,
  },
  // Motion
  {
    name: "floating-dock",
    title: "Floating Dock",
    category: "ui:motion",
    description: "macOS-style dock with mouse proximity magnification.",
    tags: ["motion/react", "spring-physics", "dock"],
    variance: 6,
    motion: 7,
    density: 4,
  },
  {
    name: "animated-tabs",
    title: "Animated Tabs",
    category: "ui:motion",
    description: "Smooth spring-bound slider with layoutId preservation.",
    tags: ["motion/react", "spring-physics", "tabs"],
    variance: 4,
    motion: 6,
    density: 5,
  },
  {
    name: "spring-dialog",
    title: "Spring Dialog",
    category: "ui:motion",
    description: "Scale-and-fade physics modal with AnimatePresence.",
    tags: ["motion/react", "modal", "spring-physics"],
    variance: 5,
    motion: 6,
    density: 5,
  },
  {
    name: "magnetic-button",
    title: "Magnetic Button",
    category: "ui:motion",
    description: "Physics cursor attraction button for high-taste CTAs.",
    tags: ["motion/react", "magnetic-physics", "interactive"],
    variance: 7,
    motion: 7,
    density: 5,
  },
  {
    name: "fluid-cursor",
    title: "Fluid Cursor",
    category: "ui:motion",
    description: "Smooth trailing cursor follower with graceful coarse-pointer (mobile) disablement.",
    tags: ["motion/react", "cursor-follower", "smooth-spring"],
    variance: 8,
    motion: 8,
    density: 3,
  },
  {
    name: "evil-button",
    title: "Evil Button",
    category: "ui:motion",
    description: "Playful tactile spring-physics button with audio feedback synthesis and chaotic states.",
    tags: ["playful", "framer-motion", "sound-physics", "interactive"],
    variance: 8,
    motion: 7,
    density: 5,
  },
  {
    name: "tilt-card",
    title: "Tilt Card",
    category: "ui:motion",
    description: "3D perspective card tilt responding to pointer movement with spring dampening.",
    tags: ["motion/react", "3d-tilt", "card", "spring-physics"],
    variance: 6,
    motion: 6,
    density: 5,
  },
  // Creative
  {
    name: "canvas-fluid-wave",
    title: "Canvas Fluid Wave",
    category: "ui:creative",
    description: "Interactive HTML5 canvas wave with reduced-motion fallback.",
    tags: ["canvas", "shader-simulation", "interactive"],
    variance: 8,
    motion: 9,
    density: 3,
  },
  {
    name: "dot-matrix-loader",
    title: "Dot Matrix Loader",
    category: "ui:creative",
    description: "Oscillating dot matrix with customizable rows and cols.",
    tags: ["dot-matrix", "canvas-pattern", "status"],
    variance: 6,
    motion: 5,
    density: 7,
  },
  {
    name: "noise-texture-card",
    title: "Noise Texture Card",
    category: "ui:creative",
    description: "Noise-dithered backdrop with crisp typography overlay.",
    tags: ["svg-noise", "editorial", "texture"],
    variance: 7,
    motion: 2,
    density: 6,
  },
  {
    name: "particle-field",
    title: "Particle Field",
    category: "ui:creative",
    description: "GPU-friendly interactive particle web with fallbacks.",
    tags: ["canvas", "particles", "physics"],
    variance: 8,
    motion: 8,
    density: 4,
  },
  // Editorial
  {
    name: "diagram-card",
    title: "Diagram Card",
    category: "ui:editorial",
    description: "Precision SVG diagramming card with minimal vector lines.",
    tags: ["editorial", "svg", "analytical"],
    variance: 5,
    motion: 1,
    density: 8,
  },
  {
    name: "data-stat-grid",
    title: "Data Stat Grid",
    category: "ui:editorial",
    description: "Asymmetrical metric showcase for SaaS analytics.",
    tags: ["analytical", "metrics", "saas"],
    variance: 4,
    motion: 1,
    density: 9,
  },
  {
    name: "minimal-table",
    title: "Minimal Table",
    category: "ui:editorial",
    description: "Clean tabular data display with accessible headers.",
    tags: ["table", "accessible", "data-grid"],
    variance: 3,
    motion: 1,
    density: 9,
  },
  // Blocks
  {
    name: "bento-grid",
    title: "Bento Grid",
    category: "ui:block",
    description: "Multi-pane asymmetrical layout grid with responsive spans.",
    tags: ["bento-grid", "layout-block", "marketing"],
    variance: 7,
    motion: 3,
    density: 6,
  },
  {
    name: "hero-section",
    title: "Hero Section",
    category: "ui:block",
    description: "Editorial SaaS hero section featuring typography discipline.",
    tags: ["hero", "marketing", "typography"],
    variance: 5,
    motion: 2,
    density: 5,
  },
  {
    name: "pricing-table",
    title: "Pricing Table",
    category: "ui:block",
    description: "Multi-tier pricing matrix with monthly/annual billing toggle.",
    tags: ["pricing", "saas", "interactive-toggle"],
    variance: 4,
    motion: 3,
    density: 7,
  },
  // Media
  {
    name: "timeline-player",
    title: "Timeline Player",
    category: "ui:media",
    description: "Precision timeline-based motion and video controller with frame scrubbing.",
    tags: ["remotion", "video", "motion", "timeline", "media"],
    variance: 7,
    motion: 8,
    density: 4,
  },
  // Utility
  {
    name: "dot-loader",
    title: "Dot Loader",
    category: "ui:utility",
    description: "Minimalist dot pulsation loader for button states.",
    tags: ["loader", "spinner", "utility"],
    variance: 2,
    motion: 4,
    density: 8,
  },
  {
    name: "icon-morph",
    title: "Icon Morph",
    category: "ui:utility",
    description: "Clean animated SVG state toggler with accessible title.",
    tags: ["icon", "svg", "morph"],
    variance: 3,
    motion: 4,
    density: 7,
  },
];

export default function HomePage() {
  const [copiedSlug, setCopiedSlug] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  // Interactive Taste-Dial Simulator states
  const [varianceDial, setVarianceDial] = React.useState(5);
  const [motionDial, setMotionDial] = React.useState(4);
  const [densityDial, setDensityDial] = React.useState(6);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(id);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const categories = [
    { id: "all", label: "All Items" },
    { id: "ui:primitive", label: "Primitives" },
    { id: "ui:motion", label: "Motion" },
    { id: "ui:creative", label: "Creative" },
    { id: "ui:editorial", label: "Editorial" },
    { id: "ui:block", label: "Blocks" },
    { id: "ui:media", label: "Media" },
    { id: "ui:utility", label: "Utility" },
  ];

  const filteredComponents = CATALOG_SEED.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header & Status Ribbon */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold font-mono">
              W
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                The Design Agent Wiki
              </h1>
              <p className="text-sm text-muted-foreground">
                Machine-First UI Registries & Anti-Slop Guardrails for AI Coding Agents
              </p>
            </div>
          </div>
        </div>

        {/* Anti-Slop Health Scorecard Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Health Score: 100/100 (S - Flawless Quality)</span>
          </div>
          <a
            href="/llms.txt"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Cpu className="h-3.5 w-3.5 text-primary" />
            <span>/llms.txt</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
          <a
            href="/r/registry.json"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>/r/registry.json</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        </div>
      </header>

      {/* Hero Value Banner */}
      <section className="mt-12 rounded-3xl border border-border bg-card/60 p-8 sm:p-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Deterministic Frontend Architecture</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Neutralize "AI Slop" at the Token Boundary.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            When coding agents generate UI without curated primitives, they produce brittle, unstyled boilerplate, hallucinate CSS properties, and violate accessibility. Our platform provides a verified token space through flat files, automated codemods, and the Model Context Protocol.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => copyToClipboard("npx @design-wiki/mcp", "mcp-cmd")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-mono font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>npx @design-wiki/mcp</span>
              {copiedSlug === "mcp-cmd" ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-60" />
              )}
            </button>
            <button
              onClick={() =>
                copyToClipboard(
                  "npx shadcn@latest add http://localhost:3000/r/floating-dock.json",
                  "shadcn-cmd"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-mono font-medium text-foreground transition-colors hover:bg-muted"
            >
              <span>npx shadcn add .../r/floating-dock.json</span>
              {copiedSlug === "shadcn-cmd" ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-60" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Taste-Dial Calibrator */}
      <section className="mt-12 rounded-3xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <Sliders className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">
            Taste-Dial Matrix Simulator
          </h3>
          <span className="ml-auto text-xs font-mono text-muted-foreground">
            Active Dial Calibration
          </span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          {/* Controls */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground font-semibold">
                  DESIGN_VARIANCE: {varianceDial}/10
                </span>
                <span className="text-muted-foreground">
                  {varianceDial <= 3
                    ? "Rigid / Centered"
                    : varianceDial <= 7
                    ? "Asymmetrical SaaS"
                    : "Avant-Garde Editorial"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={varianceDial}
                onChange={(e) => setVarianceDial(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground font-semibold">
                  MOTION_INTENSITY: {motionDial}/10
                </span>
                <span className="text-muted-foreground">
                  {motionDial <= 3
                    ? "Subtle Hover"
                    : motionDial <= 7
                    ? "Spring Transitions"
                    : "Canvas / WebGL"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={motionDial}
                onChange={(e) => setMotionDial(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground font-semibold">
                  VISUAL_DENSITY: {densityDial}/10
                </span>
                <span className="text-muted-foreground">
                  {densityDial <= 3
                    ? "Airy Whitespace"
                    : densityDial <= 7
                    ? "Balanced SaaS"
                    : "Dense Analytical Grid"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={densityDial}
                onChange={(e) => setDensityDial(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer accent-primary"
              />
            </div>

            <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
              <strong>Agent Contract:</strong> When your coding agent reads these dial values from <code>SKILL.md</code>, it automatically restricts its output variance, avoids arbitrary units, and picks matching components from the catalog.
            </div>
          </div>

          {/* Dynamic Preview Box */}
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-background/50 p-6 lg:col-span-7">
            <div
              style={{
                padding: `${densityDial <= 3 ? 32 : densityDial <= 7 ? 20 : 12}px`,
                transform: `rotate(${varianceDial > 7 ? -1 : 0}deg)`,
                transition: "all 0.3s ease",
              }}
              className="w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  Preview Card
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  Var:{varianceDial} Mot:{motionDial} Den:{densityDial}
                </span>
              </div>
              <h4 className="mt-3 text-base font-bold text-foreground">
                Autonomous UI Orchestration
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Rendered with zero chained type assertions, token-aligned spacing, and clean WCAG AA contrast standards.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  style={{
                    transform: motionDial > 6 ? "scale(1.02)" : "scale(1)",
                  }}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-transform"
                >
                  Action Trigger
                </button>
                <button className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Registry Explorer */}
      <section className="mt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Curated Component Directory ({filteredComponents.length} items)
            </h3>
            <p className="text-sm text-muted-foreground">
              Production-tested primitives conforming to shadcn schema v3 and strict anti-slop rules.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search components or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-4 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Component Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map((item) => (
            <div
              key={item.name}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                    <span>V:{item.variance}</span>
                    <span>·</span>
                    <span>M:{item.motion}</span>
                    <span>·</span>
                    <span>D:{item.density}</span>
                  </div>
                </div>

                <h4 className="mt-3 text-lg font-bold tracking-tight text-foreground">
                  {item.title}
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-secondary/70 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `npx shadcn@latest add http://localhost:3000/r/${item.name}.json`,
                      item.name
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
                >
                  {copiedSlug === item.name ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied install CLI!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Install Command</span>
                    </>
                  )}
                </button>

                <a
                  href={`/r/${item.name}.json`}
                  target="_blank"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <span>JSON</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-border pt-8 text-center text-xs text-muted-foreground">
        <p>
          Machine-First Design Agent Wiki · Grounding autonomous coding agents in deterministic, accessible UI primitives.
        </p>
      </footer>
    </div>
  );
}
