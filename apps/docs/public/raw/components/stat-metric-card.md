---
id: "stat-metric-card"
name: "Stat Metric Card"
category: "ui:editorial"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
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

# Stat Metric Card (`stat-metric-card`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, wai-aria-compliant, editorial
- **Design Dials**: Variance 5/10 · Motion 1/10 · Density 10/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add stat-metric-card

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/stat-metric-card.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatMetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: number; // e.g. +14.2
  period?: string; // e.g. "vs last month"
  sparklineData?: number[];
  icon?: React.ComponentType<{ className?: string }>;
}

export function StatMetricCard({
  title,
  value,
  change,
  period = "vs last period",
  sparklineData = [12, 18, 14, 22, 28, 24, 32],
  icon: Icon,
  className,
  ...props
}: StatMetricCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  // Render SVG Sparkline
  const maxVal = Math.max(...sparklineData, 1);
  const minVal = Math.min(...sparklineData, 0);
  const range = maxVal - minVal || 1;
  const width = 80;
  const height = 28;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <article
      className={cn(
        "flex flex-col p-4 rounded-xl border border-border bg-card text-card-foreground shadow-xs transition-colors hover:border-primary/40 space-y-3",
        className
      )}
      aria-label={`Metric card for ${title}`}
      {...props}
    >
      <header className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        {Icon && (
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-muted/60 text-muted-foreground" aria-hidden="true">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </header>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold text-foreground tracking-tight">{value}</div>

        {/* Inline Sparkline */}
        {sparklineData.length > 1 && (
          <svg
            className="h-7 w-20 overflow-visible text-primary shrink-0"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-hidden="true"
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        )}
      </div>

      {/* Delta Badge & Period */}
      {change !== undefined && (
        <footer className="flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "flex items-center gap-0.5 px-1.5 py-0.2 rounded font-semibold text-[11px]",
              isPositive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              isNegative && "bg-destructive/10 text-destructive",
              !isPositive && !isNegative && "bg-muted text-muted-foreground"
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3 inline" aria-hidden="true" />}
            {isNegative && <TrendingDown className="h-3 w-3 inline" aria-hidden="true" />}
            {!isPositive && !isNegative && <Minus className="h-3 w-3 inline" aria-hidden="true" />}
            {Math.abs(change)}%
          </span>
          <span className="text-[11px] text-muted-foreground">{period}</span>
        </footer>
      )}
    </article>
  );
}

```
