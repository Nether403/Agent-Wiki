/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface AsciiRainProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: number;
}

export function AsciiRain({ density = 30, className, ...props }: AsciiRainProps) {
  const [lines, setLines] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setLines(Array.from({ length: 8 }, () => "█▓▒░ [REDUCED MOTION] ░▒▓█"));
      return;
    }

    const chars = " .:-=+*#%@";
    const interval = setInterval(() => {
      setLines(
        Array.from({ length: 12 }, () =>
          Array.from({ length: 48 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
        )
      );
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <pre
      className={cn(
        "p-4 rounded-xl border border-border bg-card dark:bg-black font-mono text-xs text-emerald-500/80 leading-none overflow-hidden select-none",
        className
      )}
      role="region"
      aria-label="ASCII Terminal Rain Matrix"
      {...props}
    >
      {lines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
    </pre>
  );
}
