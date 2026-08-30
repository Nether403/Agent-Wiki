/**
 * @license MIT
 * @origin Motion (https://github.com/motiondivision/motion)
 * @author Motion Division & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SpringOrchestratorProps {
  staggerDelay?: number;
  className?: string;
  children: React.ReactNode;
}

export function SpringOrchestrator({
  staggerDelay = 0.08,
  className,
  children,
}: SpringOrchestratorProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn("grid gap-4", className)}
    >
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 320,
                  damping: 26,
                  mass: 0.9,
                },
              },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
