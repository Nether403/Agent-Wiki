/**
 * @license MIT
 * @origin Magic UI (https://magicui.design)
 * @author Dillion Verma & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerDuration?: string;
  borderRadius?: string;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      children,
      className,
      shimmerDuration = "3s",
      borderRadius = "12px",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        style={{ borderRadius }}
        className={cn(
          "group relative inline-flex cursor-pointer items-center justify-center overflow-hidden border border-border bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {/* Shimmer sweep */}
        <div
          aria-hidden="true"
          style={{ animationDuration: shimmerDuration }}
          className="absolute -inset-full animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,hsl(var(--primary-foreground)/0.3)_50%,transparent_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        />

        {/* Content wrapper */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);
ShimmerButton.displayName = "ShimmerButton";
