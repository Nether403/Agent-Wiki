/**
 * @license MIT
 * @origin Animata / Magic UI
 * @author Animata Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  className?: string;
}

export function InteractiveHoverButton({
  text = "Explore Registry",
  className,
  ref,
  ...props
}: InteractiveHoverButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-full border border-border bg-background px-6 py-2.5 text-center font-medium text-foreground transition-colors duration-200 hover:bg-muted/40 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <span className="inline-block transition-transform transition-opacity duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>

      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-transform transition-opacity duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span className="text-sm font-semibold">{text}</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </div>

      {!shouldReduceMotion && (
        <motion.div
          className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-full bg-primary transition-transform duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8]"
          initial={false}
          animate={{ scale: isHovered ? 1.8 : 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
        />
      )}
    </button>
  );
}
