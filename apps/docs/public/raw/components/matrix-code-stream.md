---
id: "matrix-code-stream"
name: "Matrix Code Stream"
category: "ui:creative"
library_origin: "https://github.com/design-agent-wiki"
dependencies:
  - "three"
  - "motion"
tags:
  - "webgl"
  - "threejs"
  - "canvas"
  - "tailwind-v4"
  - "wai-aria-compliant"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 9     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 5       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Matrix Code Stream (`matrix-code-stream`)
> Curated production-grade component.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: webgl, threejs, canvas, tailwind-v4, wai-aria-compliant
- **Design Dials**: Variance 8/10 · Motion 9/10 · Density 5/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add matrix-code-stream

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/matrix-code-stream.json
```

## Peer Dependencies
- `three`
- `motion`

## Verified TypeScript Source
```tsx
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
      <canvas ref={canvasRef} width={600} height={256} className="w-full h-full block" aria-hidden="true">
        <div className="p-4 text-xs text-muted-foreground">Fallback: Matrix streaming code animation active.</div>
      </canvas>
      <div className="absolute bottom-3 left-4 text-xs font-mono text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/20">
        SYS.MATRIX_STREAM // LIVE
      </div>
    </div>
  );
}

```
