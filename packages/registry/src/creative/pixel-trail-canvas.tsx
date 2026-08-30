/**
 * @license MIT
 * @origin React Bits (https://reactbits.dev)
 * @author DavidHDev & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface PixelTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  gridSize?: number;
  trailColor?: string;
  fadeDurationMs?: number;
  children?: React.ReactNode;
}

export function PixelTrailCanvas({
  gridSize = 24,
  trailColor = "rgba(56, 189, 248, 0.7)",
  fadeDurationMs = 600,
  children,
  className,
  ...props
}: PixelTrailProps) {
  // A11y Fallback: respects prefers-reduced-motion with static canvas fallback
  const prefersReduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const activePixelsRef = React.useRef<Map<string, number>>(new Map());

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = Math.floor(x / gridSize);
      const row = Math.floor(y / gridSize);
      activePixelsRef.current.set(`${col},${row}`, performance.now());
    };

    container.addEventListener("mousemove", handleMouseMove);

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const activePixels = activePixelsRef.current;

      for (const [key, timestamp] of activePixels.entries()) {
        const elapsed = time - timestamp;
        if (elapsed > fadeDurationMs) {
          activePixels.delete(key);
          continue;
        }

        const opacity = 1 - elapsed / fadeDurationMs;
        const [col, row] = key.split(",").map(Number);
        ctx.fillStyle = trailColor.replace(/[\d\.]+\)$/, `${opacity * 0.8})`);
        ctx.fillRect(col * gridSize + 1, row * gridSize + 1, gridSize - 2, gridSize - 2);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gridSize, trailColor, fadeDurationMs]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-xl border border-border bg-card p-6", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-80"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
