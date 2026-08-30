/**
 * @license MIT
 * @origin ibelick / motion-primitives (https://motion-primitives.com)
 * @author ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { cn } from "../lib/utils";

export interface CounterOdometerProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function CounterOdometer({ value, className, ...props }: CounterOdometerProps) {
  const digits = Math.abs(value).toString().split("");
  const spring = useSpring(value, { mass: 0.5, stiffness: 75, damping: 15 });

  return (
    <div
      className={cn(
        "inline-flex items-center font-mono font-black text-2xl tracking-tighter text-foreground select-none",
        className
      )}
      role="status"
      aria-label={`Counter: ${value}`}
      {...props}
    >
      {digits.map((d, idx) => (
        <span
          key={`${idx}-${d}`}
          className="inline-flex h-9 w-6 items-center justify-center rounded-md bg-muted/40 border border-border mx-0.5"
        >
          {d}
        </span>
      ))}
    </div>
  );
}
