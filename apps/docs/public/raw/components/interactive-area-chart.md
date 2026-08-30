---
id: "interactive-area-chart"
name: "Interactive Area Chart"
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
  - "area-chart"
  - "data-viz"
  - "tremor-raw"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Interactive Area Chart (`interactive-area-chart`)
> Responsive SVG area chart with linear gradient fill, brush timeline zoom, and interactive cursor tooltip.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, layout-block, chart, area-chart, data-viz, tremor-raw
- **Design Dials**: Variance 5/10 · Motion 3/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add interactive-area-chart

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/interactive-area-chart.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tremor Raw / Shadcn Chart (https://tremor.so)
 * @author Tremor Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DataPoint {
  date: string;
  value: number;
  secondaryValue?: number;
}

export interface InteractiveAreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  data?: DataPoint[];
  valuePrefix?: string;
  valueSuffix?: string;
}

const DEFAULT_DATA: DataPoint[] = [
  { date: "Jan", value: 1200, secondaryValue: 800 },
  { date: "Feb", value: 1900, secondaryValue: 1100 },
  { date: "Mar", value: 3000, secondaryValue: 1800 },
  { date: "Apr", value: 2400, secondaryValue: 2100 },
  { date: "May", value: 4100, secondaryValue: 2800 },
  { date: "Jun", value: 5200, secondaryValue: 3600 },
  { date: "Jul", value: 4800, secondaryValue: 4100 },
];

export function InteractiveAreaChart({
  title = "Token Usage Velocity",
  data = DEFAULT_DATA,
  valuePrefix = "",
  valueSuffix = " tok",
  className,
  ...props
}: InteractiveAreaChartProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const maxValue = React.useMemo(() => {
    return Math.max(...data.map((d) => Math.max(d.value, d.secondaryValue || 0))) * 1.15;
  }, [data]);

  const width = 600;
  const height = 220;
  const padding = 32;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
    return { x, y, data: d };
  });

  const svgPathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const areaPathD = `${svgPathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  const hoveredPoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm",
        className
      )}
      role="region"
      aria-label={`Interactive Area Chart: ${title}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
          <p className="text-xl font-bold font-mono text-foreground mt-0.5">
            {hoveredPoint
              ? `${valuePrefix}${hoveredPoint.data.value.toLocaleString()}${valueSuffix}`
              : `${valuePrefix}${data[data.length - 1].value.toLocaleString()}${valueSuffix}`}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary" /> Primary
          </span>
        </div>
      </div>

      {/* SVG Canvas Area Chart */}
      <div className="relative w-full h-56 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          role="img"
          aria-label={`Data chart for ${title}`}
        >
          <defs>
            <linearGradient id="areaGradientPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((lvl) => {
            const y = height - padding - lvl * (height - padding * 2);
            return (
              <line
                key={lvl}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Fill Area */}
          <path d={areaPathD} fill="url(#areaGradientPrimary)" />

          {/* Stroke Line */}
          <path
            d={svgPathD}
            fill="none"
            stroke="var(--color-primary, currentColor)"
            strokeWidth="2.5"
            className="text-primary transition-all duration-150"
          />

          {/* Interactive Cursor Points */}
          {points.map((pt, i) => (
            <g
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 6 : 3.5}
                className={cn(
                  "fill-background stroke-primary stroke-2 transition-all duration-150",
                  hoveredIdx === i && "fill-primary ring-4 ring-primary/20"
                )}
              />
              <text
                x={pt.x}
                y={height - 10}
                textAnchor="middle"
                className="fill-muted-foreground text-xs font-mono font-medium"
              >
                {pt.data.date}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
              transform: "translate(-50%, -120%)",
            }}
            className="absolute pointer-events-none px-2.5 py-1.5 rounded-xl bg-popover text-popover-foreground border border-border shadow-xl text-xs font-mono font-semibold"
          >
            <div>{hoveredPoint.data.date}</div>
            <div className="text-primary font-bold">
              {valuePrefix}
              {hoveredPoint.data.value.toLocaleString()}
              {valueSuffix}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

```
