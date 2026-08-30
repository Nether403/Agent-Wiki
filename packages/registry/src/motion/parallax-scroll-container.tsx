/**
 * @license MIT
 * @origin Darkroom Engineering / Motion
 * @author Darkroom Engineering & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ParallaxScrollContainerProps {
  speedMultiplier?: number;
  className?: string;
  children: React.ReactNode;
}

export function ParallaxScrollContainer({
  speedMultiplier = 0.2,
  className,
  children,
}: ParallaxScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-50 * speedMultiplier, 50 * speedMultiplier]
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-xl border border-border bg-card", className)}
    >
      <motion.div style={{ y: yOffset }} className="relative w-full">
        {children}
      </motion.div>
    </div>
  );
}
