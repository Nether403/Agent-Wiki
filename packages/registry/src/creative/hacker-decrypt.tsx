/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface HackerDecryptProps extends React.HTMLAttributes<HTMLSpanElement> {
  targetText: string;
  speed?: number;
}

const HEX_CHARS = "0123456789ABCDEF!@#$%^&*";

export function HackerDecrypt({
  targetText,
  speed = 40,
  className,
  ...props
}: HackerDecryptProps) {
  const [displayText, setDisplayText] = React.useState(targetText);

  React.useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, index) => {
            if (index < iteration) return targetText[index];
            return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, speed);

    return () => clearInterval(interval);
  }, [targetText, speed]);

  return (
    <span
      className={cn("font-mono font-bold text-primary tracking-wider select-none", className)}
      role="status"
      aria-label={targetText}
      {...props}
    >
      {displayText}
    </span>
  );
}
