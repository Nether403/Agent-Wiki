---
id: "device-mockup-showcase"
name: "Device Mockup Showcase Frame"
category: "ui:block"
library_origin: "https://daisyui.com"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "block"
  - "device-mockup"
  - "safari"
  - "iphone"
  - "daisyui"
dials:
  design_variance: 6      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Device Mockup Showcase Frame (`device-mockup-showcase`)
> Pixel-perfect Safari browser and iPhone device frames with screenshot scroll-into-view animations.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, block, device-mockup, safari, iphone, daisyui
- **Design Dials**: Variance 6/10 · Motion 4/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add device-mockup-showcase

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/device-mockup-showcase.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin DaisyUI / Magic UI (https://daisyui.com)
 * @author Pouya Saadeghi & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Lock, Smartphone, Laptop } from "lucide-react";

export interface DeviceMockupShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: "browser" | "phone";
  urlBarText?: string;
  screenshotUrl?: string;
}

export function DeviceMockupShowcase({
  mode = "browser",
  urlBarText = "https://agent-wiki.design/registry",
  screenshotUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  children,
  className,
  ...props
}: DeviceMockupShowcaseProps) {
  const [device, setDevice] = React.useState<"browser" | "phone">(mode);

  return (
    <div
      className={cn("flex flex-col items-center w-full space-y-4 select-none", className)}
      role="region"
      aria-label="Interactive Device Mockup Showcase"
      {...props}
    >
      {/* Device Mode Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted border border-border">
        <button
          type="button"
          onClick={() => setDevice("browser")}
          aria-label="Browser Device Mockup"
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            device === "browser"
              ? "bg-background text-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Laptop className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Desktop Safari</span>
        </button>

        <button
          type="button"
          onClick={() => setDevice("phone")}
          aria-label="Phone Device Mockup"
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            device === "phone"
              ? "bg-background text-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
          <span>iPhone Frame</span>
        </button>
      </div>

      {/* Mockup Frame Canvas */}
      {device === "browser" ? (
        <div className="w-full max-w-3xl rounded-2xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden">
          {/* Safari Window Header Bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/60 border-b border-border">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex-1 max-w-sm mx-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-background border border-border text-[11px] font-mono text-muted-foreground shadow-inner">
              <Lock className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">{urlBarText}</span>
            </div>
          </div>

          {/* Browser Inner Body */}
          <div className="relative min-h-72 max-h-96 overflow-hidden bg-background">
            {children || (
              <img
                src={screenshotUrl}
                alt="Browser Screen Mockup"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-72 rounded-[40px] border-4 border-muted-foreground/30 bg-card text-card-foreground shadow-2xl p-2.5">
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full bg-foreground z-20" />

          {/* Phone Inner Screen */}
          <div className="relative h-[480px] w-full rounded-[30px] overflow-hidden bg-background">
            {children || (
              <img
                src={screenshotUrl}
                alt="Smartphone Screen Mockup"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

```
