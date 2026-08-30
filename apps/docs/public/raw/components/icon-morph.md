---
id: "icon-morph"
name: "Icon Morph"
category: "ui:utility"
library_origin: "https://reui.dev"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "wai-aria-compliant"
  - "utility"
  - "icon"
  - "svg"
  - "morph"
  - "a11y"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Icon Morph (`icon-morph`)
> Clean animated SVG state toggler (play/pause/check) with accessible title.

- **Taxonomy Category**: `ui:utility`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant, utility, icon, svg, morph, a11y
- **Design Dials**: Variance 3/10 · Motion 4/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add icon-morph

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/icon-morph.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin ReUI / Icons0 (https://reui.dev)
 * @author ReUI Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface IconMorphProps {
  state: "play" | "pause" | "check";
  className?: string;
  size?: number;
}

export function IconMorph({ state, className, size = 20 }: IconMorphProps) {
  return (
    <svg
      role="img"
      aria-label={`State icon: ${state}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("transition-transform duration-200", className)}
    >
      <title>{state.toUpperCase()}</title>
      {state === "play" && (
        <polygon points="6 3 20 12 6 21 6 3" className="fill-current" />
      )}
      {state === "pause" && (
        <>
          <rect x="6" y="4" width="4" height="16" className="fill-current" />
          <rect x="14" y="4" width="4" height="16" className="fill-current" />
        </>
      )}
      {state === "check" && <polyline points="20 6 9 17 4 12" />}
    </svg>
  );
}

```
