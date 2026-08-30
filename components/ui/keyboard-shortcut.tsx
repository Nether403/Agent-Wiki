/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Design Wiki Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface KeyboardShortcutProps extends React.HTMLAttributes<HTMLElement> {
  keys: string[];
  size?: "sm" | "md" | "lg";
}

export function KeyboardShortcut({
  keys,
  size = "md",
  className,
  ...props
}: KeyboardShortcutProps) {
  const sizeMap = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-1 text-xs",
    lg: "px-2.5 py-1.5 text-sm",
  };

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      {keys.map((k, idx) => (
        <kbd
          key={idx}
          className={cn(
            "inline-flex items-center justify-center font-mono font-medium rounded-lg border border-border bg-muted/80 text-muted-foreground shadow-xs select-none",
            sizeMap[size]
          )}
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}
