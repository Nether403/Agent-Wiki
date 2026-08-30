---
id: "digital-ticker"
name: "Digital Ticker"
category: "ui:primitive"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  # No external runtime dependencies
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Digital Ticker (`digital-ticker`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add digital-ticker

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/digital-ticker.json
```

## Peer Dependencies
- None

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DigitalTickerProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: string[];
  speedSeconds?: number;
}

const DEFAULT_ITEMS = [
  "SYSTEM_HEALTH: 100/100",
  "WCAG_AA: PASS",
  "SLOP_CHECKS: 30/30 ACTIVE",
  "CATALOG_SIZE: 110+ COMPONENTS",
  "TRIPWIRE_SECURITY: ARMED",
];

export function DigitalTicker({
  items = DEFAULT_ITEMS,
  speedSeconds = 25,
  className,
  ...props
}: DigitalTickerProps) {
  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden border-y border-border bg-muted/40 py-2.5 select-none",
        className
      )}
      role="marquee"
      aria-label="Digital Ticker Stream"
      {...props}
    >
      <div
        style={{ animationDuration: `${speedSeconds}s` }}
        className="flex whitespace-nowrap gap-8 animate-marquee font-mono text-xs font-bold text-foreground"
      >
        {items.concat(items).map((item, idx) => (
          <span key={idx} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

```
