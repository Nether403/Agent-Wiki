---
id: "venn-comparison-matrix"
name: "Venn Comparison Matrix"
category: "ui:editorial"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "editorial"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 1     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 10       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Venn Comparison Matrix (`venn-comparison-matrix`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, editorial
- **Design Dials**: Variance 5/10 · Motion 1/10 · Density 10/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add venn-comparison-matrix

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/venn-comparison-matrix.json
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

export interface VennComparisonMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  leftLabel?: string;
  rightLabel?: string;
  centerLabel?: string;
  leftItems?: string[];
  rightItems?: string[];
  centerItems?: string[];
}

export function VennComparisonMatrix({
  title = "AI Agent Execution vs. Human Craft Venn Matrix",
  leftLabel = "Deterministic Agents",
  rightLabel = "Human Craft",
  centerLabel = "Agent Wiki Synergy",
  leftItems = ["100x Assembly Speed", "Zero Typos / Syntax Errors", "15KB Context Bound"],
  rightItems = ["Taste & Intuition", "Novel Brand Identity", "Cognitive Nuance"],
  centerItems = ["30 Anti-Slop Safeguards", "Calibrated 1-10 Dials", "100% WCAG AA Compliance"],
  className,
  ...props
}: VennComparisonMatrixProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Venn Diagram: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Mathematical intersection diagram demonstrating the union of agentic speed and human taste.
        </p>
      </header>

      <div className="relative w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 700 320"
          className="w-full min-w-[640px] h-auto overflow-visible"
          role="img"
          aria-label="2-circle overlapping Venn diagram"
        >
          {/* Left Circle: Agent */}
          <circle
            cx="270"
            cy="160"
            r="135"
            fill="currentColor"
            className="text-primary/10 stroke-primary/40 stroke-2"
          />

          {/* Right Circle: Human */}
          <circle
            cx="430"
            cy="160"
            r="135"
            fill="currentColor"
            className="text-muted/30 stroke-border stroke-2"
          />

          {/* Left Labels */}
          <g transform="translate(160, 90)">
            <text x="50" y="20" textAnchor="middle" className="fill-primary text-xs font-bold">
              {leftLabel}
            </text>
            {leftItems.map((item, i) => (
              <text
                key={item}
                x="50"
                y={55 + i * 22}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                • {item}
              </text>
            ))}
          </g>

          {/* Right Labels */}
          <g transform="translate(490, 90)">
            <text x="50" y="20" textAnchor="middle" className="fill-foreground text-xs font-bold">
              {rightLabel}
            </text>
            {rightItems.map((item, i) => (
              <text
                key={item}
                x="50"
                y={55 + i * 22}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                • {item}
              </text>
            ))}
          </g>

          {/* Center Intersection Labels */}
          <g transform="translate(350, 85)">
            <text x="0" y="20" textAnchor="middle" className="fill-primary text-xs font-black">
              {centerLabel}
            </text>
            {centerItems.map((item, i) => (
              <text
                key={item}
                x="0"
                y={55 + i * 22}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-medium"
              >
                ✓ {item}
              </text>
            ))}
          </g>
        </svg>
      </div>

      <footer className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>Zero-dependency mathematical SVG geometry</span>
        <span className="font-mono text-[11px]">Radius: 135px · Intersection: 60px</span>
      </footer>
    </figure>
  );
}

```
