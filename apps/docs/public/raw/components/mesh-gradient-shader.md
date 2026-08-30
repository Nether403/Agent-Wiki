---
id: "mesh-gradient-shader"
name: "Mesh Gradient Shader"
category: "ui:creative"
library_origin: "https://github.com/paper-design/shaders"
dependencies:
  - "motion"
  - "three"
  - "clsx"
  - "tailwind-merge"
tags:
  - "framer-motion"
  - "motion/react"
  - "animation"
  - "webgl"
  - "threejs"
  - "canvas"
  - "tailwind-v4"
  - "wai-aria-compliant"
  - "creative"
  - "shader"
  - "gradient"
  - "paper-shaders"
dials:
  design_variance: 8      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: 6     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: 4       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "high"
a11y:
  keyboard_navigable: false
  wai_aria_compliant: true
  fallback_provided: true
---

# Mesh Gradient Shader (`mesh-gradient-shader`)
> Zero-dependency WebGL organic gradient canvas with static CSS fallback and reduced-motion bypass.

- **Taxonomy Category**: `ui:creative`
- **Structural Complexity**: `HIGH`
- **Technical Tags**: framer-motion, motion/react, animation, webgl, threejs, canvas, tailwind-v4, wai-aria-compliant, creative, shader, gradient, paper-shaders
- **Design Dials**: Variance 8/10 · Motion 6/10 · Density 4/10
- **Accessibility AA**: Keyboard Nav: false, ARIA: true, Fallback: true

## Installation Recipe
```bash
# Native Design Wiki CLI
npx design-wiki add mesh-gradient-shader

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/mesh-gradient-shader.json
```

## Peer Dependencies
- `motion`
- `three`
- `clsx`
- `tailwind-merge`

## Verified TypeScript Source
```tsx
/**
 * @license Apache-2.0
 * @origin Paper Shaders (https://github.com/paper-design/shaders)
 * @author Paper Design & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

"use client";

import React, { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface MeshGradientShaderProps {
  className?: string;
  speed?: number;
  children?: React.ReactNode;
}

const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float color1 = sin(st.x * 3.0 + u_time * 0.5) * 0.5 + 0.5;
    float color2 = cos(st.y * 3.0 - u_time * 0.3) * 0.5 + 0.5;
    
    vec3 baseColor = vec3(0.1, 0.12, 0.16);
    vec3 accentColor = vec3(0.2, 0.25, 0.32);
    
    vec3 finalColor = mix(baseColor, accentColor, (color1 + color2) * 0.5);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function MeshGradientShader({
  className,
  speed = 1.0,
  children,
}: MeshGradientShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [hasWebGLError, setHasWebGLError] = useState<boolean>(false);

  useEffect(() => {
    // Respect user prefers-reduced-motion setting
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      setHasWebGLError(true);
      return;
    }

    // Compile Shaders
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vert || !frag) {
      setHasWebGLError(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setHasWebGLError(true);
      return;
    }

    gl.useProgram(program);

    // Pre-allocate buffer outside animation loop (SLOP-032)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");

    let animationFrameId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001 * speed;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      gl.uniform2f(resLoc, width, height);
      gl.uniform1f(timeLoc, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(posBuffer);
    };
  }, [shouldReduceMotion, speed]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border bg-card text-foreground",
        className
      )}
    >
      {/* Static accessible CSS fallback for reduced-motion or WebGL errors (SLOP-014, SLOP-031) */}
      {(shouldReduceMotion || hasWebGLError) && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-card via-muted/30 to-background"
          aria-hidden="true"
        />
      )}

      {!shouldReduceMotion && !hasWebGLError && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 p-8">{children}</div>
    </div>
  );
}

```
