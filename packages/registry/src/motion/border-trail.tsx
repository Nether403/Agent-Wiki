/**
 * @license MIT
 * @origin ibelick / motion-primitives (https://motion-primitives.com)
 * @author ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface BorderTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  color?: string;
}

export function BorderTrail({
  size = 60,
  duration = 6,
  color = "hsl(var(--primary))",
  className,
  ...props
}: BorderTrailProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animation: `border-trail-orbit ${duration}s linear infinite`,
          offsetPath: "rect(0% auto 100% 0% round 12px)",
        }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
