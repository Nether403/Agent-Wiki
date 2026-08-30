/**
 * @license MIT
 * @origin Aceternity UI (https://ui.aceternity.com)
 * @author Aceternity & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface TracingBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TracingBeamScroll({ children, className, ...props }: TracingBeamProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const prefersReduced = useReducedMotion();

  const contentRef = React.useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = React.useState(0);

  React.useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), { stiffness: 450, damping: 90 });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), { stiffness: 450, damping: 90 });

  return (
    <motion.div ref={ref} className={cn("relative mx-auto w-full max-w-4xl", className)} {...props}>
      <div className="absolute -left-4 top-3 md:-left-12" aria-hidden="true">
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          className="ml-7 flex h-4 w-4 items-center justify-center rounded-full border border-border shadow-xs"
        >
          <motion.div
            transition={{ duration: 0.2, delay: 0.5 }}
            className="h-2 w-2 rounded-full border border-primary bg-primary"
          />
        </motion.div>
        {!prefersReduced && (
          <svg
            viewBox={`0 0 20 ${svgHeight}`}
            width="20"
            height={svgHeight}
            className="ml-4 block"
            aria-hidden="true"
          >
            <motion.path
              d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
              fill="none"
              stroke="#9091A0"
              strokeOpacity="0.16"
              transition={{ duration: 10 }}
            />
            <motion.path
              d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
              fill="none"
              stroke="url(#gradient-beam)"
              strokeWidth="2"
              className="motion-reduce:hidden"
              transition={{ duration: 10 }}
            />
            <defs>
              <motion.linearGradient
                id="gradient-beam"
                gradientUnits="userSpaceOnUse"
                x1="0"
                x2="0"
                y1={y1}
                y2={y2}
              >
                <stop stopColor="#38bdf8" stopOpacity="0" />
                <stop stopColor="#818cf8" />
                <stop offset="0.325" stopColor="#c084fc" />
                <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
              </motion.linearGradient>
            </defs>
          </svg>
        )}
      </div>
      <div ref={contentRef} className="pl-6 md:pl-0">
        {children}
      </div>
    </motion.div>
  );
}
