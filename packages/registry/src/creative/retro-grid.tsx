/**
 * @license MIT
 * @origin Magic UI (https://github.com/magicuidesign/magicui)
 * @author Magic UI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface RetroGridProps {
  angle?: number;
  className?: string;
  children?: React.ReactNode;
}

export function RetroGrid({
  angle = 65,
  className,
  children,
}: RetroGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-12 text-foreground",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]"
        aria-hidden="true"
      >
        {/* Animated grid plane */}
        <div
          className={cn(
            "absolute inset-0 [transform-origin:100%_0_0]",
            !shouldReduceMotion && "motion-safe:animate-grid"
          )}
          style={{
            transform: `rotateX(${angle}deg)`,
            backgroundImage: `linear-gradient(to right, rgba(120, 120, 120, 0.2) 1px, transparent 0),
                              linear-gradient(to bottom, rgba(120, 120, 120, 0.2) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
            backgroundRepeat: "repeat",
            height: "300%",
            marginLeft: "-50%",
            transformOrigin: "50% 0",
            width: "200%",
          }}
        />
      </div>

      {/* Linear top-to-bottom opacity fade */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
