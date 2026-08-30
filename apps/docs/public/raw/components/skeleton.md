---
id: "skeleton"
name: "Skeleton"
category: "ui:primitive"
library_origin: "https://ui.shadcn.com"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "wai-aria-compliant"
  - "utility"
  - "skeleton"
  - "placeholder"
  - "loading"
  - "tailwind-v4"
dials:
  design_variance: 1      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Skeleton (`skeleton`)
> Subtle pulse skeleton loader with zero cumulative layout shift and reduced motion support.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant, utility, skeleton, placeholder, loading, tailwind-v4
- **Design Dials**: Variance 1/10 · Motion 2/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add skeleton

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/skeleton.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Shadcn UI (https://ui.shadcn.com)
 * @author Shadcn & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-xl bg-muted/60",
        shimmer && "animate-pulse",
        className
      )}
      {...props}
    />
  );
}

```
