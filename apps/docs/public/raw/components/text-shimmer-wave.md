---
id: "text-shimmer-wave"
name: "Text Shimmer Wave"
category: "ui:utility"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "motion"
tags:
  - "wai-aria-compliant"
  - "utility"
dials:
  design_variance: 2      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Text Shimmer Wave (`text-shimmer-wave`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:utility`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant, utility
- **Design Dials**: Variance 2/10 · Motion 4/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add text-shimmer-wave

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/text-shimmer-wave.json
```

## Peer Dependencies
- `motion`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin ibelick / motion-primitives (https://motion-primitives.com)
 * @author ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface TextShimmerWaveProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
  duration?: number;
  spread?: number;
}

export function TextShimmerWave({
  children,
  duration = 2.5,
  spread = 2,
  className,
  ...props
}: TextShimmerWaveProps) {
  return (
    <span
      style={
        {
          "--duration": `${duration}s`,
          "--spread": `${spread}`,
          backgroundImage:
            "linear-gradient(90deg, currentColor 0%, hsl(var(--primary)) 50%, currentColor 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `text-shimmer ${duration}s ease-in-out infinite`,
        } as React.CSSProperties
      }
      className={cn("inline-block font-medium tracking-tight", className)}
      {...props}
    >
      {children}
    </span>
  );
}

```
