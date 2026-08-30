---
id: "separator"
name: "Separator"
category: "ui:primitive"
library_origin: "https://radix-ui.com"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "wai-aria-compliant"
  - "utility"
  - "radix-primitives"
  - "separator"
  - "divider"
  - "layout"
dials:
  design_variance: 1      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 1     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Separator (`separator`)
> Semantic horizontal or vertical divider with decorative and accessible separator roles.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant, utility, radix-primitives, separator, divider, layout
- **Design Dials**: Variance 1/10 · Motion 1/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add separator

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/separator.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Radix UI / Shadcn (https://radix-ui.com)
 * @author Radix UI & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

```
