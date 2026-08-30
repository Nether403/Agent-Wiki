---
id: "keyboard-shortcut"
name: "Keyboard Shortcut"
category: "ui:utility"
library_origin: "https://design-wiki.dev"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "utility"
  - "kbd"
  - "shortcut"
  - "keyboard"
  - "accessibility"
dials:
  design_variance: 2      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 1     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 8       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Keyboard Shortcut (`keyboard-shortcut`)
> Accessible platform-adaptive keyboard key combo pill with monospace token styling.

- **Taxonomy Category**: `ui:utility`
- **Structural Complexity**: `LOW`
- **Technical Tags**: tailwind-v4, wai-aria-compliant, utility, kbd, shortcut, keyboard, accessibility
- **Design Dials**: Variance 2/10 · Motion 1/10 · Density 8/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add keyboard-shortcut

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/keyboard-shortcut.json
```

## Peer Dependencies
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Design Wiki Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface KeyboardShortcutProps extends React.HTMLAttributes<HTMLElement> {
  keys: string[];
  size?: "sm" | "md" | "lg";
}

export function KeyboardShortcut({
  keys,
  size = "md",
  className,
  ...props
}: KeyboardShortcutProps) {
  const sizeMap = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-1 text-xs",
    lg: "px-2.5 py-1.5 text-sm",
  };

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      {keys.map((k, idx) => (
        <kbd
          key={idx}
          className={cn(
            "inline-flex items-center justify-center font-mono font-medium rounded-lg border border-border bg-muted/80 text-muted-foreground shadow-xs select-none",
            sizeMap[size]
          )}
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}

```
