/**
 * @license MIT
 * @origin icons0 / Dot Matrix (https://icons0.dev)
 * @author icons0 Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DotLoaderProps {
  size?: "sm" | "default" | "lg";
  className?: string;
  label?: string;
}

export function DotLoader({
  size = "default",
  className,
  label = "Loading...",
}: DotLoaderProps) {
  const sizeClasses = {
    sm: "h-1.5 w-1.5",
    default: "h-2 w-2",
    lg: "h-3 w-3",
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <span
        className={cn(
          "rounded-full bg-current animate-bounce [animation-delay:-0.3s]",
          sizeClasses[size]
        )}
      />
      <span
        className={cn(
          "rounded-full bg-current animate-bounce [animation-delay:-0.15s]",
          sizeClasses[size]
        )}
      />
      <span
        className={cn("rounded-full bg-current animate-bounce", sizeClasses[size])}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
