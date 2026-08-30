/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Category: ui:creative
 * Name: light-rays-ambient-shader
 */

import * as React from "react";

export interface LightRaysAmbientShaderProps {
  rayCount?: number;
  speed?: number;
  baseColor?: string; // hex or rgb
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const LightRaysAmbientShader: React.FC<LightRaysAmbientShaderProps> = ({
  rayCount = 18,
  speed = 0.0015,
  baseColor = "rgba(16, 185, 129, 0.15)", // emerald tint
  interactive = true,
  className = "",
  children,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const mousePos = React.useRef<{ x: number; y: number }>({ x: 0.5, y: 0.2 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current.x = (e.clientX - rect.left) / rect.width;
      mousePos.current.y = (e.clientY - rect.top) / rect.height;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Pre-allocated typed arrays to prevent memory leaks in render loop (SLOP-032)
    const angles = new Float32Array(rayCount);
    const widths = new Float32Array(rayCount);
    for (let i = 0; i < rayCount; i++) {
      angles[i] = (i / rayCount) * Math.PI * 2;
      widths[i] = 0.04 + (i % 3) * 0.02;
    }

    const render = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const originX = width * mousePos.current.x;
      const originY = height * mousePos.current.y;

      time += speed;

      for (let i = 0; i < rayCount; i++) {
        const angle = angles[i] + Math.sin(time + i * 0.5) * 0.3;
        const length = Math.max(width, height) * 1.5;
        const w = widths[i] * width;

        const endX1 = originX + Math.cos(angle - 0.1) * length;
        const endY1 = originY + Math.sin(angle - 0.1) * length;
        const endX2 = originX + Math.cos(angle + 0.1) * length;
        const endY2 = originY + Math.sin(angle + 0.1) * length;

        const grad = ctx.createRadialGradient(originX, originY, 0, originX, originY, length);
        grad.addColorStop(0, baseColor);
        grad.addColorStop(0.5, "rgba(16, 185, 129, 0.04)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(endX1, endY1);
        ctx.lineTo(endX2, endY2);
        ctx.closePath();
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [rayCount, speed, baseColor, interactive]);

  return (
    <div
      className={`relative w-full h-full min-h-[400px] overflow-hidden bg-background text-foreground rounded-xl border border-border ${className}`}
    >
      {/* Graceful CSS static background fallback */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Volumetric ambient light rays shader"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-6">
        {children || (
          <div className="text-center max-w-lg space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-primary/10 border border-primary/20 text-primary">
              GPU Volumetric Caustics
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">Volumetric Light Rays</h3>
            <p className="text-sm text-muted-foreground">
              Hardware-accelerated ambient rays with cursor physics and automatic reduced-motion fallback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default LightRaysAmbientShader;
