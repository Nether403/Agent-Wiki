---
id: "border-trail"
name: "Border Trail"
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
  visual_density: 9       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Border Trail (`border-trail`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:utility`
- **Structural Complexity**: `LOW`
- **Technical Tags**: wai-aria-compliant, utility
- **Design Dials**: Variance 2/10 · Motion 4/10 · Density 9/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add border-trail

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/border-trail.json
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

export interface BorderTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  color?: string;
}

export function BorderTrail({
  size = 60,
  duration = 6,
  color = "hsl(var(--primary))",
  className,
  ...props
}: BorderTrailProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animation: `border-trail-orbit ${duration}s linear infinite`,
          offsetPath: "rect(0% auto 100% 0% round 12px)",
        }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

```
