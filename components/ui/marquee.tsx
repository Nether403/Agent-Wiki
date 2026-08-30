/**
 * @license MIT
 * @origin Magic UI (https://magicui.design)
 * @author Dillion Verma & Community
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  children,
  pauseOnHover = true,
  direction = "left",
  speed = "normal",
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const durationMap = {
    slow: "40s",
    normal: "25s",
    fast: "15s",
  };

  return (
    <div
      aria-label="Scrolling Content Stream"
      className={cn(
        "group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          style={{ animationDuration: durationMap[speed] }}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)] animate-marquee",
            vertical && "flex-col",
            direction === "right" && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            "motion-reduce:animate-none"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
