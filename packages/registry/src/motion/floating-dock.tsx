/**
 * @license MIT
 * @origin Aceternity UI (https://ui.aceternity.com)
 * @author Manu Arora
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "../lib/utils";

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

function DockIcon({
  mouseX,
  item,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  item: DockItem;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 68, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-secondary/80 text-secondary-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={item.onClick}
      role="button"
      tabIndex={0}
      aria-label={item.title}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          item.onClick?.();
        }
      }}
    >
      <div className="flex items-center justify-center pointer-events-none">
        {item.icon}
      </div>
    </motion.div>
  );
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-16 items-end gap-3 rounded-2xl border border-border bg-card px-4 pb-3 shadow-md",
        className
      )}
      role="toolbar"
      aria-label="Application dock"
    >
      {items.map((item, index) => (
        <DockIcon key={index} mouseX={mouseX} item={item} />
      ))}
    </div>
  );
}
