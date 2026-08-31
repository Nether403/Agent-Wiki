/**
 * @origin Visual Regression Tracker & BackstopJS (https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker)
 * @license MIT
 * @author Visual Regression Tracker Community & Garris Shipon
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { Sliders, Eye, CheckCircle2, XCircle, AlertTriangle, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VisualDiffRegressionViewerProps {
  baselineLabel?: string;
  comparisonLabel?: string;
  diffPercentage?: number;
  status?: "passed" | "failed" | "unreviewed";
  baselineContent?: React.ReactNode;
  comparisonContent?: React.ReactNode;
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
}

export function VisualDiffRegressionViewer({
  baselineLabel = "Baseline (Main Branch)",
  comparisonLabel = "Candidate (Agent PR Draft)",
  diffPercentage = 2.4,
  status = "unreviewed",
  baselineContent,
  comparisonContent,
  onApprove,
  onReject,
  className,
}: VisualDiffRegressionViewerProps) {
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const [viewMode, setViewMode] = React.useState<"split" | "side-by-side" | "onion-skin">("split");
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      setSliderPosition((x / rect.width) * 100);
    },
    [isDragging]
  );

  const handlePointerUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      className={cn(
        "w-full space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs transition-colors duration-200",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Visual Regression Diff Comparator
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold uppercase tracking-wider",
                diffPercentage === 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : diffPercentage > 5
                  ? "bg-destructive/10 text-destructive"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}
            >
              {diffPercentage === 0 ? (
                <>
                  <CheckCircle2 className="h-3 w-3" role="img" aria-hidden="true" /> 0% Delta
                </>
              ) : diffPercentage > 5 ? (
                <>
                  <XCircle className="h-3 w-3" role="img" aria-hidden="true" /> {diffPercentage}% Delta
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3" role="img" aria-hidden="true" /> {diffPercentage}% Delta
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Pixel-level screenshot and DOM layout comparison gate for automated design QA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-muted/60 p-0.5 text-xs">
            {(["split", "side-by-side", "onion-skin"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-2.5 py-1 font-medium capitalize rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  viewMode === mode
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={viewMode === mode}
              >
                {mode.replace("-", " ")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-border">
            <button
              type="button"
              onClick={onReject}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
            >
              <XCircle className="h-3.5 w-3.5" role="img" aria-hidden="true" />
              Reject
            </button>
            <button
              type="button"
              onClick={onApprove}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CheckCircle2 className="h-3.5 w-3.5" role="img" aria-hidden="true" />
              Approve
            </button>
          </div>
        </div>
      </div>

      {viewMode === "split" && (
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative h-[320px] w-full overflow-hidden rounded-lg border border-border bg-muted/20 select-none cursor-ew-resize"
          role="region"
          aria-label="Interactive Split Diff Viewport"
        >
          {/* Baseline Layer (Left) */}
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-card">
            {baselineContent || (
              <div className="space-y-3 w-full max-w-sm rounded-lg border border-border/80 bg-background p-4 shadow-xs">
                <div className="h-4 w-24 rounded-sm bg-muted animate-pulse" />
                <div className="h-6 w-3/4 rounded-sm bg-primary/20" />
                <div className="h-3 w-full rounded-sm bg-muted" />
                <div className="h-8 w-28 rounded-md bg-primary/30" />
              </div>
            )}
            <span className="absolute bottom-2 left-2 rounded-xs bg-background/90 px-1.5 py-0.5 font-mono text-2xs text-muted-foreground border border-border">
              {baselineLabel}
            </span>
          </div>

          {/* Comparison Layer (Right with Clip Path) */}
          <div
            className="absolute inset-0 flex items-center justify-center p-6 bg-card"
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          >
            {comparisonContent || (
              <div className="space-y-3 w-full max-w-sm rounded-lg border border-border bg-background p-4 shadow-xs">
                <div className="h-4 w-28 rounded-sm bg-muted" />
                <div className="h-6 w-4/5 rounded-sm bg-primary/40" />
                <div className="h-3 w-full rounded-sm bg-muted" />
                <div className="h-8 w-32 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                  Get Started
                </div>
              </div>
            )}
            <span className="absolute bottom-2 right-2 rounded-xs bg-background/90 px-1.5 py-0.5 font-mono text-2xs text-muted-foreground border border-border">
              {comparisonLabel}
            </span>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-md cursor-ew-resize z-10"
            style={{ left: `${sliderPosition}%` }}
            onPointerDown={() => setIsDragging(true)}
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md">
              <Sliders className="h-3.5 w-3.5 rotate-90" role="img" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}

      {viewMode === "side-by-side" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>{baselineLabel}</span>
              <span className="font-mono">Reference</span>
            </div>
            <div className="h-[260px] flex items-center justify-center rounded-lg border border-border bg-muted/10 p-4">
              {baselineContent || (
                <div className="space-y-2.5 w-full max-w-xs rounded-lg border border-border/80 bg-card p-4">
                  <div className="h-4 w-20 rounded-xs bg-muted" />
                  <div className="h-5 w-3/4 rounded-xs bg-primary/20" />
                  <div className="h-3 w-full rounded-xs bg-muted" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>{comparisonLabel}</span>
              <span className="font-mono text-amber-500">Candidate</span>
            </div>
            <div className="h-[260px] flex items-center justify-center rounded-lg border border-border bg-muted/10 p-4">
              {comparisonContent || (
                <div className="space-y-2.5 w-full max-w-xs rounded-lg border border-border bg-card p-4">
                  <div className="h-4 w-24 rounded-xs bg-muted" />
                  <div className="h-5 w-4/5 rounded-xs bg-primary/40" />
                  <div className="h-3 w-full rounded-xs bg-muted" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {viewMode === "onion-skin" && (
        <div className="relative h-[280px] w-full flex items-center justify-center rounded-lg border border-border bg-muted/10 p-4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            {baselineContent || (
              <div className="space-y-2 w-64 rounded-lg border border-border bg-card p-4">
                <div className="h-4 w-20 bg-muted" />
                <div className="h-5 w-3/4 bg-primary/20" />
              </div>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-70 mix-blend-difference">
            {comparisonContent || (
              <div className="space-y-2 w-64 rounded-lg border border-border bg-card p-4">
                <div className="h-4 w-24 bg-muted" />
                <div className="h-5 w-4/5 bg-primary/40" />
              </div>
            )}
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-background/90 px-2 py-1 text-2xs border border-border text-muted-foreground">
            <Layers className="h-3 w-3" role="img" aria-hidden="true" />
            <span>Onion Skin Overlap: Difference Blend Mode</span>
          </div>
        </div>
      )}
    </div>
  );
}
