---
id: "fishbone-root-cause-diagram"
name: "Fishbone Root Cause Diagram"
category: "ui:editorial"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
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

# Fishbone Root Cause Diagram (`fishbone-root-cause-diagram`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:editorial`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, editorial
- **Design Dials**: Variance 5/10 · Motion 1/10 · Density 10/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add fishbone-root-cause-diagram

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/fishbone-root-cause-diagram.json
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

export interface FishboneRootCauseDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  problemStatement?: string;
}

export function FishboneRootCauseDiagram({
  title = "AI Slop Root Cause (Ishikawa / Fishbone) Analysis",
  problemStatement = "AI Slop in UI Codebases",
  className,
  ...props
}: FishboneRootCauseDiagramProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Ishikawa Fishbone Diagram: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Structured cause-and-effect fishbone diagram decomposing systemic drivers of generic AI UI output.
        </p>
      </header>

      <div className="relative w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 720 280"
          className="w-full sm:min-w-[660px] min-w-full h-auto overflow-visible"
          role="img"
          aria-label="Fishbone cause-and-effect diagram"
        >
          {/* Main Spine */}
          <line
            x1="50"
            y1="140"
            x2="560"
            y2="140"
            stroke="currentColor"
            strokeWidth="3"
            className="text-foreground"
          />

          {/* Problem Box (Head) */}
          <g transform="translate(560, 105)">
            <rect
              width="140"
              height="70"
              rx="8"
              fill="currentColor"
              className="text-destructive/10 stroke-destructive stroke-1"
            />
            <text x="70" y="32" textAnchor="middle" className="fill-destructive text-[11px] font-bold">
              {problemStatement}
            </text>
            <text x="70" y="50" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              Effect / Result
            </text>
          </g>

          {/* Rib 1: Prompts (Top Left) */}
          <line x1="160" y1="140" x2="220" y2="40" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60" />
          <text x="220" y="30" textAnchor="middle" className="fill-primary text-[10px] font-bold">
            Vague Prompts
          </text>
          <text x="160" y="70" textAnchor="end" className="fill-muted-foreground text-[9px]">• No Token Dials</text>
          <text x="175" y="100" textAnchor="end" className="fill-muted-foreground text-[9px]">• Unanchored Spec</text>

          {/* Rib 2: Styling (Top Right) */}
          <line x1="380" y1="140" x2="440" y2="40" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60" />
          <text x="440" y="30" textAnchor="middle" className="fill-primary text-xs font-bold">
            Styling Escapes
          </text>
          <text x="380" y="70" textAnchor="end" className="fill-muted-foreground text-xs">• Indigo Defaults</text>
          <text x="395" y="100" textAnchor="end" className="fill-muted-foreground text-xs">• Non-Token Pixel Escapes</text>

          {/* Rib 3: Architecture (Bottom Left) */}
          <line x1="160" y1="140" x2="220" y2="240" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60" />
          <text x="220" y="255" textAnchor="middle" className="fill-primary text-xs font-bold">
            Architecture
          </text>
          <text x="160" y="180" textAnchor="end" className="fill-muted-foreground text-xs">• No A11y AA</text>
          <text x="175" y="210" textAnchor="end" className="fill-muted-foreground text-xs">• Timer Leaks</text>

          {/* Rib 4: Verification (Bottom Right) */}
          <line x1="380" y1="140" x2="440" y2="240" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60" />
          <text x="440" y="255" textAnchor="middle" className="fill-primary text-xs font-bold">
            Missing Quality Gates
          </text>
          <text x="380" y="180" textAnchor="end" className="fill-muted-foreground text-xs">• No AST Linter</text>
          <text x="395" y="210" textAnchor="end" className="fill-muted-foreground text-xs">• No Tripwire Sandbox</text>
        </svg>
      </div>
    </figure>
  );
}

```
