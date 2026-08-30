/**
 * @license MIT
 * @origin Remocn / Remotion (https://remotion.dev)
 * @author Remotion & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { GripVertical } from "lucide-react";

export interface SplitVideoComparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  beforeLabel?: string;
  afterLabel?: string;
  beforeNode?: React.ReactNode;
  afterNode?: React.ReactNode;
}

export function SplitVideoComparator({
  beforeLabel = "AI Slop (Before)",
  afterLabel = "Zero-Slop Standard (After)",
  beforeNode,
  afterNode,
  className,
  ...props
}: SplitVideoComparatorProps) {
  const [sliderPos, setSliderPos] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={cn(
        "relative w-full aspect-video rounded-2xl border border-border overflow-hidden select-none bg-card shadow-lg",
        className
      )}
      role="region"
      aria-label="Split Before/After Video Comparator"
      {...props}
    >
      {/* After Container (Base Layer) */}
      <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
        {afterNode || (
          <div className="text-center space-y-1">
            <h4 className="text-sm font-bold text-primary">{afterLabel}</h4>
            <p className="text-xs text-muted-foreground">Clean Tailwind v4 semantic tokens & AA contrast</p>
          </div>
        )}
      </div>

      {/* Before Container (Clipped Overlay) */}
      <div
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        className="absolute inset-0 flex items-center justify-center bg-destructive/10"
      >
        {beforeNode || (
          <div className="text-center space-y-1">
            <h4 className="text-sm font-bold text-destructive">{beforeLabel}</h4>
            <p className="text-xs text-muted-foreground">Arbitrary pixels, purple gradients, & missing a11y</p>
          </div>
        )}
      </div>

      {/* Draggable Divider Curtain */}
      <div
        onMouseDown={handleMouseDown}
        style={{ left: `${sliderPos}%` }}
        className="absolute top-0 bottom-0 w-1 bg-border shadow-md -translate-x-1/2 cursor-ew-resize flex items-center justify-center z-20"
        role="separator"
        aria-valuenow={Math.round(sliderPos)}
        aria-label="Resize comparator divider"
      >
        <div className="flex items-center justify-center h-8 w-5 rounded bg-card border border-border shadow-md text-foreground">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
