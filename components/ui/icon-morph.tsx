/**
 * @license MIT
 * @origin ReUI / Icons0 (https://reui.dev)
 * @author ReUI Team
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface IconMorphProps {
  state: "play" | "pause" | "check";
  className?: string;
  size?: number;
}

export function IconMorph({ state, className, size = 20 }: IconMorphProps) {
  return (
    <svg
      role="img"
      aria-label={`State icon: ${state}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("transition-transform duration-200", className)}
    >
      <title>{state.toUpperCase()}</title>
      {state === "play" && (
        <polygon points="6 3 20 12 6 21 6 3" className="fill-current" />
      )}
      {state === "pause" && (
        <>
          <rect x="6" y="4" width="4" height="16" className="fill-current" />
          <rect x="14" y="4" width="4" height="16" className="fill-current" />
        </>
      )}
      {state === "check" && <polyline points="20 6 9 17 4 12" />}
    </svg>
  );
}
