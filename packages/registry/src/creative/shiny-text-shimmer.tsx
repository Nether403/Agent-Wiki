/**
 * @license MIT
 * @origin Magic UI & React Bits (https://magicui.design / https://reactbits.dev)
 * @author Magic UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface ShinyTextShimmerProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  disabled?: boolean;
  speed?: number;
}

export function ShinyTextShimmer({
  text,
  disabled = false,
  speed = 4,
  className,
  ...props
}: ShinyTextShimmerProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent font-medium",
        !disabled && "animate-shiny-text",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: `${speed}s`,
      }}
      {...props}
    >
      <span className="text-foreground">{text}</span>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shiny-text {
            0% {
              background-position: 100% 0;
            }
            100% {
              background-position: -100% 0;
            }
          }
          .animate-shiny-text {
            animation: shiny-text 4s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-shiny-text {
              animation: none !important;
            }
          }
        `,
      }} />
    </span>
  );
}
