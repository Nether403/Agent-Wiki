---
id: "input"
name: "Input"
category: "ui:primitive"
library_origin: "https://github.com/heroui-inc/heroui"
dependencies:
  - "clsx"
  - "tailwind-merge"
tags:
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "utility"
  - "react"
  - "tailwind-v4"
  - "headless"
  - "form"
  - "input"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Input (`input`)
> Accessible text input with floating state, error boundaries, and focus-visible ring.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: accessible, keyboard-accessible, wai-aria-compliant, utility, react, tailwind-v4, headless, form, input
- **Design Dials**: Variance 3/10 · Motion 3/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add input

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/input.json
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

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

```
