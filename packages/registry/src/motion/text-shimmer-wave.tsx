/**
 * @license MIT
 * @origin ibelick / motion-primitives (https://motion-primitives.com)
 * @author ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface TextShimmerWaveProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
  duration?: number;
  spread?: number;
}

export function TextShimmerWave({
  children,
  duration = 2.5,
  spread = 2,
  className,
  ...props
}: TextShimmerWaveProps) {
  return (
    <span
      style={
        {
          "--duration": `${duration}s`,
          "--spread": `${spread}`,
          backgroundImage:
            "linear-gradient(90deg, currentColor 0%, hsl(var(--primary)) 50%, currentColor 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: `text-shimmer ${duration}s ease-in-out infinite`,
        } as React.CSSProperties
      }
      className={cn("inline-block font-medium tracking-tight", className)}
      {...props}
    >
      {children}
    </span>
  );
}
