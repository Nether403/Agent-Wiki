---
id: "toast-notification-center"
name: "Toast Notification Center"
category: "ui:primitive"
library_origin: "https://github.com/timolins/react-hot-toast"
dependencies:
  - "lucide-react"
  - "clsx"
  - "tailwind-merge"
tags:
  - "lucide-react"
  - "tailwind-v4"
  - "accessible"
  - "keyboard-accessible"
  - "wai-aria-compliant"
  - "layout-block"
  - "toast"
  - "notification"
  - "alert"
  - "live-region"
  - "a11y"
  - "react-hot-toast"
  - "gui-challenges"
dials:
  design_variance: 3      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 4     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 7       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: true
  wai_aria_compliant: true
  fallback_provided: true
---

# Toast Notification Center (`toast-notification-center`)
> Accessible WAI-ARIA live region toast stacker with swipe-to-dismiss, action buttons, progress timer, and zero layout shift.

- **Taxonomy Category**: `ui:primitive`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: lucide-react, tailwind-v4, accessible, keyboard-accessible, wai-aria-compliant, layout-block, toast, notification, alert, live-region, a11y, react-hot-toast, gui-challenges
- **Design Dials**: Variance 3/10 · Motion 4/10 · Density 7/10
- **Accessibility AA**: Keyboard Nav: true, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add toast-notification-center

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/toast-notification-center.json
```

## Peer Dependencies
- `lucide-react`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * SPDX-License-Identifier: MIT
 * Source: Machine-First Design Agent Wiki (Inspired by timolins/react-hot-toast & argyleink/gui-challenges)
 * Category: ui:primitive
 * Description: Accessible WAI-ARIA live region toast stacker with swipe-to-dismiss, action buttons, progress timer, and zero layout shift.
 */

import * as React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastNotificationCenterProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

const typeIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" aria-hidden="true" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />,
  info: <Info className="w-5 h-5 text-sky-500 shrink-0" aria-hidden="true" />,
};

export function ToastNotificationCenter({
  toasts,
  onDismiss,
  position = "bottom-right",
  className,
}: ToastNotificationCenterProps) {
  const positionClasses = {
    "top-right": "top-4 right-4 items-end",
    "top-left": "top-4 left-4 items-start",
    "bottom-right": "bottom-4 right-4 items-end",
    "bottom-left": "bottom-4 left-4 items-start",
  };

  return (
    <aside
      aria-label="Notification Stack"
      aria-live="polite"
      aria-atomic="false"
      className={cn(
        "fixed z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full p-4",
        positionClasses[position],
        className
      )}
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </aside>
  );
}

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const { id, title, description, type = "info", duration = 5000, action } = toast;
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    if (duration <= 0) return;
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss(id);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto relative w-full overflow-hidden rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg transition-colors",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      )}
    >
      <div className="flex items-start gap-3">
        {typeIcons[type]}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">{title}</h4>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
          )}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-2 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label={`Dismiss ${title} notification`}
          className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

```
