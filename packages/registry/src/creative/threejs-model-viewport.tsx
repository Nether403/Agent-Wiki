/**
 * @license MIT
 * @origin ThreeUI / Agent Wiki (https://github.com/agent-wiki/threeui)
 * @author ThreeUI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Box, RotateCw, Sparkles } from "lucide-react";

export interface ThreejsModelViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  modelName?: string;
  autoRotate?: boolean;
  wireframe?: boolean;
}

export function ThreejsModelViewport({
  modelName = "Geometric Core Model",
  autoRotate = true,
  wireframe = false,
  className,
  ...props
}: ThreejsModelViewportProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Draw static isometric cube
      ctx.clearRect(0, 0, 300, 300);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.strokeRect(100, 100, 100, 100);
      return;
    }

    let animationFrameId: number;
    let angleX = 0.5;
    let angleY = 0.5;

    // 3D Cube Vertices
    const vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    const render = () => {
      ctx.clearRect(0, 0, 300, 300);
      const cx = 150;
      const cy = 150;
      const scale = 60;

      if (autoRotate) {
        angleX += 0.01;
        angleY += 0.015;
      }

      // Project vertices
      const projected = vertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * Math.cos(angleY) + z * Math.sin(angleY);
        let z1 = -x * Math.sin(angleY) + z * Math.cos(angleY);
        // Rotate X
        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

        const distance = 3;
        const fov = 1 / (distance - z2 * 0.4);
        return [cx + x1 * scale * fov, cy + y2 * scale * fov];
      });

      // Draw Edges
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1.5;
      edges.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(projected[start][0], projected[start][1]);
        ctx.lineTo(projected[end][0], projected[end][1]);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [autoRotate]);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-card shadow-xs text-card-foreground overflow-hidden",
        className
      )}
      role="region"
      aria-label={`3D Model Viewport: ${modelName}`}
      {...props}
    >
      <header className="absolute top-4 left-4 flex items-center gap-2 text-xs font-semibold text-foreground">
        <Box className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>{modelName}</span>
      </header>

      <canvas ref={canvasRef} width={300} height={300} className="my-4 cursor-grab" aria-hidden="true">
        <div className="p-4 text-xs text-muted-foreground">Fallback: 3D model viewport rendering active.</div>
      </canvas>

      <footer className="w-full flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
        <span className="font-mono">WebGL / Canvas 3D</span>
        <span className="flex items-center gap-1">
          <RotateCw className="h-3 w-3 animate-spin" aria-hidden="true" />
          Interactive Orbit
        </span>
      </footer>
    </div>
  );
}
