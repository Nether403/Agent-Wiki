---
id: "spring-dialog"
name: "Spring Dialog"
category: "ui:motion"
library_origin: "https://kokonutui.com"
dependencies:
  - "motion"
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "lucide-react"
  - "tailwind-v4"
  - "glassmorphism"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "spring-physics"
  - "animate-presence"
  - "modal"
dials:
  design_variance: 5      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Spring Dialog (`spring-dialog`)
> Scale-and-fade physics modal with AnimatePresence and keyboard escape handling.

- **Taxonomy Category**: `ui:motion`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, lucide-react, tailwind-v4, glassmorphism, accessible, keyboard-accessible, wai-aria-compliant, spring-physics, animate-presence, modal
- **Design Dials**: Variance 5/10 · Motion 6/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add spring-dialog

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/spring-dialog.json
```

## Peer Dependencies
- `motion`
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @origin KokonutUI (https://github.com/kokonut-dev/kokonutui)
 * @license MIT
 * @author KokonutUI Team
 * @curated-by Machine-First Design Agent Wiki
 */
"use client";
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpringDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SpringDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: SpringDialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="spring-dialog-title"
            aria-describedby={description ? "spring-dialog-description" : undefined}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className={cn(
              "relative z-50 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl text-card-foreground",
              className
            )}
          >
            <div className="flex items-center justify-between pb-4">
              <h2 id="spring-dialog-title" className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {description && (
              <p id="spring-dialog-description" className="text-sm text-muted-foreground pb-4">
                {description}
              </p>
            )}
            <div className="pt-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

```
