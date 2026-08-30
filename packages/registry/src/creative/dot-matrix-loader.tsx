/**
 * @license MIT
 * @origin Dot Matrix UI (https://dotmatrix.dev)
 * @author Dot Matrix Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DotMatrixLoaderProps {
  rows?: number;
  cols?: number;
  dotSize?: number;
  gap?: number;
  className?: string;
  label?: string;
}

export function DotMatrixLoader({
  rows = 5,
  cols = 5,
  dotSize = 6,
  gap = 6,
  className,
  label = "Loading content",
}: DotMatrixLoaderProps) {
  const [activeFrame, setActiveFrame] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % (rows + cols));
    }, 120);
    return () => clearInterval(timer);
  }, [rows, cols]);

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex flex-col items-center justify-center p-4", className)}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const distance = r + c;
          const isLit = (distance + activeFrame) % (rows + cols) < 3;

          return (
            <div
              key={i}
              style={{ width: dotSize, height: dotSize }}
              className={cn(
                "rounded-full transition-colors duration-150",
                isLit ? "bg-primary" : "bg-muted-foreground/20"
              )}
            />
          );
        })}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
