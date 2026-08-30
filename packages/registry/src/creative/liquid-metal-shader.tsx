/**
 * @license MIT
 * @origin Cult UI / Aceternity (https://cult-ui.com)
 * @author Cult UI & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

export interface LiquidMetalShaderProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  distortion?: number;
}

export function LiquidMetalShader({
  speed = 0.02,
  distortion = 1.0,
  className,
  children,
  ...props
}: LiquidMetalShaderProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Static fallback if reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec3 color = vec3(0.0);

        float d = length(st - vec2(0.5));
        float val = sin(d * 18.0 - u_time * 2.0) * 0.5 + 0.5;

        color = vec3(val * 0.2 + 0.05, val * 0.4 + 0.1, val * 0.7 + 0.2);
        gl_FragColor = vec4(color, 0.85);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const resUniform = gl.getUniformLocation(program, "u_resolution");
    const timeUniform = gl.getUniformLocation(program, "u_time");

    let animId: number;
    let startTime = Date.now();

    const render = () => {
      const time = (Date.now() - startTime) * 0.001 * speed * 50;
      gl.uniform2f(resUniform, canvas.width, canvas.height);
      gl.uniform1f(timeUniform, time);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center p-8 rounded-2xl overflow-hidden border border-border bg-card shadow-lg",
        className
      )}
      role="region"
      aria-label="Liquid Metal WebGL Shader Surface"
      {...props}
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={250}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
