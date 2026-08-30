---
id: "donut-metric-card"
name: "Donut Metric Breakdown Card"
category: "ui:editorial"
library_origin: "https://tremor.so"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "layout-block"
  - "chart"
  - "donut-chart"
  - "metric-card"
  - "tremor-raw"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Donut Metric Breakdown Card (`donut-metric-card`)
> Donut chart featuring centered key metric, category percentage breakdown, and hover slice detachment.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, layout-block, chart, donut-chart, metric-card, tremor-raw
- **Design Dials**: Variance 5/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add donut-metric-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/donut-metric-card.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tremor Raw (https://tremor.so)
 * @author Tremor Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DonutCategory {
  label: string;
  value: number;
  color: string;
}

export interface DonutMetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  totalLabel?: string;
  categories?: DonutCategory[];
}

const DEFAULT_CATEGORIES: DonutCategory[] = [
  { label: "Claude 3.7", value: 45, color: "#3b82f6" },
  { label: "GPT-4o", value: 30, color: "#10b981" },
  { label: "Gemini 2.0", value: 15, color: "#f59e0b" },
  { label: "Local Models", value: 10, color: "#8b5cf6" },
];

export function DonutMetricCard({
  title = "Model Traffic Share",
  totalLabel = "Total Queries",
  categories = DEFAULT_CATEGORIES,
  className,
  ...props
}: DonutMetricCardProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const totalValue = React.useMemo(() => {
    return categories.reduce((sum, c) => sum + c.value, 0);
  }, [categories]);

  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentAngle = 0;

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm space-y-4",
        className
      )}
      role="region"
      aria-label={`Donut Metric Breakdown for ${title}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <span className="text-xs font-mono font-medium text-muted-foreground">
          100% Normalized
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* SVG Donut Chart */}
        <div className="relative flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
            role="img"
            aria-label={`Breakdown donut chart showing ${categories.length} segments`}
          >
            {categories.map((cat, idx) => {
              const strokeDasharray = `${(cat.value / totalValue) * circumference} ${circumference}`;
              const strokeDashoffset = -currentAngle;
              currentAngle += (cat.value / totalValue) * circumference;
              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={cat.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={cat.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="transition-all duration-200 cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Center Metric Label */}
          <div className="absolute flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-xl font-bold font-mono text-foreground">
              {hoveredIdx !== null ? `${categories[hoveredIdx].value}%` : `${totalValue}%`}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              {hoveredIdx !== null ? categories[hoveredIdx].label : totalLabel}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col space-y-2 w-full sm:w-auto">
          {categories.map((cat, idx) => (
            <div
              key={cat.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={cn(
                "flex items-center justify-between gap-4 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                hoveredIdx === idx ? "bg-muted font-semibold" : "hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden="true"
                />
                <span className="text-foreground">{cat.label}</span>
              </div>
              <span className="font-mono text-muted-foreground font-semibold">
                {cat.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

```
