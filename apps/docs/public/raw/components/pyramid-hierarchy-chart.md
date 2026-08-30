---
id: "pyramid-hierarchy-chart"
name: "Pyramid Hierarchy Chart"
category: "ui:editorial"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Pyramid Hierarchy Chart (`pyramid-hierarchy-chart`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add pyramid-hierarchy-chart

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/pyramid-hierarchy-chart.json
```

## Peer Dependencies
- None

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

export interface PyramidTier {
  level: number;
  title: string;
  description: string;
}

export interface PyramidHierarchyChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  tiers?: PyramidTier[];
}

const DEFAULT_TIERS: PyramidTier[] = [
  { level: 1, title: "Autonomous Experience", description: "Multi-agent coordination & full interactive workflows" },
  { level: 2, title: "High-Craft Blocks", description: "Asymmetrical heroes, bento grids, & feature cyclers" },
  { level: 3, title: "Motion & Creative Viewports", description: "Spring physics, WebGL viewports, & dot-matrix HUDs" },
  { level: 4, title: "Foundation Primitives", description: "Accessible headless buttons, inputs, dialogs, & tokens" },
];

export function PyramidHierarchyChart({
  title = "Machine-First Design Hierarchy Pyramid",
  tiers = DEFAULT_TIERS,
  className,
  ...props
}: PyramidHierarchyChartProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Pyramid Hierarchy Chart: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Stratified visual pyramid highlighting dependency layers from base primitives to agent workflows.
        </p>
      </header>

      <div className="flex flex-col md:flex-row items-center gap-8 justify-center py-4">
        {/* SVG Pyramid */}
        <div className="w-full max-w-sm">
          <svg viewBox="0 0 300 240" className="w-full h-auto overflow-visible" role="img" aria-label="Hierarchical pyramid">
            {/* Level 1 (Top) */}
            <polygon
              points="150,20 185,75 115,75"
              fill="currentColor"
              className="text-primary/40 stroke-primary stroke-1"
            />
            <text x="150" y="55" textAnchor="middle" className="fill-primary-foreground text-[10px] font-black">
              L1
            </text>

            {/* Level 2 */}
            <polygon
              points="112,80 188,80 220,130 80,130"
              fill="currentColor"
              className="text-primary/25 stroke-primary/50 stroke-1"
            />
            <text x="150" y="110" textAnchor="middle" className="fill-foreground text-[10px] font-bold">
              L2
            </text>

            {/* Level 3 */}
            <polygon
              points="77,135 223,135 255,185 45,185"
              fill="currentColor"
              className="text-muted/40 stroke-border stroke-1"
            />
            <text x="150" y="165" textAnchor="middle" className="fill-foreground text-[10px] font-bold">
              L3
            </text>

            {/* Level 4 (Base) */}
            <polygon
              points="42,190 258,190 290,240 10,240"
              fill="currentColor"
              className="text-muted/20 stroke-border stroke-1"
            />
            <text x="150" y="220" textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">
              L4: Foundation
            </text>
          </svg>
        </div>

        {/* Tier Legend & Descriptions */}
        <div className="flex flex-col space-y-3 flex-1">
          {tiers.map((tier) => (
            <div
              key={tier.level}
              className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20"
            >
              <div className="flex items-center justify-center h-6 w-6 rounded-md bg-primary text-primary-foreground text-xs font-bold shrink-0">
                L{tier.level}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">{tier.title}</span>
                <span className="text-[11px] text-muted-foreground mt-0.5">{tier.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

```
