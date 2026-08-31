/**
 * @origin Motion Division & Paper Shaders (https://github.com/motiondivision/motion, https://github.com/paper-design/shaders)
 * @license MIT
 * @author Motion Division & Paper Design
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface KineticTypographyMarqueeProps {
  phrases?: string[];
  speed?: number; // duration in seconds e.g. 20
  direction?: "left" | "right";
  className?: string;
}

const DEFAULT_PHRASES = [
  "DETERMINISTIC UI ARCHITECTURE",
  "ZERO-SLOP AGENT PROTOCOL",
  "MODEL CONTEXT PROTOCOL",
  "100% WCAG 2.1 AA COMPLIANT",
  "TAILWIND V4 NATIVE",
];

export function KineticTypographyMarquee({
  phrases = DEFAULT_PHRASES,
  speed = 25,
  direction = "left",
  className,
}: KineticTypographyMarqueeProps) {
  const repeatedText = phrases.join("  ✦  ");

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-y border-border bg-background py-4 select-none",
        className
      )}
      role="region"
      aria-label="Kinetic Typography Stream"
    >
      <div
        className={cn(
          "flex whitespace-nowrap will-change-transform",
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse"
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        <span className="font-mono text-xl sm:text-2xl font-black tracking-tight text-foreground/90 uppercase px-4">
          {repeatedText}  ✦  {repeatedText}
        </span>
      </div>

      {/* Edge Gradient Mask */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
