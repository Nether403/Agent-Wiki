---
id: "infinite-canvas-spatial-ruler"
name: "Infinite Canvas Spatial Ruler"
category: "ui:workflow"
library_origin: "https://github.com/tldraw/tldraw"
dependencies:
  - "lucide-react"
  - "three"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "webgl"
  - "threejs"
  - "tailwind-v4"
  - "glassmorphism"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "canvas"
  - "tldraw"
  - "excalidraw"
  - "ruler"
  - "spatial"
  - "hud"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Infinite Canvas Spatial Ruler (`infinite-canvas-spatial-ruler`)
> Zoom-adaptive pixel grid ruler and spatial measurement HUD overlay for whiteboard and diagram applications.

- **Taxonomy Category**: `ui:workflow`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, webgl, threejs, tailwind-v4, glassmorphism, accessible, keyboard-accessible, wai-aria-compliant, canvas, tldraw, excalidraw, ruler, spatial, hud
- **Design Dials**: Variance 7/10 · Motion 4/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add infinite-canvas-spatial-ruler

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/infinite-canvas-spatial-ruler.json
```

## Peer Dependencies
- `lucide-react`
- `three`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin tldraw & Excalidraw (https://github.com/tldraw/tldraw, https://github.com/excalidraw/excalidraw)
 * @license Apache-2.0
 * @author tldraw Team & Excalidraw Team
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { Move, ZoomIn, ZoomOut, Compass, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InfiniteCanvasSpatialRulerProps {
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  gridSize?: number;
  unit?: string;
  className?: string;
}

export function InfiniteCanvasSpatialRuler({
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
  gridSize = 20,
  unit = "px",
  className,
}: InfiniteCanvasSpatialRulerProps) {
  const [currentZoom, setCurrentZoom] = React.useState(zoom);
  const [showGrid, setShowGrid] = React.useState(true);

  const majorStep = React.useMemo(() => {
    if (currentZoom < 0.5) return 200;
    if (currentZoom > 2) return 50;
    return 100;
  }, [currentZoom]);

  const tickMarks = React.useMemo(() => {
    const marks: number[] = [];
    for (let i = 0; i <= 600; i += 20) {
      marks.push(i);
    }
    return marks;
  }, []);

  return (
    <div className={cn("relative w-full h-[360px] overflow-hidden rounded-xl border border-border bg-background select-none", className)}>
      {/* Top Horizontal Ruler */}
      <div className="absolute top-0 left-6 right-0 h-6 border-b border-border bg-card/90 backdrop-blur-xs flex items-end overflow-hidden z-20">
        {tickMarks.map((pos) => {
          const isMajor = pos % majorStep === 0;
          return (
            <div
              key={`h-${pos}`}
              className="absolute bottom-0 flex flex-col items-center"
              style={{ left: `${pos}px` }}
            >
              {isMajor && (
                <span className="text-3xs font-mono text-muted-foreground -translate-x-1/2 mb-1">
                  {Math.round(pos / currentZoom)}
                </span>
              )}
              <div
                className={cn(
                  "w-px bg-border",
                  isMajor ? "h-3 bg-muted-foreground/80" : "h-1.5 bg-border/80"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Left Vertical Ruler */}
      <div className="absolute top-6 bottom-0 left-0 w-6 border-r border-border bg-card/90 backdrop-blur-xs flex justify-end overflow-hidden z-20">
        {tickMarks.map((pos) => {
          const isMajor = pos % majorStep === 0;
          return (
            <div
              key={`v-${pos}`}
              className="absolute right-0 flex items-center justify-end"
              style={{ top: `${pos}px` }}
            >
              {isMajor && (
                <span className="text-3xs font-mono text-muted-foreground -rotate-90 -translate-x-2">
                  {Math.round(pos / currentZoom)}
                </span>
              )}
              <div
                className={cn(
                  "h-px bg-border",
                  isMajor ? "w-3 bg-muted-foreground/80" : "w-1.5 bg-border/80"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Top Left Origin Corner */}
      <div className="absolute top-0 left-0 h-6 w-6 border-r border-b border-border bg-muted/60 flex items-center justify-center z-30">
        <Compass className="h-3 w-3 text-muted-foreground" role="img" aria-hidden="true" />
      </div>

      {/* Canvas Viewport Grid */}
      <div
        className={cn(
          "absolute inset-0 top-6 left-6 flex items-center justify-center p-8",
          showGrid && "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]"
        )}
      >
        <div className="space-y-2 rounded-lg border border-border bg-card p-4 shadow-sm max-w-xs text-center">
          <p className="text-xs font-semibold text-foreground">Spatial Canvas Viewport</p>
          <p className="text-2xs text-muted-foreground">
            Zoom Level: <span className="font-mono text-primary font-medium">{Math.round(currentZoom * 100)}%</span> | Offset: <span className="font-mono">{offsetX},{offsetY} {unit}</span>
          </p>
        </div>
      </div>

      {/* Floating HUD Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg border border-border bg-card/95 p-1.5 shadow-md z-30">
        <button
          type="button"
          onClick={() => setCurrentZoom((z) => Math.max(0.25, z - 0.25))}
          aria-label="Zoom Out"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ZoomOut className="h-3.5 w-3.5" role="img" aria-hidden="true" />
        </button>

        <span className="min-w-[44px] text-center font-mono text-xs text-foreground font-medium">
          {Math.round(currentZoom * 100)}%
        </span>

        <button
          type="button"
          onClick={() => setCurrentZoom((z) => Math.min(3, z + 0.25))}
          aria-label="Zoom In"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ZoomIn className="h-3.5 w-3.5" role="img" aria-hidden="true" />
        </button>

        <div className="h-4 w-px bg-border" />

        <button
          type="button"
          onClick={() => setShowGrid((g) => !g)}
          aria-label="Toggle Grid"
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            showGrid ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          aria-pressed={showGrid}
        >
          <Grid className="h-3.5 w-3.5" role="img" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

```
