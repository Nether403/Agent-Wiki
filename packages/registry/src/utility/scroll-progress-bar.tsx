/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @author Community Contributor
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface ScrollProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  heightPx?: number;
}

export function ScrollProgressBar({
  heightPx = 3,
  className,
  ...props
}: ScrollProgressBarProps) {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) {
        setScrollProgress(0);
        return;
      }
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{ height: `${heightPx}px` }}
      className={cn("fixed top-0 left-0 right-0 z-50 bg-transparent", className)}
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page reading scroll progress"
      {...props}
    >
      <div
        style={{ width: `${scrollProgress}%` }}
        className="h-full bg-primary transition-all duration-75 ease-out shadow-xs"
      />
    </div>
  );
}
