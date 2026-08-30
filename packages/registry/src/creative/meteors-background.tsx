/**
 * @license MIT
 * @origin Magic UI (https://github.com/magicuidesign/magicui)
 * @author Magic UI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface MeteorsBackgroundProps {
  number?: number;
  className?: string;
  children?: React.ReactNode;
}

interface MeteorStyle {
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
}

export function MeteorsBackground({
  number = 20,
  className,
  children,
}: MeteorsBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  const meteors = useMemo<MeteorStyle[]>(() => {
    const list: MeteorStyle[] = [];
    for (let i = 0; i < number; i++) {
      list.push({
        top: `${Math.floor(Math.random() * 80) - 20}%`,
        left: `${Math.floor(Math.random() * 100)}%`,
        animationDelay: `${(Math.random() * 1 + 0.2).toFixed(2)}s`,
        animationDuration: `${Math.floor(Math.random() * 8 + 4)}s`,
      });
    }
    return list;
  }, [number]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border bg-card p-8 text-foreground",
        className
      )}
    >
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {meteors.map((style, idx) => (
            <span
              key={idx}
              className="absolute h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] bg-primary/80 shadow-[0_0_0_1px_rgba(255,255,255,0.1)] before:absolute before:top-1/2 before:-translate-y-1/2 before:w-12 before:h-[1px] before:bg-gradient-to-r before:from-primary before:to-transparent"
              style={{
                top: style.top,
                left: style.left,
                animation: `meteor ${style.animationDuration} linear infinite`,
                animationDelay: style.animationDelay,
              }}
            />
          ))}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
