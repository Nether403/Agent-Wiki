---
id: "safari-browser-mockup"
name: "Safari Browser Mockup"
category: "ui:block"
library_origin: "https://launch-ui.com"
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
  - "mockup"
  - "browser"
  - "safari"
  - "window"
  - "launch-ui"
  - "magic-ui"
  - "showcase"
dials:
  design_variance: 4      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 6       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Safari Browser Mockup (`safari-browser-mockup`)
> Responsive macOS Safari browser window wrapper with dark/light chrome, search URL omnibox, and viewport slot.

- **Taxonomy Category**: `ui:block`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, mockup, browser, safari, window, launch-ui, magic-ui, showcase
- **Design Dials**: Variance 4/10 · Motion 2/10 · Density 6/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add safari-browser-mockup

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/safari-browser-mockup.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Launch UI / Magic UI (https://launch-ui.com)
 * @author Launch UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { ArrowLeft, ArrowRight, RotateCw, Lock, Plus, Share2 } from "lucide-react";

export interface SafariBrowserMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  url?: string;
  title?: string;
  showControls?: boolean;
  children?: React.ReactNode;
}

export function SafariBrowserMockup({
  url = "https://agent-wiki.dev/r/floating-dock",
  title = "Design Agent Wiki",
  showControls = true,
  children,
  className,
  ...props
}: SafariBrowserMockupProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border bg-card shadow-2xl overflow-hidden text-card-foreground flex flex-col",
        className
      )}
      {...props}
    >
      {/* Safari Window Header Bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-muted/50 border-b border-border select-none">
        {/* Window Controls (Traffic Lights) */}
        <div className="flex items-center gap-1.5 min-w-[54px]" role="presentation">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-xs" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-xs" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-xs" aria-hidden="true" />
        </div>

        {/* Navigation & URL Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-xl mx-auto">
          {showControls && (
            <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
              <button
                type="button"
                aria-label="Back"
                className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Forward"
                className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Reload page"
                className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Omnibox / Search & Address Input */}
          <div className="flex items-center justify-center gap-2 flex-1 h-7 px-3 rounded-md bg-background border border-border text-xs text-muted-foreground font-mono transition-all">
            <Lock className="h-3 w-3 text-emerald-500 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[280px] sm:max-w-md text-foreground font-medium select-all">
              {url}
            </span>
          </div>
        </div>

        {/* Right Utility Icons */}
        <div className="hidden sm:flex items-center gap-1 text-muted-foreground min-w-[54px] justify-end">
          <button
            type="button"
            aria-label="Share URL"
            className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="New tab"
            className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Browser Viewport Canvas Body */}
      <div className="relative flex-1 min-h-[300px] bg-background">
        {children ? (
          children
        ) : (
          <div className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-lg shadow-xs">
              DW
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                Clean safari frame wrapper for rendering responsive UI components and landing prototypes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

```
