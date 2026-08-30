/**
 * @license MIT
 * @origin Cult UI / Aceternity (https://cult-ui.com)
 * @author Cult UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface TextScramblerProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  triggerOnHover?: boolean;
  speed?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export function TextScrambler({
  text,
  triggerOnHover = true,
  speed = 30,
  className,
  ...props
}: TextScramblerProps) {
  const [displayText, setDisplayText] = React.useState(text);
  const [isScrambling, setIsScrambling] = React.useState(false);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, speed);
  };

  return (
    <span
      onMouseEnter={() => triggerOnHover && scramble()}
      className={cn(
        "inline-block font-mono font-bold tracking-tight cursor-default select-none text-foreground",
        className
      )}
      role="status"
      aria-label={text}
      {...props}
    >
      {displayText}
    </span>
  );
}
