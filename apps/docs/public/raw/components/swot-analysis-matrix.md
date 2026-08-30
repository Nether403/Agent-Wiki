---
id: "swot-analysis-matrix"
name: "SWOT Strategic Analysis Matrix"
category: "ui:editorial"
library_origin: "https://github.com/cathrynlavery/diagram-design"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "layout-block"
  - "diagram"
  - "swot"
  - "matrix"
  - "strategic"
  - "diagram-design"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# SWOT Strategic Analysis Matrix (`swot-analysis-matrix`)
> 2x2 grid layout for Strengths, Weaknesses, Opportunities, and Threats with distinct visual accents.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, wai-aria-compliant, layout-block, diagram, swot, matrix, strategic, diagram-design
- **Design Dials**: Variance 5/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add swot-analysis-matrix

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/swot-analysis-matrix.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin diagram-design (https://github.com/cathrynlavery/diagram-design)
 * @author cathrynlavery & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ShieldCheck, AlertTriangle, TrendingUp, Zap } from "lucide-react";

export interface SwotQuadrant {
  title: string;
  items: string[];
}

export interface SwotAnalysisMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  strengths?: SwotQuadrant;
  weaknesses?: SwotQuadrant;
  opportunities?: SwotQuadrant;
  threats?: SwotQuadrant;
}

const DEFAULT_STRENGTHS: SwotQuadrant = {
  title: "Strengths (Internal)",
  items: [
    "Strict 35 Anti-Slop AST rules enforcing high visual craft",
    "Tailwind CSS v4 and native CSS variables alignment",
    "Sub-15KB token-optimized MCP payload delivery",
    "100% WCAG 2.1 AA verified accessible components",
  ],
};

const DEFAULT_WEAKNESSES: SwotQuadrant = {
  title: "Weaknesses (Internal)",
  items: [
    "Learning curve for legacy Tailwind v3 syntax users",
    "Strict TS compiler options reject loose 'any' assertions",
  ],
};

const DEFAULT_OPPORTUNITIES: SwotQuadrant = {
  title: "Opportunities (External)",
  items: [
    "Deep MCP integration with Claude Code, Cursor, and Windsurf",
    "Ecosystem transition to React 19 forwardRef-free primitives",
    "Zero-slop automated codemods for enterprise repos",
  ],
};

const DEFAULT_THREATS: SwotQuadrant = {
  title: "Threats (External)",
  items: [
    "Unanchored LLMs generating raw unstyled hex slop",
    "Rapidly shifting upstream dependencies in animation libraries",
  ],
};

export function SwotAnalysisMatrix({
  strengths = DEFAULT_STRENGTHS,
  weaknesses = DEFAULT_WEAKNESSES,
  opportunities = DEFAULT_OPPORTUNITIES,
  threats = DEFAULT_THREATS,
  className,
  ...props
}: SwotAnalysisMatrixProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm space-y-6",
        className
      )}
      role="region"
      aria-label="SWOT Strategic Matrix"
      {...props}
    >
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Strategic Matrix
        </h3>
        <p className="text-base font-bold text-foreground mt-0.5">
          SWOT Architectural Assessment
        </p>
      </div>

      {/* 2x2 Grid Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: Strengths */}
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{strengths.title}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-foreground">
            {strengths.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 2: Weaknesses */}
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{weaknesses.title}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-foreground">
            {weaknesses.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 3: Opportunities */}
        <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">
            <TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{opportunities.title}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-foreground">
            {opportunities.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 4: Threats */}
        <div className="p-5 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
          <div className="flex items-center gap-2 text-destructive font-semibold text-xs uppercase tracking-wider">
            <Zap className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{threats.title}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-foreground">
            {threats.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-destructive font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

```
