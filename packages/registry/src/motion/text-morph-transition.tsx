/**
 * @license MIT
 * @origin Motion Primitives / Magic UI (https://motion-primitives.com)
 * @author Ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface TextMorphTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  words?: string[];
  intervalMs?: number;
}

export function TextMorphTransition({
  words = ["Autonomous Agents", "Zero-Slop Design", "Machine-First Wiki", "Accessible Primitives"],
  intervalMs = 3000,
  className,
  ...props
}: TextMorphTransitionProps) {
  const [index, setIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsTransitioning(false);
      }, 300);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [words, intervalMs]);

  const currentWord = words[index];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-bold tracking-tight text-foreground transition-opacity duration-200",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={`Morphing text: ${currentWord}`}
      {...props}
    >
      <span
        className={cn(
          "inline-block transition-opacity duration-200 transform",
          isTransitioning
            ? "opacity-0 -translate-y-2 filter blur-xs"
            : "opacity-100 translate-y-0 filter blur-0"
        )}
      >
        {currentWord}
      </span>
    </div>
  );
}
