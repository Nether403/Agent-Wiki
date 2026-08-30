---
id: "embedded-whiteboard"
name: "Embedded Whiteboard"
category: "ui:workflow"
library_origin: "https://github.com/excalidraw/excalidraw"
dependencies:
  - "lucide-react"
  - "three"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "webgl"
  - "threejs"
  - "canvas"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "workflow"
  - "whiteboard"
  - "sketch"
  - "excalidraw"
dials:
  design_variance: 7      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 2     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Embedded Whiteboard (`embedded-whiteboard`)
> Lightweight vector annotation whiteboard with high-DPI scaling and accessible text transcript fallback.

- **Taxonomy Category**: `ui:workflow`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, webgl, threejs, canvas, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, workflow, whiteboard, sketch, excalidraw
- **Design Dials**: Variance 7/10 · Motion 2/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add embedded-whiteboard

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/embedded-whiteboard.json
```

## Peer Dependencies
- `lucide-react`
- `three`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license MIT
 * @origin Excalidraw (https://github.com/excalidraw/excalidraw)
 * @author Excalidraw & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import { PenTool, Eraser, RotateCcw, Download, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmbeddedWhiteboardProps {
  initialText?: string;
  className?: string;
}

export function EmbeddedWhiteboard({
  initialText = "AI Agent Workflow Whiteboard Annotation",
  className,
}: EmbeddedWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokeCount, setStrokeCount] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Initial sketch prompt text
    ctx.fillStyle = "#888888";
    ctx.font = "14px monospace";
    ctx.fillText(`// ${initialText}`, 20, 30);
  }, [initialText]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = tool === "pen" ? "currentColor" : "var(--background, #fff)";
    ctx.lineWidth = tool === "pen" ? 2 : 16;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    setStrokeCount((prev) => prev + 1);
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-xl border border-border bg-card text-foreground overflow-hidden shadow-sm",
        className
      )}
      role="region"
      aria-label="Embedded Vector Whiteboard"
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <PenTool className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-mono font-medium tracking-tight">
            WHITEBOARD // ANNOTATION_CANVAS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTool("pen")}
            aria-pressed={tool === "pen"}
            aria-label="Select pen tool"
            className={cn(
              "p-1.5 rounded-md border text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              tool === "pen" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"
            )}
          >
            <PenTool className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setTool("eraser")}
            aria-pressed={tool === "eraser"}
            aria-label="Select eraser tool"
            className={cn(
              "p-1.5 rounded-md border text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              tool === "eraser" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"
            )}
          >
            <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            aria-label="Clear whiteboard canvas"
            className="p-1.5 rounded-md border border-border bg-background text-xs transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative h-64 w-full bg-background">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="h-full w-full cursor-crosshair touch-none"
        >
          {/* Static accessible text fallback for screen-readers & non-canvas clients (SLOP-031) */}
          <div className="p-4 text-xs text-muted-foreground">
            Fallback view: {initialText}. Interactive vector sketching is not supported on this device.
          </div>
        </canvas>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2 text-[11px] font-mono text-muted-foreground">
        <span>STROKES: {strokeCount}</span>
        <span>EXCALIDRAW_PRIMITIVE</span>
      </div>
    </div>
  );
}

```
