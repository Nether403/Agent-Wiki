/**
 * @license MIT
 * @origin Remocn (https://remocn.dev)
 * @author Remocn & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface LowerThirdProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  roleTitle?: string;
  affiliation?: string;
  show?: boolean;
}

export function MotionLowerThirdOverlay({
  name = "Dr. Elena Vance",
  roleTitle = "Principal AI Research Scientist",
  affiliation = "Machine-First Design Institute",
  show = true,
  className,
  ...props
}: LowerThirdProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className={cn("relative h-48 w-full max-w-xl overflow-hidden rounded-2xl bg-zinc-950 p-6 flex flex-col justify-end", className)}
      role="region"
      aria-label="Broadcast lower-third title card overlay"
      {...props}
    >
      <AnimatePresence>
        {show && (
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { x: -40, opacity: 0 }}
            animate={prefersReduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { x: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="flex items-stretch gap-3"
          >
            {/* Structural Accent Bar */}
            <div className="w-1.5 rounded-full bg-primary" aria-hidden="true" />

            <div className="space-y-0.5">
              <h3 className="text-xl font-bold tracking-tight text-white">{name}</h3>
              <p className="text-xs font-semibold text-primary">{roleTitle}</p>
              <p className="text-[11px] font-mono text-zinc-400">{affiliation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
