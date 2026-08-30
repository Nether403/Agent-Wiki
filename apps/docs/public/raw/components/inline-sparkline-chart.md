---
id: "inline-sparkline-chart"
name: "Inline Sparkline Chart"
category: "ui:editorial"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "wai-aria-compliant"
  - "editorial"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 1     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 9       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Inline Sparkline Chart (`inline-sparkline-chart`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: wai-aria-compliant, editorial
- **Design Dials**: Variance 5/10 · Motion 1/10 · Density 9/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add inline-sparkline-chart

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/inline-sparkline-chart.json
```

## Peer Dependencies
- None

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin shadcn/ui Charts & ReUI (https://reui.io)
 * @author Keenthemes & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface InlineSparklineChartProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  variant?: "area" | "line" | "bar";
  color?: string;
  fillOpacity?: number;
}

export function InlineSparklineChart({
  data = [10, 15, 8, 22, 18, 26, 35],
  width = 120,
  height = 36,
  strokeWidth = 2,
  variant = "area",
  color = "currentColor",
  fillOpacity = 0.15,
  className,
  ...props
}: InlineSparklineChartProps) {
  if (!data || data.length === 0) return null;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const padding = 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((val - minVal) / range) * (height - padding * 2 - strokeWidth) - padding;
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const areaPath = `M ${points[0].x},${height} L ${polylinePoints.replace(/ /g, " L ")} L ${points[points.length - 1].x},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible text-primary inline-block shrink-0", className)}
      role="img"
      aria-label={`Inline sparkline trend with ${data.length} datapoints`}
      {...props}
    >
      {variant === "area" && (
        <path d={areaPath} fill={color} fillOpacity={fillOpacity} />
      )}

      {variant === "bar" ? (
        data.map((val, i) => {
          const barWidth = Math.max(2, (width / data.length) - 2);
          const barHeight = ((val - minVal) / range) * (height - 4);
          const x = i * (width / data.length) + 1;
          const y = height - barHeight - 2;
          return (
            <rect
              key={`bar-${i}`}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={1}
              fill={color}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          );
        })
      ) : (
        <polyline
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />
      )}
    </svg>
  );
}

```
