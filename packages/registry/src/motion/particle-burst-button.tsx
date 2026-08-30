/**
 * @origin Machine-First Design Agent Wiki
 * @license MIT
 * @curated-by Machine-First Design Agent Wiki
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export interface ParticleBurstButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  burstColor?: string;
  particleCount?: number;
  children: React.ReactNode;
}

export function ParticleBurstButton({
  burstColor = "#10b981",
  particleCount = 12,
  children,
  className,
  onClick,
  ...props
}: ParticleBurstButtonProps) {
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = Math.random() * 40 + 30;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        color: burstColor,
        size: Math.random() * 4 + 3,
      };
    });

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);

    if (onClick) onClick(e);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-medium text-sm transition-colors",
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        <span>{children}</span>
      </button>

      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
            style={{
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
            }}
            initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: 0,
              x: p.x,
              y: p.y,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            aria-hidden="true"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
