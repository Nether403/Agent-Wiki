/**
 * @license MIT
 * @origin Cult UI / Agent Wiki (https://cult-ui.com)
 * @author Cult UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface DotMatrixScoreboardProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  dotSize?: number;
  gap?: number;
}

// 5x7 dot matrix font map for basic characters
const GLYPHS: Record<string, number[][]> = {
  "0": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "1": [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  "2": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  "3": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  A: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  G: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  E: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  " ": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

export function DotMatrixScoreboard({
  text = "AGENT 01",
  dotSize = 5,
  gap = 2,
  className,
  ...props
}: DotMatrixScoreboardProps) {
  const chars = text.toUpperCase().split("");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 p-4 rounded-xl border border-border bg-black shadow-inner",
        className
      )}
      role="status"
      aria-label={`Dot Matrix Scoreboard: ${text}`}
      {...props}
    >
      {chars.map((char, charIdx) => {
        const matrix = GLYPHS[char] || GLYPHS["0"];
        return (
          <div key={`${charIdx}-${char}`} className="flex flex-col" style={{ gap: `${gap}px` }}>
            {matrix.map((row, rowIdx) => (
              <div key={rowIdx} className="flex" style={{ gap: `${gap}px` }}>
                {row.map((active, colIdx) => (
                  <span
                    key={colIdx}
                    style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
                    className={cn(
                      "rounded-full transition-colors",
                      active ? "bg-amber-400 shadow-xs shadow-amber-400" : "bg-neutral-800/80"
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
