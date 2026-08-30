/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { GripVertical } from "lucide-react";

export interface SplitPaneLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  initialSplitPercentage?: number; // 1-100
  minLeftWidth?: number;
  minRightWidth?: number;
}

export function SplitPaneLayout({
  leftPane,
  rightPane,
  initialSplitPercentage = 40,
  minLeftWidth = 200,
  minRightWidth = 200,
  className,
  ...props
}: SplitPaneLayoutProps) {
  const [split, setSplit] = React.useState(initialSplitPercentage);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const pct = Math.max(15, Math.min(85, (offsetX / rect.width) * 100));
    setSplit(pct);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  React.useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full min-h-[360px] rounded-xl border border-border bg-card shadow-xs overflow-hidden select-none",
        className
      )}
      role="group"
      aria-label="Split Pane Layout Container"
      {...props}
    >
      {/* Left Pane */}
      <div
        style={{ width: `${split}%` }}
        className="h-full overflow-auto p-4 border-r border-border/40"
      >
        {leftPane}
      </div>

      {/* Draggable Divider Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="relative flex items-center justify-center w-2 -mx-1 hover:w-3 z-10 cursor-col-resize bg-border hover:bg-primary transition-all duration-150 group"
        role="separator"
        aria-valuenow={Math.round(split)}
        aria-label="Resize Split Panes"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground opacity-60" aria-hidden="true" />
      </div>

      {/* Right Pane */}
      <div
        style={{ width: `${100 - split}%` }}
        className="h-full overflow-auto p-4 flex-1"
      >
        {rightPane}
      </div>
    </div>
  );
}
