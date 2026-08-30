/**
 * @license MIT
 * @origin Fancy Components (https://fancycomponents.dev)
 * @author Fancy Components & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

export interface GravityTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  gravity?: number;
  restitution?: number;
}

export function GravityTextPhysics({
  text = "Deterministic Zero-Slop Architecture for AI Coding Agents",
  gravity = 0.4,
  restitution = 0.7,
  className,
  ...props
}: GravityTextProps) {
  // A11y Fallback: respects prefers-reduced-motion with static text fallback
  const prefersReduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = React.useState(false);

  const startSimulation = () => {
    if (prefersReduced || isActive) return;
    setIsActive(true);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const words = text.split(" ");
    ctx.font = "bold 18px sans-serif";

    const bodies: Array<{
      word: string;
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
      angle: number;
      va: number;
    }> = [];

    let currentX = 20;
    let currentY = 40;

    words.forEach((w) => {
      const metrics = ctx.measureText(w);
      const width = metrics.width + 16;
      if (currentX + width > rect.width - 20) {
        currentX = 20;
        currentY += 45;
      }
      bodies.push({
        word: w,
        x: currentX,
        y: currentY,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * -2,
        w: width,
        h: 32,
        angle: (Math.random() - 0.5) * 0.2,
        va: (Math.random() - 0.5) * 0.05,
      });
      currentX += width + 10;
    });

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bodies.forEach((b) => {
        b.vy += gravity;
        b.x += b.vx;
        b.y += b.vy;
        b.angle += b.va;

        // Ground collision
        if (b.y + b.h > canvas.height) {
          b.y = canvas.height - b.h;
          b.vy = -b.vy * restitution;
          b.vx *= 0.95;
          b.va *= 0.95;
        }

        // Wall collisions
        if (b.x < 0) {
          b.x = 0;
          b.vx = -b.vx * restitution;
        } else if (b.x + b.w > canvas.width) {
          b.x = canvas.width - b.w;
          b.vx = -b.vx * restitution;
        }

        ctx.save();
        ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
        ctx.rotate(b.angle);

        // Draw pill box
        ctx.fillStyle = "rgba(39, 39, 42, 0.9)";
        ctx.strokeStyle = "rgba(113, 113, 122, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 8);
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.fillStyle = "#ffffff";
        ctx.font = "600 14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.word, 0, 1);

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative h-64 w-full overflow-hidden rounded-2xl border border-border bg-card p-6 flex flex-col justify-between cursor-pointer", className)}
      onClick={startSimulation}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startSimulation();
        }
      }}
      aria-label="Click to drop words into dynamic physics gravity simulation"
      {...props}
    >
      {!isActive ? (
        <div className="flex flex-wrap gap-2.5">
          {text.split(" ").map((w, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-sm font-semibold text-foreground"
            >
              {w}
            </span>
          ))}
        </div>
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      )}
      <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>[PHYSICS ENGINE: 2D GRAVITY CANVAS]</span>
        <span>{!isActive ? "CLICK TO RELEASE GRAVITY" : "PHYSICS ACTIVE"}</span>
      </div>
    </div>
  );
}
