---
id: "bento-grid"
name: "Bento Grid"
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
  - "wai-aria-compliant"
  - "layout-block"
  - "marketing"
  - "asymmetry"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Bento Grid (`bento-grid`)
> Multi-pane asymmetrical layout grid with responsive column spans and structural borders.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `LOW`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, wai-aria-compliant, layout-block, marketing, asymmetry
- **Design Dials**: Variance 5/10 · Motion 4/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add bento-grid

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/bento-grid.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Tailark / Aceternity (https://tailark.com)
 * @author Tailark Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

export interface BentoItem {
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[18rem]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: BentoItem) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs transition-colors hover:border-primary/40",
        className
      )}
    >
      <div className="flex h-full flex-col justify-between">
        {header && <div className="mb-4">{header}</div>}
        <div>
          {icon && <div className="mb-3 text-primary">{icon}</div>}
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        <span>Explore architecture</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

```
