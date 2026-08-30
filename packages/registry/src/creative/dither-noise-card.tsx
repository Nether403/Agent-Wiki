/**
 * @license MIT
 * @origin Paper Shaders & React Bits (https://github.com/paper-design/shaders)
 * @author Paper Design & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DitherNoiseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  grainOpacity?: number;
  interactive?: boolean;
}

export function DitherNoiseCard({
  children,
  grainOpacity = 0.08,
  interactive = true,
  className,
  ...props
}: DitherNoiseCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-card p-6 shadow-xs overflow-hidden text-card-foreground",
        interactive && "transition-colors duration-200 hover:border-primary/50",
        className
      )}
      {...props}
    >
      {/* SVG Dither Filter Overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] contrast-125 dark:opacity-[0.12]"
        aria-hidden="true"
      >
        <filter id="dither-noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#dither-noise-filter)" />
      </svg>

      {/* Card Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
