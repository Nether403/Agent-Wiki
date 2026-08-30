---
id: "interactive-roi-calculator"
name: "Interactive ROI & Savings Calculator"
category: "ui:block"
library_origin: "https://tailark.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "block"
  - "roi-calculator"
  - "marketing"
  - "pricing"
  - "tailark"
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

# Interactive ROI & Savings Calculator (`interactive-roi-calculator`)
> Marketing block with interactive price sliders, team size selectors, and dynamic cost savings calculations.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, block, roi-calculator, marketing, pricing, tailark
- **Design Dials**: Variance 5/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add interactive-roi-calculator

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/interactive-roi-calculator.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tailark / Shadcnblocks (https://tailark.com)
 * @author Tailark Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Calculator, DollarSign, Clock, Users, ArrowRight } from "lucide-react";

export interface InteractiveRoiCalculatorProps extends React.HTMLAttributes<HTMLDivElement> {
  hourlyDevRate?: number;
  hoursSavedPerWeekPerDev?: number;
}

export function InteractiveRoiCalculator({
  hourlyDevRate = 95,
  hoursSavedPerWeekPerDev = 6,
  className,
  ...props
}: InteractiveRoiCalculatorProps) {
  const [teamSize, setTeamSize] = React.useState(12);
  const [rate, setRate] = React.useState(hourlyDevRate);

  const annualSavings = React.useMemo(() => {
    return teamSize * rate * hoursSavedPerWeekPerDev * 50;
  }, [teamSize, rate, hoursSavedPerWeekPerDev]);

  const annualHoursSaved = React.useMemo(() => {
    return teamSize * hoursSavedPerWeekPerDev * 50;
  }, [teamSize, hoursSavedPerWeekPerDev]);

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border border-border bg-card p-6 sm:p-8 text-card-foreground shadow-lg space-y-6",
        className
      )}
      role="region"
      aria-label="Interactive Agent ROI Calculator"
      {...props}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            ROI & Efficiency Calculator
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Estimate yearly engineering savings by adopting zero-slop design system automation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Sliders Area */}
        <div className="space-y-5">
          {/* Slider 1: Team Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Team Engineers:
              </span>
              <span className="font-mono text-sm text-primary font-bold">{teamSize} devs</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              aria-label="Number of software engineers on team"
              className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-primary focus-visible:outline-none"
            />
          </div>

          {/* Slider 2: Blended Hourly Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Hourly Dev Cost:
              </span>
              <span className="font-mono text-sm text-primary font-bold">${rate}/hr</span>
            </div>
            <input
              type="range"
              min={50}
              max={250}
              step={5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              aria-label="Blended hourly engineering cost in USD"
              className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-primary focus-visible:outline-none"
            />
          </div>
        </div>

        {/* Output Metric Cards */}
        <div className="grid grid-cols-2 gap-4 p-6 rounded-2xl border border-primary/20 bg-primary/5">
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
              Annual Value
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              ${annualSavings.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase font-semibold flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Hours Saved
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
              {annualHoursSaved.toLocaleString()}h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

```
