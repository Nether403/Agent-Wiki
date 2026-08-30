---
id: "reui-animated-icons-pack"
name: "Reui Animated Icons Pack"
category: "ui:utility"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "lucide-react"
tags:
  - "lucide-react"
  - "bento-grid"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "utility"
dials:
  design_variance: 2      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 9       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Reui Animated Icons Pack (`reui-animated-icons-pack`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:utility`
- **Structural Complexity**: `LOW`
- **Technical Tags**: lucide-react, bento-grid, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, utility
- **Design Dials**: Variance 2/10 · Motion 4/10 · Density 9/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add reui-animated-icons-pack

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/reui-animated-icons-pack.json
```

## Peer Dependencies
- `lucide-react`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin ReUI / Keenthemes (https://reui.io)
 * @author Keenthemes & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Sparkles, Shield, Cpu, Zap, Globe, Lock, Terminal, Database, Server, Compass } from "lucide-react";

export interface ReuiAnimatedIconsPackProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const ICONS = [
  { name: "Sparkles", component: Sparkles },
  { name: "Security", component: Shield },
  { name: "Processor", component: Cpu },
  { name: "Lightning", component: Zap },
  { name: "Network", component: Globe },
  { name: "Cryptographic Lock", component: Lock },
  { name: "CLI Terminal", component: Terminal },
  { name: "Vector Database", component: Database },
  { name: "Compute Server", component: Server },
  { name: "Explorer Compass", component: Compass },
];

export function ReuiAnimatedIconsPack({
  size = 20,
  className,
  ...props
}: ReuiAnimatedIconsPackProps) {
  return (
    <div
      className={cn("grid grid-cols-5 gap-3 p-4 rounded-xl border border-border bg-card", className)}
      role="region"
      aria-label="ReUI Animated Icons Collection"
      {...props}
    >
      {ICONS.map(({ name, component: Icon }) => (
        <button
          key={name}
          type="button"
          className="group flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={name}
        >
          <Icon
            className="text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-transform duration-200"
            style={{ width: `${size}px`, height: `${size}px` }}
            aria-hidden="true"
          />
          <span className="text-[9px] text-muted-foreground group-hover:text-foreground mt-1.5 truncate max-w-full font-mono">
            {name}
          </span>
        </button>
      ))}
    </div>
  );
}

```
