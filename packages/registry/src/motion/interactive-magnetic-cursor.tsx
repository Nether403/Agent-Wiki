/**
 * @license MIT
 * @origin Fancy Components (https://fancycomponents.dev)
 * @author Fancy Components & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useSpring, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface MagneticCursorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  strength?: number;
  radius?: number;
}

export function InteractiveMagneticCursor({
  children,
  strength = 0.35,
  radius = 120,
  className,
  ...props
}: MagneticCursorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < radius) {
      x.set(distX * strength);
      y.set(distY * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-block p-4", className)}
      {...props}
    >
      <motion.div style={{ x, y }} className="inline-block">
        {children}
      </motion.div>
    </div>
  );
}
