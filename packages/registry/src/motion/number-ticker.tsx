/**
 * @origin Magic UI (https://github.com/magicuidesign/magicui)
 * @license MIT
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { cn } from "../lib/utils";

export interface NumberTickerProps extends React.ComponentPropsWithoutRef<"span"> {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
        }
      }),
    [springValue, decimalPlaces]
  );

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block font-mono tracking-wider tabular-nums text-foreground",
        className
      )}
      aria-label={String(value)}
      {...props}
    />
  );
}
