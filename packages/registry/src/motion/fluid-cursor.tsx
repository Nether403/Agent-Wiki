/**
 * @license MIT
 * @origin Groot Studio (https://groot.studio)
 * @author Groot Studio Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "../lib/utils";

export interface FluidCursorProps {
  className?: string;
  size?: number;
}

export function FluidCursor({ className, size = 32 }: FluidCursorProps) {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [isVisible, setIsVisible] = React.useState(false);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  React.useEffect(() => {
    // Only activate on devices with a mouse
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - size / 2);
      mouseY.set(e.clientY - size / 2);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, size, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
        width: size,
        height: size,
      }}
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-50 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-xs",
        className
      )}
      aria-hidden="true"
    />
  );
}
