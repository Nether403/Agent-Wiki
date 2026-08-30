---
id: "switch"
name: "Switch"
category: "ui:primitive"
library_origin: "https://radix-ui.com"
dependencies:
  - "@radix-ui/react-switch"
  - "clsx"
  - "tailwind-merge"
tags:
  - "radix-primitives"
  - "headless"
  - "brutalist"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "utility"
  - "toggle"
  - "form"
dials:
  design_variance: 2      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "low"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Switch (`switch`)
> Accessible toggle switch with smooth spring thumb and keyboard space/enter toggling.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `LOW`
- **Technical Tags**: radix-primitives, headless, brutalist, accessible, keyboard-accessible, wai-aria-compliant, utility, toggle, form
- **Design Dials**: Variance 2/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add switch

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/switch.json
```

## Peer Dependencies
- `@radix-ui/react-switch`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Radix UI / Shadcn UI (https://radix-ui.com)
 * @author Radix & Shadcn
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../lib/utils";

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

```
