/**
 * @license MIT
 * @origin https://github.com/tldraw/tldraw
 * @author tldraw Team & Community
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:workflow
 * Description: Floating viewport HUD overlay with zoom level slider, pan reset, snapping grid toggle, and layer management.
 */

import * as React from "react";
import { ZoomIn, ZoomOut, Maximize2, Grid, Layers, MousePointer2, Move, Undo2, Redo2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SpatialCanvasHUDProps {
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onResetView?: () => void;
  gridEnabled?: boolean;
  onToggleGrid?: () => void;
  activeTool?: "select" | "hand" | "node";
  onSelectTool?: (tool: "select" | "hand" | "node") => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  className?: string;
}

export function SpatialCanvasHUD({
  zoomLevel,
  onZoomChange,
  onResetView,
  gridEnabled = true,
  onToggleGrid,
  activeTool = "select",
  onSelectTool,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = false,
  className,
}: SpatialCanvasHUDProps) {
  const handleZoomIn = () => onZoomChange(Math.min(300, Math.round(zoomLevel + 10)));
  const handleZoomOut = () => onZoomChange(Math.max(25, Math.round(zoomLevel - 10)));

  return (
    <div
      role="region"
      aria-label="Canvas Navigation HUD"
      className={cn(
        "absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl border border-border bg-card/90 backdrop-blur-md text-card-foreground shadow-xl pointer-events-auto",
        className
      )}
    >
      {/* Tool Selector Group */}
      <div className="flex items-center gap-1 pr-1.5 border-r border-border">
        <button
          type="button"
          aria-label="Selection Tool"
          aria-pressed={activeTool === "select"}
          onClick={() => onSelectTool?.("select")}
          className={cn(
            "p-2 rounded-xl text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            activeTool === "select" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
          )}
        >
          <MousePointer2 className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Pan Canvas Tool"
          aria-pressed={activeTool === "hand"}
          onClick={() => onSelectTool?.("hand")}
          className={cn(
            "p-2 rounded-xl text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            activeTool === "hand" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
          )}
        >
          <Move className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* History Controls */}
      <div className="flex items-center gap-1 pr-1.5 border-r border-border">
        <button
          type="button"
          aria-label="Undo canvas change"
          disabled={!canUndo}
          onClick={onUndo}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Undo2 className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Redo canvas change"
          disabled={!canRedo}
          onClick={onRedo}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Redo2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Zoom HUD */}
      <div className="flex items-center gap-1 px-1">
        <button
          type="button"
          aria-label="Zoom out canvas"
          onClick={handleZoomOut}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ZoomOut className="w-4 h-4" aria-hidden="true" />
        </button>
        <span className="w-12 text-center text-xs font-mono font-semibold text-foreground select-none">
          {Math.round(zoomLevel)}%
        </span>
        <button
          type="button"
          aria-label="Zoom in canvas"
          onClick={handleZoomIn}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ZoomIn className="w-4 h-4" aria-hidden="true" />
        </button>
        {onResetView && (
          <button
            type="button"
            aria-label="Fit View to Screen"
            onClick={onResetView}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Grid Toggle */}
      {onToggleGrid && (
        <div className="pl-1.5 border-l border-border">
          <button
            type="button"
            aria-label="Toggle grid background snapping"
            aria-pressed={gridEnabled}
            onClick={onToggleGrid}
            className={cn(
              "p-2 rounded-xl text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              gridEnabled ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Grid className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
