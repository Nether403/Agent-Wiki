---
id: "structured-sla-slo-gauge"
name: "Structured S L A S L O Gauge"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
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

# Structured S L A S L O Gauge (`structured-sla-slo-gauge`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add structured-sla-slo-gauge

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/structured-sla-slo-gauge.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki (https://design-wiki.agent)
 * @author Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";

export interface StructuredSLASLOGaugeProps {
  targetPercent?: number;
  currentPercent?: number;
  serviceName?: string;
  errorBudgetBurnRate?: string;
  className?: string;
}

export function StructuredSLASLOGauge({
  targetPercent = 99.9,
  currentPercent = 99.95,
  serviceName = "Agent Wiki Edge Gateway",
  errorBudgetBurnRate = "0.2x (Nominal)",
  className = "",
}: StructuredSLASLOGaugeProps) {
  const isHealthy = currentPercent >= targetPercent;

  return (
    <div className={"w-full rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm flex flex-col items-center " + className}>
      <div className="w-full flex items-center justify-between pb-3 border-b border-border mb-4">
        <div>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Service Level Objective</span>
          <h3 className="text-sm font-semibold text-foreground tracking-tight">{serviceName}</h3>
        </div>
        <span
          className={
            "inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full " +
            (isHealthy ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10")
          }
        >
          {isHealthy ? <ShieldCheck className="w-3.5 h-3.5" role="img" aria-hidden="true" /> : <AlertCircle className="w-3.5 h-3.5" role="img" aria-hidden="true" />}
          {isHealthy ? "TARGET MET" : "BREACH"}
        </span>
      </div>

      {/* SVG Semi-Circle Gauge */}
      <div className="relative w-48 h-28 my-2 flex items-center justify-center">
        <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100" role="img" aria-label={`SLO Gauge: ${currentPercent}%`}>
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/40" strokeDasharray="125 250" />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="text-primary transition-[stroke-dashoffset] duration-500"
            strokeDasharray="125 250"
            strokeDashoffset={125 - 125 * (currentPercent / 100)}
          />
        </svg>
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-2xl font-bold font-mono tracking-tight text-foreground">{currentPercent}%</span>
          <span className="text-xs font-mono text-muted-foreground">Target: {targetPercent}%</span>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="w-full mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>Error Budget Burn</span>
        <span className="text-foreground">{errorBudgetBurnRate}</span>
      </div>
    </div>
  );
}

```
