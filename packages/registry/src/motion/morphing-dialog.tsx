/**
 * @license MIT
 * @origin ibelick / motion-primitives (https://motion-primitives.com)
 * @author ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { X } from "lucide-react";

export interface MorphingDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  triggerText?: string;
  dialogTitle?: string;
  dialogContent?: React.ReactNode;
  children?: React.ReactNode;
}

export function MorphingDialog({
  triggerText = "Expand Details",
  dialogTitle = "Shared-Element Morph Dialog",
  dialogContent,
  children,
  className,
  ...props
}: MorphingDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const layoutId = React.useId();

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className={cn("inline-block", className)} {...props}>
      {/* Trigger Card / Button */}
      <motion.div
        layoutId={`dialog-container-${layoutId}`}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer p-4 rounded-xl border border-border bg-card text-card-foreground shadow-xs hover:border-primary/40 transition-colors focus-within:ring-2 focus-within:ring-ring"
        tabIndex={0}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={triggerText}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <motion.h4 layoutId={`dialog-title-${layoutId}`} className="text-xs font-semibold text-foreground">
          {triggerText}
        </motion.h4>
        {children && <div className="mt-2 text-xs text-muted-foreground">{children}</div>}
      </motion.div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Modal Box */}
            <motion.div
              layoutId={`dialog-container-${layoutId}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`dialog-title-${layoutId}`}
              className="relative w-full max-w-lg rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-xl z-10 space-y-4"
            >
              <header className="flex items-center justify-between">
                <motion.h3
                  id={`dialog-title-${layoutId}`}
                  layoutId={`dialog-title-${layoutId}`}
                  className="text-sm font-bold text-foreground"
                >
                  {dialogTitle}
                </motion.h3>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </header>

              <div className="text-xs text-muted-foreground leading-relaxed">
                {dialogContent || (
                  <p>
                    This shared-element morph seamlessly transitions between card layout and modal state using Framer Motion layoutId without Cumulative Layout Shift (CLS).
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
