---
id: "radar-spider-chart"
name: "Radar Spider Chart"
category: "ui:block"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "layout-block"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Radar Spider Chart (`radar-spider-chart`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, layout-block
- **Design Dials**: Variance 6/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add radar-spider-chart

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/radar-spider-chart.json
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

export interface RadarAxis {
  label: string;
  value: number; // 0-100
}

export interface RadarSpiderChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  axes?: RadarAxis[];
}

const DEFAULT_AXES: RadarAxis[] = [
  { label: "Accessibility AA", value: 100 },
  { label: "Token Hygiene", value: 95 },
  { label: "Performance & Leaks", value: 98 },
  { label: "Design Variance", value: 85 },
  { label: "Motion Fidelity", value: 90 },
  { label: "TypeScript Safety", value: 100 },
];

export function RadarSpiderChart({
  title = "Component Quality & Craft Radar",
  axes = DEFAULT_AXES,
  className,
  ...props
}: RadarSpiderChartProps) {
  const size = 260;
  const center = size / 2;
  const radius = 90;
  const numAxes = axes.length;

  // Calculate polygon points
  const points = axes
    .map((axis, i) => {
      const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
      const r = (axis.value / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Radar Spider Chart: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-4">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Multi-axis capability spider polygon evaluating 6 craft and compliance dimensions.
        </p>
      </header>

      <div className="flex items-center justify-center py-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[280px] h-auto overflow-visible"
          role="img"
          aria-label="Radar chart polygon"
        >
          {/* Background concentric rings */}
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <polygon
              key={scale}
              points={Array.from({ length: numAxes })
                .map((_, i) => {
                  const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                  const r = radius * scale;
                  const x = center + r * Math.cos(angle);
                  const y = center + r * Math.sin(angle);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
            />
          ))}

          {/* Radial axis lines & labels */}
          {axes.map((axis, i) => {
            const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            const labelX = center + (radius + 24) * Math.cos(angle);
            const labelY = center + (radius + 24) * Math.sin(angle) + 3;

            return (
              <g key={axis.label}>
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className="fill-muted-foreground text-xs font-medium"
                >
                  {axis.label}
                </text>
              </g>
            );
          })}

          {/* Value Polygon */}
          <polygon
            points={points}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary/25 stroke-primary"
          />
        </svg>
      </div>
    </figure>
  );
}

```
