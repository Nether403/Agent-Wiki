---
id: "circular-progress-meter"
name: "Circular Progress Meter"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Circular Progress Meter (`circular-progress-meter`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add circular-progress-meter

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/circular-progress-meter.json
```

## Peer Dependencies
- None

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin HeroUI (https://heroui.com)
 * @author HeroUI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  showValueLabel?: boolean;
  label?: string;
}

export function CircularProgressMeter({
  value = 75,
  size = 120,
  strokeWidth = 10,
  showValueLabel = true,
  label = "Quality Health Index",
  className,
  ...props
}: CircularProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-2 p-4", className)}
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      {...props}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="h-full w-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Progress ring">
          <title>Progress ring</title>
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-muted/40"
            fill="none"
          />
          {/* Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="stroke-primary transition-[stroke-dashoffset] duration-500 ease-out"
            fill="none"
          />
        </svg>

        {showValueLabel && (
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold tracking-tight text-foreground font-mono">
              {normalizedValue}%
            </span>
          </div>
        )}
      </div>

      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
    </div>
  );
}

```
