/**
 * @license MIT
 * @origin Magic UI / Aceternity (https://ui.aceternity.com)
 * @author Magic UI & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface GlowBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderRadius?: number;
  color?: string[];
  duration?: number;
}

export function GlowBorder({
  borderRadius = 16,
  duration = 10,
  className,
  children,
  ...props
}: GlowBorderProps) {
  return (
    <div
      style={{ borderRadius: `${borderRadius}px` }}
      className={cn(
        "relative min-h-16 w-full p-px overflow-hidden bg-card text-card-foreground border border-border",
        className
      )}
      {...props}
    >
      {/* Animated glow ray */}
      <div
        aria-hidden="true"
        style={{
          borderRadius: `${borderRadius}px`,
          animationDuration: `${duration}s`,
        }}
        className="absolute inset-0 -z-10 animate-spin bg-[conic-gradient(from_0deg_at_50%_50%,hsl(var(--primary))_0deg,transparent_60deg,transparent_300deg,hsl(var(--primary))_360deg)] opacity-40 motion-reduce:hidden"
      />

      {/* Surface content container */}
      <div
        style={{ borderRadius: `${Math.max(0, borderRadius - 1)}px` }}
        className="relative z-10 h-full w-full bg-card p-6"
      >
        {children}
      </div>
    </div>
  );
}
