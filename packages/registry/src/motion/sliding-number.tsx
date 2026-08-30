/**
 * @license MIT
 * @origin ibelick / motion-primitives (https://motion-primitives.com)
 * @author ibelick & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { cn } from "../lib/utils";

export interface SlidingNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function DigitColumn({ digit }: { digit: number }) {
  const spring = useSpring(digit, { mass: 0.8, stiffness: 85, damping: 15 });
  const y = useTransform(spring, (current) => -current * 10 + "%");

  React.useEffect(() => {
    spring.set(digit);
  }, [digit, spring]);

  return (
    <div className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-baseline">
      <motion.div style={{ y }} className="flex flex-col select-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="flex h-[1em] items-center justify-center">
            {i}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function SlidingNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  ...props
}: SlidingNumberProps) {
  const formatted = value.toFixed(decimals);
  const parts = formatted.split("");

  return (
    <span
      className={cn("inline-flex items-baseline font-mono font-bold tracking-tight text-foreground", className)}
      role="status"
      aria-live="polite"
      aria-label={`${prefix}${formatted}${suffix}`}
      {...props}
    >
      {prefix && <span>{prefix}</span>}
      {parts.map((char, index) => {
        if (!isNaN(parseInt(char, 10))) {
          return <DigitColumn key={`${index}-${char}`} digit={parseInt(char, 10)} />;
        }
        return <span key={`${index}-${char}`}>{char}</span>;
      })}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
