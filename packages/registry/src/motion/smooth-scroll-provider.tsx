/**
 * @license MIT
 * @origin Lenis (https://github.com/darkroomengineering/lenis)
 * @author Darkroom Engineering & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface SmoothScrollContextType {
  isSmoothEnabled: boolean;
  scrollTo: (target: string | number | HTMLElement) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  isSmoothEnabled: true,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
  duration?: number;
}

export function SmoothScrollProvider({
  children,
  duration = 1.2,
}: SmoothScrollProviderProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isSmoothEnabled, setIsSmoothEnabled] = useState<boolean>(!shouldReduceMotion);

  useEffect(() => {
    setIsSmoothEnabled(!shouldReduceMotion);
    if (shouldReduceMotion) return;

    // Apply smooth scroll class to root html element safely
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [shouldReduceMotion]);

  const scrollTo = (target: string | number | HTMLElement) => {
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: shouldReduceMotion ? "auto" : "smooth" });
    } else if (typeof target === "string") {
      const element = document.querySelector(target);
      element?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    }
  };

  return (
    <SmoothScrollContext value={{ isSmoothEnabled, scrollTo }}>
      {children}
    </SmoothScrollContext>
  );
}
