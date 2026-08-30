/**
 * @license Apache-2.0
 * @origin Paper Shaders (https://github.com/paper-design/shaders)
 * @author Paper Design & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useId } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface GrainNoiseShaderProps {
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function GrainNoiseShader({
  opacity = 0.05,
  className,
  children,
}: GrainNoiseShaderProps) {
  const filterId = useId();
  const shouldReduceMotion = useReducedMotion();

  // Respect user prefers-reduced-motion setting
  if (shouldReduceMotion) {
    return (
      <div className={cn("relative w-full rounded-xl border border-border bg-card text-foreground p-6", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border bg-card text-foreground",
        className
      )}
    >
      {/* Ultra-low-overhead SVG procedural simplex noise texture */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity }}
        aria-hidden="true"
      >
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>

      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}
