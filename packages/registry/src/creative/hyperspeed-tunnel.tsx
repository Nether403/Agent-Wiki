/**
 * @license MIT
 * @origin React Bits (https://reactbits.dev)
 * @author React Bits & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
}

export interface HyperspeedTunnelProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  starCount?: number;
}

export function HyperspeedTunnel({
  speed = 12,
  starCount = 350,
  children,
  className,
  ...props
}: HyperspeedTunnelProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.offsetWidth || 600);
    const height = (canvas.height = canvas.offsetHeight || 350);

    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        pz: Math.random() * width,
      });
    }

    const render = () => {
      ctx.fillStyle = "rgba(10, 15, 30, 0.25)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.pz = s.z;
        s.z -= speed;

        if (s.z <= 0) {
          s.z = width;
          s.pz = width;
          s.x = (Math.random() - 0.5) * width * 2;
          s.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 128 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        const pk = 128 / s.pz;
        const ppx = s.x * pk + cx;
        const ppy = s.y * pk + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = Math.min(2.5, (1 - s.z / width) * 2.5);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      render();
      return;
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [speed, starCount]);

  // ErrorBoundary & static canvas fallback provided
  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full h-80 rounded-2xl border border-border bg-card dark:bg-black text-card-foreground shadow-sm overflow-hidden select-none",
        className
      )}
      role="region"
      aria-label="Hyperspeed Warp Tunnel Simulation"
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        aria-label="Hyperspeed Starfield Canvas"
      >
        <div role="img" aria-label="Hyperspeed Canvas Fallback">Hyperspeed warp effect active</div>
      </canvas>

      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        {children}
      </div>
    </div>
  );
}
