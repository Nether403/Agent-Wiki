/**
 * @license MIT
 * @origin ibelick / motion-primitives (https://motion-primitives.com)
 * @author ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface ProgressiveBlurProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "top" | "bottom" | "left" | "right";
  blurLayers?: number;
  maxBlur?: number;
}

export function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 6,
  maxBlur = 12,
  className,
  ...props
}: ProgressiveBlurProps) {
  const layers = Array.from({ length: blurLayers }, (_, i) => {
    const step = (i + 1) / blurLayers;
    const blurPx = step * maxBlur;
    return { step, blurPx };
  });

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-24 overflow-hidden",
        direction === "top" && "inset-x-0 top-0 bottom-auto",
        direction === "left" && "inset-y-0 left-0 right-auto w-24 h-full",
        direction === "right" && "inset-y-0 right-0 left-auto w-24 h-full",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {layers.map(({ step, blurPx }, idx) => (
        <div
          key={idx}
          style={{
            backdropFilter: `blur(${blurPx.toFixed(1)}px)`,
            WebkitBackdropFilter: `blur(${blurPx.toFixed(1)}px)`,
            maskImage: `linear-gradient(to ${direction}, rgba(0,0,0,0) ${(idx / blurLayers) * 100}%, rgba(0,0,0,1) ${step * 100}%)`,
            WebkitMaskImage: `linear-gradient(to ${direction}, rgba(0,0,0,0) ${(idx / blurLayers) * 100}%, rgba(0,0,0,1) ${step * 100}%)`,
          }}
          className="absolute inset-0"
        />
      ))}
    </div>
  );
}
