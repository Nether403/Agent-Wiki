/**
 * @license MIT
 * @origin ReUI & Radix UI (https://reui.io)
 * @author ReUI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";
import { X } from "lucide-react";

export interface SheetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  position?: "left" | "right" | "bottom";
  className?: string;
}

export function InteractiveSheetDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = "right",
  className,
}: SheetDrawerProps) {
  const prefersReduced = useReducedMotion();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const variants = {
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  };

  const positionStyles = {
    right: "right-0 top-0 h-full w-full max-w-md border-l border-border",
    left: "left-0 top-0 h-full w-full max-w-md border-r border-border",
    bottom: "bottom-0 left-0 w-full max-h-[80vh] border-t border-border rounded-t-3xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-xs"
            aria-hidden="true"
          />
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : variants[position].initial}
            animate={prefersReduced ? { opacity: 1 } : variants[position].animate}
            exit={prefersReduced ? { opacity: 0 } : variants[position].exit}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={cn("fixed z-50 flex flex-col bg-card p-6 shadow-2xl overflow-y-auto", positionStyles[position], className)}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 id="sheet-title" className="text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h2>
                {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close sheet drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
