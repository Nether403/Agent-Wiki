/**
 * @license MIT
 * @origin Aceternity UI / Cult UI (https://ui.aceternity.com)
 * @author Aceternity & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface MatrixCodeStreamProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  fontSize?: number;
}

export function MatrixCodeStream({
  speed = 40,
  fontSize = 14,
  className,
  ...props
}: MatrixCodeStreamProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      ctx.fillStyle = "rgba(10, 10, 10, 0.9)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#10b981";
      ctx.font = `${fontSize}px monospace`;
      ctx.fillText("MATRIX CODE STREAM [STATIC REDUCED MOTION]", 20, 40);
      return;
    }

    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ";
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => 1);

    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#10b981";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, speed);

    return () => clearInterval(interval);
  }, [speed, fontSize]);

  return (
    <div
      className={cn(
        "relative w-full h-64 rounded-xl overflow-hidden border border-border bg-card dark:bg-black shadow-inner",
        className
      )}
      role="region"
      aria-label="Cascading Matrix Code Stream Background"
      {...props}
    >
      <canvas ref={canvasRef} width={600} height={256} className="w-full h-full block" aria-hidden="true" />
      <div className="absolute bottom-3 left-4 text-xs font-mono text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/20">
        SYS.MATRIX_STREAM // LIVE
      </div>
    </div>
  );
}
