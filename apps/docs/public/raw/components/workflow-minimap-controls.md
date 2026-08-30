---
id: "workflow-minimap-controls"
name: "Workflow Minimap Controls"
category: "ui:workflow"
library_origin: "https://github.com/xyflow/xyflow"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "glassmorphism"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "workflow"
  - "node-graph"
  - "minimap"
  - "zoom"
  - "canvas"
  - "xyflow"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 3     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "medium"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Workflow Minimap Controls (`workflow-minimap-controls`)
> Floating viewport toolbar with zoom in/out, fit-view, and canvas reset controls.

- **Taxonomy Category**: `ui:workflow`
- **Structural Complexity**: `MEDIUM`
- **Technical Tags**: lucide-react, tailwind-v4, glassmorphism, accessible, keyboard-accessible, wai-aria-compliant, workflow, node-graph, minimap, zoom, canvas, xyflow
- **Design Dials**: Variance 5/10 · Motion 3/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add workflow-minimap-controls

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/workflow-minimap-controls.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin XY Flow (https://github.com/xyflow/xyflow)
 * @license MIT
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import { cn } from "../lib/utils";

export interface WorkflowMinimapControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onReset?: () => void;
}

export function WorkflowMinimapControls({
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onFitView,
  onReset,
  className,
  ...props
}: WorkflowMinimapControlsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-xl border border-border bg-card/90 p-1.5 shadow-md backdrop-blur-sm",
        className
      )}
      role="toolbar"
      aria-label="Workflow Canvas Controls"
      {...props}
    >
      <button
        type="button"
        onClick={onZoomIn}
        aria-label="Zoom In"
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ZoomIn className="h-4 w-4" aria-hidden="true" />
      </button>

      <span className="px-2 font-mono text-xs text-muted-foreground font-semibold tabular-nums">
        {Math.round(zoom * 100)}%
      </span>

      <button
        type="button"
        onClick={onZoomOut}
        aria-label="Zoom Out"
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ZoomOut className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="h-4 w-px bg-border my-auto mx-1" aria-hidden="true" />

      <button
        type="button"
        onClick={onFitView}
        aria-label="Fit View to Screen"
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Maximize2 className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onReset}
        aria-label="Reset Canvas View"
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

```
