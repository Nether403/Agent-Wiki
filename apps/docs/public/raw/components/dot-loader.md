---
id: "dot-loader"
name: "Dot Loader"
category: "ui:utility"
library_origin: "https://icons0.dev"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "wai-aria-compliant"
  - "utility"
  - "loader"
  - "spinner"
  - "minimalist"
dials:
  design_variance: 2      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Dot Loader (`dot-loader`)
> Minimalist dot pulsation loader for button states or inline progress indicators.

- **Taxonomy Category**: `ui:utility`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant, utility, loader, spinner, minimalist
- **Design Dials**: Variance 2/10 · Motion 4/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add dot-loader

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/dot-loader.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin icons0 / Dot Matrix (https://icons0.dev)
 * @author icons0 Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DotLoaderProps {
  size?: "sm" | "default" | "lg";
  className?: string;
  label?: string;
}

export function DotLoader({
  size = "default",
  className,
  label = "Loading...",
}: DotLoaderProps) {
  const sizeClasses = {
    sm: "h-1.5 w-1.5",
    default: "h-2 w-2",
    lg: "h-3 w-3",
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <span
        className={cn(
          "rounded-full bg-current animate-bounce [animation-delay:-0.3s]",
          sizeClasses[size]
        )}
      />
      <span
        className={cn(
          "rounded-full bg-current animate-bounce [animation-delay:-0.15s]",
          sizeClasses[size]
        )}
      />
      <span
        className={cn("rounded-full bg-current animate-bounce", sizeClasses[size])}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

```
