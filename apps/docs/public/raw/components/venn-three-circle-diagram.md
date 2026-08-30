---
id: "venn-three-circle-diagram"
name: "Venn Three Circle Diagram"
category: "ui:block"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "neon-scifi"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Venn Three Circle Diagram (`venn-three-circle-diagram`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, neon-scifi, accessible, keyboard-accessible, wai-aria-compliant, layout-block
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add venn-three-circle-diagram

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/venn-three-circle-diagram.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author Cathryn Lavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { CheckCircle2, CircleDot } from "lucide-react";

export interface VennDomain {
  id: "a" | "b" | "c" | "center";
  title: string;
  subtitle: string;
  colorClass?: string;
}

export interface VennThreeCircleDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  domains?: {
    a: VennDomain;
    b: VennDomain;
    c: VennDomain;
    center: VennDomain;
  };
}

const DEFAULT_DOMAINS = {
  a: {
    id: "a" as const,
    title: "Agent Intelligence",
    subtitle: "Context window grounding, tool selection, and cognitive planning loops.",
  },
  b: {
    id: "b" as const,
    title: "Curated Registries",
    subtitle: "Pre-tested, deterministic TSX primitives with zero hallucinations.",
  },
  c: {
    id: "c" as const,
    title: "Quality Release Gates",
    subtitle: "Automated WCAG AA linter, axe-core audits, and taste dial constraints.",
  },
  center: {
    id: "center" as const,
    title: "The Zero-Slop Standard",
    subtitle: "Production-ready, accessible UI shipped autonomously with zero rework.",
  },
};

export function VennThreeCircleDiagram({
  title = "Tripartite Intersection Matrix",
  subtitle = "Mathematical 3-set Venn diagram illustrating the convergence of elite AI frontend engineering.",
  domains = DEFAULT_DOMAINS,
  className,
  ...props
}: VennThreeCircleDiagramProps) {
  const [selectedDomain, setSelectedDomain] = React.useState<"a" | "b" | "c" | "center">("center");

  const currentInfo = domains[selectedDomain];

  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Three Circle Venn Diagram: ${title}`}
      {...props}
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-primary" aria-hidden="true" />
            <h3 className="text-sm font-bold tracking-tight text-foreground">{title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-mono text-muted-foreground self-start sm:self-auto">
          3-Set Venn Architecture
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Three Overlapping Circles */}
        <div className="lg:col-span-7 flex justify-center py-2">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            <svg
              viewBox="0 0 360 360"
              className="w-full h-full"
              role="img"
              aria-label="3-Circle Venn Diagram with selectable overlapping intersections"
            >
              <defs>
                <filter id="venn-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Circle A: Top-Left */}
              <circle
                cx="145"
                cy="145"
                r="105"
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  selectedDomain === "a"
                    ? "fill-primary/20 stroke-primary stroke-[2.5]"
                    : "fill-primary/5 stroke-border hover:stroke-muted-foreground stroke-1"
                )}
                onClick={() => setSelectedDomain("a")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedDomain("a");
                }}
                tabIndex={0}
                role="button"
                aria-label={`Domain A: ${domains.a.title}`}
              />

              {/* Circle B: Top-Right */}
              <circle
                cx="215"
                cy="145"
                r="105"
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  selectedDomain === "b"
                    ? "fill-primary/20 stroke-primary stroke-[2.5]"
                    : "fill-primary/5 stroke-border hover:stroke-muted-foreground stroke-1"
                )}
                onClick={() => setSelectedDomain("b")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedDomain("b");
                }}
                tabIndex={0}
                role="button"
                aria-label={`Domain B: ${domains.b.title}`}
              />

              {/* Circle C: Bottom-Center */}
              <circle
                cx="180"
                cy="225"
                r="105"
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  selectedDomain === "c"
                    ? "fill-primary/20 stroke-primary stroke-[2.5]"
                    : "fill-primary/5 stroke-border hover:stroke-muted-foreground stroke-1"
                )}
                onClick={() => setSelectedDomain("c")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedDomain("c");
                }}
                tabIndex={0}
                role="button"
                aria-label={`Domain C: ${domains.c.title}`}
              />

              {/* Center Tripartite Intersection Core Circle */}
              <circle
                cx="180"
                cy="172"
                r="38"
                filter="url(#venn-glow)"
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  selectedDomain === "center"
                    ? "fill-primary stroke-primary-foreground stroke-2"
                    : "fill-card stroke-primary stroke-2 hover:fill-muted"
                )}
                onClick={() => setSelectedDomain("center")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedDomain("center");
                }}
                tabIndex={0}
                role="button"
                aria-label={`Center Intersection: ${domains.center.title}`}
              />

              {/* Center Text Icon */}
              <text
                x="180"
                y="176"
                textAnchor="middle"
                className={cn(
                  "pointer-events-none text-[11px] font-bold font-mono tracking-wider",
                  selectedDomain === "center" ? "fill-primary-foreground" : "fill-primary"
                )}
              >
                CORE
              </text>

              {/* Labels on Outer Circles */}
              <text
                x="110"
                y="110"
                textAnchor="middle"
                className="pointer-events-none text-[11px] font-semibold fill-foreground"
              >
                Agent Skills
              </text>
              <text
                x="250"
                y="110"
                textAnchor="middle"
                className="pointer-events-none text-[11px] font-semibold fill-foreground"
              >
                Registries
              </text>
              <text
                x="180"
                y="275"
                textAnchor="middle"
                className="pointer-events-none text-[11px] font-semibold fill-foreground"
              >
                QA Gates
              </text>
            </svg>
          </div>
        </div>

        {/* Dynamic Detail Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-muted/20 p-4 transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                {selectedDomain === "center" ? "Harmonic Convergence" : `Pillar // 0${selectedDomain.toUpperCase()}`}
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground">{currentInfo.title}</h4>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {currentInfo.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(["a", "b", "c", "center"] as const).map((key) => {
              const item = domains[key];
              const isSelected = selectedDomain === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDomain(key)}
                  className={cn(
                    "flex flex-col p-2.5 rounded-md border text-left transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                  )}
                >
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                    {key === "center" ? "Center" : `Pillar ${key.toUpperCase()}`}
                  </span>
                  <span className="text-xs font-semibold mt-0.5 truncate text-foreground">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </figure>
  );
}

```
