---
id: "tree-hierarchy-map"
name: "Tree Hierarchy Map"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
tags:
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

# Tree Hierarchy Map (`tree-hierarchy-map`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add tree-hierarchy-map

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/tree-hierarchy-map.json
```

## Peer Dependencies
- `motion`

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

export interface TreeHierarchyMapProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function TreeHierarchyMap({
  title = "Taxonomy Taxonomy Tree Graph",
  className,
  ...props
}: TreeHierarchyMapProps) {
  return (
    <figure
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card p-6 shadow-xs text-card-foreground",
        className
      )}
      role="region"
      aria-label={`Tree Hierarchy: ${title}`}
      {...props}
    >
      <header className="border-b border-border pb-3 mb-6">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Radial hierarchical tree map expressing component lineage from root catalog to leaf primitives.
        </p>
      </header>

      <div className="relative w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 680 180"
          className="w-full min-w-[620px] h-auto overflow-visible"
          role="img"
          aria-label="Tree hierarchy diagram"
        >
          {/* Trunk Lines */}
          <path d="M 120 90 C 180 90, 180 40, 240 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />
          <path d="M 120 90 L 240 90" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />
          <path d="M 120 90 C 180 90, 180 140, 240 140" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />

          {/* Root */}
          <g transform="translate(10, 65)">
            <rect width="110" height="50" rx="8" fill="currentColor" className="text-primary/10 stroke-primary/50 stroke-1" />
            <text x="55" y="30" textAnchor="middle" className="fill-primary text-[11px] font-black">Agent Wiki</text>
          </g>

          {/* Child 1: Primitives */}
          <g transform="translate(240, 20)">
            <rect width="120" height="40" rx="6" fill="currentColor" className="text-muted/30 stroke-border stroke-1" />
            <text x="60" y="24" textAnchor="middle" className="fill-foreground text-[10px] font-bold">ui:primitive (14)</text>
          </g>

          {/* Child 2: Motion */}
          <g transform="translate(240, 70)">
            <rect width="120" height="40" rx="6" fill="currentColor" className="text-muted/30 stroke-border stroke-1" />
            <text x="60" y="24" textAnchor="middle" className="fill-foreground text-[10px] font-bold">ui:motion (15)</text>
          </g>

          {/* Child 3: Creative 3D */}
          <g transform="translate(240, 120)">
            <rect width="120" height="40" rx="6" fill="currentColor" className="text-muted/30 stroke-border stroke-1" />
            <text x="60" y="24" textAnchor="middle" className="fill-foreground text-[10px] font-bold">ui:creative (12)</text>
          </g>

          {/* Sub-branches */}
          <path d="M 360 40 L 440 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />
          <path d="M 360 90 L 440 90" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />
          <path d="M 360 140 L 440 140" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />

          <g transform="translate(440, 20)">
            <rect width="140" height="40" rx="6" fill="currentColor" className="text-muted/10 stroke-border stroke-1" />
            <text x="70" y="24" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">Buttons, Inputs, Modals</text>
          </g>

          <g transform="translate(440, 70)">
            <rect width="140" height="40" rx="6" fill="currentColor" className="text-muted/10 stroke-border stroke-1" />
            <text x="70" y="24" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">Docks, Tabs, Springs</text>
          </g>

          <g transform="translate(440, 120)">
            <rect width="140" height="40" rx="6" fill="currentColor" className="text-muted/10 stroke-border stroke-1" />
            <text x="70" y="24" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">R3F Viewports, HUDs</text>
          </g>
        </svg>
      </div>
    </figure>
  );
}

```
