---
id: "strategic-quadrant-matrix"
name: "Strategic Quadrant Matrix"
category: "ui:utility"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "utility"
dials:
  design_variance: 2      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 9       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Strategic Quadrant Matrix (`strategic-quadrant-matrix`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:utility`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, utility
- **Design Dials**: Variance 2/10 · Motion 4/10 · Density 9/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add strategic-quadrant-matrix

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/strategic-quadrant-matrix.json
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

export interface QuadrantItem {
  id: string;
  name: string;
  x: number; // 0 to 100
  y: number; // 0 to 100
  category?: string;
}

export interface StrategicQuadrantMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  topLeftLabel?: string;
  topRightLabel?: string;
  bottomLeftLabel?: string;
  bottomRightLabel?: string;
  items?: QuadrantItem[];
}

const DEFAULT_ITEMS: QuadrantItem[] = [
  { id: "1", name: "AI Artifact Canvas", x: 85, y: 90 },
  { id: "2", name: "ReUI Data Grid", x: 80, y: 75 },
  { id: "3", name: "Motion Dialog", x: 65, y: 60 },
  { id: "4", name: "Generic Indigo Button", x: 20, y: 15 },
  { id: "5", name: "Standard Input", x: 25, y: 70 },
];

export function StrategicQuadrantMatrix({
  title = "Impact vs. Implementation Effort Matrix",
  xAxisLabel = "Implementation Effort →",
  yAxisLabel = "User Value & Impact ↑",
  topLeftLabel = "Quick Wins (High Value, Low Effort)",
  topRightLabel = "Strategic Bets (High Value, High Effort)",
  bottomLeftLabel = "Low Priority",
  bottomRightLabel = "Time Traps (Low Value, High Effort)",
  items = DEFAULT_ITEMS,
  className,
  ...props
}: StrategicQuadrantMatrixProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Strategic 2x2 Quadrant Matrix: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          2x2 analytical decision quadrant plotting components by architectural complexity and design impact.
        </p>
      </header>

      <div className="relative w-full max-w-xl mx-auto aspect-square border border-border rounded-xl bg-muted/10 p-6">
        {/* Quadrant Axis Dividers */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/80" aria-hidden="true" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border/80" aria-hidden="true" />

        {/* Quadrant Region Labels */}
        <div className="absolute top-3 left-4 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          {topLeftLabel}
        </div>
        <div className="absolute top-3 right-4 text-[10px] font-bold text-primary">
          {topRightLabel}
        </div>
        <div className="absolute bottom-3 left-4 text-[10px] font-bold text-muted-foreground">
          {bottomLeftLabel}
        </div>
        <div className="absolute bottom-3 right-4 text-[10px] font-bold text-destructive">
          {bottomRightLabel}
        </div>

        {/* Plotted Items */}
        {items.map((item) => {
          return (
            <div
              key={item.id}
              style={{
                left: `${item.x}%`,
                bottom: `${item.y}%`,
                transform: "translate(-50%, 50%)",
              }}
              className="absolute group z-10 cursor-pointer"
            >
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-background border border-border shadow-xs text-[10px] font-semibold hover:border-primary transition-colors">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                <span>{item.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-6 flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>{yAxisLabel}</span>
        <span>{xAxisLabel}</span>
      </footer>
    </figure>
  );
}

```
