---
id: "cyber-hud-frame"
name: "Cyber Hud Frame"
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

# Cyber Hud Frame (`cyber-hud-frame`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 3/10 · Motion 2/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add cyber-hud-frame

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/cyber-hud-frame.json
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

export interface CyberHudFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  systemCode?: string;
}

export function CyberHudFrame({
  title = "TELEMETRY OVERLAY",
  systemCode = "SYS.CORE-01",
  children,
  className,
  ...props
}: CyberHudFrameProps) {
  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border border-primary/40 bg-card/90 text-card-foreground shadow-lg overflow-hidden",
        className
      )}
      role="region"
      aria-label={`HUD Frame: ${title}`}
      {...props}
    >
      {/* Corner Bracket Accents */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" aria-hidden="true" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" aria-hidden="true" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" aria-hidden="true" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" aria-hidden="true" />

      {/* Header bar */}
      <header className="flex items-center justify-between pb-3 mb-4 border-b border-primary/20 text-[10px] font-mono text-primary font-bold tracking-widest uppercase">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          {title}
        </span>
        <span className="opacity-80">{systemCode}</span>
      </header>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

```
