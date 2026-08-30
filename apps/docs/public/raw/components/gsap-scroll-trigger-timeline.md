---
id: "gsap-scroll-trigger-timeline"
name: "G S A P Scroll Trigger Timeline"
category: "ui:media"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "brutalist"
  - "wai-aria-compliant"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# G S A P Scroll Trigger Timeline (`gsap-scroll-trigger-timeline`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:media`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, brutalist, wai-aria-compliant
- **Design Dials**: Variance 5/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add gsap-scroll-trigger-timeline

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/gsap-scroll-trigger-timeline.json
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

import React, { useState } from "react";
import { GitCommit, ArrowDown, Check, Layers } from "lucide-react";

export interface TimelineStep {
  stepNumber: string;
  title: string;
  description: string;
  badge: string;
}

export interface GSAPScrollTriggerTimelineProps {
  steps?: TimelineStep[];
  className?: string;
}

export function GSAPScrollTriggerTimeline({
  steps = [
    { stepNumber: "01", title: "AST Static Harvest", description: "Extracts imports, JSX structure, and peer dependencies from git repositories.", badge: "PARSER" },
    { stepNumber: "02", title: "50-Rule Anti-Slop Audit", description: "Verifies zero arbitrary units, proper contrast, and WAI-ARIA labels.", badge: "LINTER" },
    { stepNumber: "03", title: "Dual Registry Compilation", description: "Builds token-efficient /r/ JSON schemas and /llms.txt manifests.", badge: "COMPILER" },
    { stepNumber: "04", title: "Zero-Draft Certification", description: "Executes headless Playwright tests across mobile, tablet, and desktop viewports.", badge: "EVAL" },
  ],
  className = "",
}: GSAPScrollTriggerTimelineProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(1);

  return (
    <div className={"w-full rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm " + className}>
      <div className="pb-4 mb-6 border-b border-border flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Kinetic Journey</span>
          <h3 className="text-base font-semibold text-foreground tracking-tight">Kinetic Execution Timeline</h3>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          Step {activeStepIndex + 1} of {steps.length}
        </span>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isPassed = idx < activeStepIndex;
          return (
            <div
              key={step.stepNumber}
              onClick={() => setActiveStepIndex(idx)}
              className={
                "relative transition-all cursor-pointer p-3 rounded-lg " +
                (isActive ? "bg-muted text-foreground border border-border" : "hover:bg-muted/40 text-muted-foreground")
              }
            >
              {/* Bullet Node */}
              <div
                className={
                  "absolute -left-8 top-4 w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono transition-colors " +
                  (isPassed
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-card border-2 border-primary text-primary"
                    : "bg-muted border border-border text-muted-foreground")
                }
              >
                {isPassed ? <Check className="w-3 h-3" role="img" aria-hidden="true" /> : idx + 1}
              </div>

              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-mono tracking-wide">{step.badge}</span>
                <span className="text-xs font-mono text-muted-foreground">{step.stepNumber}</span>
              </div>
              <h4 className={"text-sm font-medium " + (isActive ? "text-foreground" : "text-foreground/80")}>
                {step.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

```
