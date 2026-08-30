---
id: "animated-beam-pipeline"
name: "Animated Beam Decision Pipeline"
category: "ui:motion"
library_origin: "https://magicui.design"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "workflow"
  - "node-graph"
  - "motion"
  - "animated-beam"
  - "pipeline"
  - "laser"
  - "magic-ui"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 7     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Animated Beam Decision Pipeline (`animated-beam-pipeline`)
> SVG curved beam animation connecting distinct nodes with glowing laser pulses indicating data flow.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, wai-aria-compliant, workflow, node-graph, motion, animated-beam, pipeline, laser, magic-ui
- **Design Dials**: Variance 7/10 · Motion 7/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add animated-beam-pipeline

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/animated-beam-pipeline.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Magic UI (https://magicui.design)
 * @author Magic UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { User, Cpu, Database, Sparkles, CheckCircle2 } from "lucide-react";

export interface AnimatedBeamPipelineProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function AnimatedBeamPipeline({
  title = "Multi-Agent Decision Pipeline",
  className,
  ...props
}: AnimatedBeamPipelineProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full p-8 rounded-2xl border border-border bg-card text-card-foreground shadow-sm space-y-8 select-none",
        className
      )}
      role="region"
      aria-label={`Animated Pipeline: ${title}`}
      {...props}
    >
      <div className="text-center">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time deterministic data streams
        </p>
      </div>

      {/* Nodes and SVG Laser Beam Connections */}
      <div className="relative flex items-center justify-between w-full max-w-xl px-4 py-6">
        {/* SVG Connecting Curved Beams */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none overflow-visible"
          viewBox="0 0 500 100"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Background rail lines */}
          <path d="M 50 50 C 150 10, 200 10, 250 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
          <path d="M 250 50 C 300 90, 350 90, 450 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />

          {/* Animated beam paths */}
          <path
            d="M 50 50 C 150 10, 200 10, 250 50"
            fill="none"
            stroke="url(#beamGradient)"
            strokeWidth="2.5"
            strokeDasharray="20 180"
            strokeLinecap="round"
            className="animate-pulse"
          />
          <path
            d="M 250 50 C 300 90, 350 90, 450 50"
            fill="none"
            stroke="url(#beamGradient)"
            strokeWidth="2.5"
            strokeDasharray="20 180"
            strokeLinecap="round"
            className="animate-pulse"
          />
        </svg>

        {/* Node 1: Input */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-card border border-border shadow-md text-foreground">
            <User className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-foreground">User Intent</span>
        </div>

        {/* Node 2: Core LLM Engine */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-xl border border-primary/40">
            <Cpu className="h-6 w-6" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-foreground">Agent Core</span>
        </div>

        {/* Node 3: Database / Output */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-card border border-border shadow-md text-foreground">
            <Database className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-foreground">Output Synced</span>
        </div>
      </div>
    </div>
  );
}

```
