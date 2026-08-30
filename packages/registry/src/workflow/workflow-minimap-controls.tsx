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
