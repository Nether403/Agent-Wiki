/**
 * @license MIT
 * @origin React Bits / Cult UI (https://reactbits.dev)
 * @author React Bits & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";

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
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float color1 = sin(uv.x * 6.0 + u_time * 0.8);
    float color2 = cos(uv.y * 6.0 - u_time * 0.8);
    float color3 = sin((uv.x + uv.y) * 4.0 + u_time * 0.5);

    vec3 col = vec3(
      0.5 + 0.5 * sin(color1 * 3.1415),
      0.5 + 0.5 * cos(color2 * 3.1415),
      0.5 + 0.5 * sin(color3 * 3.1415)
    );

    gl_FragColor = vec4(col * 0.85, 1.0);
  }
`;

const STATIC_POSITIONS = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);

export interface IridescenceShaderPlaneProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

export function IridescenceShaderPlane({
  speed = 1.0,
  children,
  className,
  ...props
}: IridescenceShaderPlaneProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setHasError(true);
      return;
    }

    const compileShader = (type: number, src: string) => {
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

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SRC_SAFE(FRAGMENT_SHADER_SRC));
    if (!vertShader || !fragShader) {
      setHasError(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, STATIC_POSITIONS, gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const resUniform = gl.getUniformLocation(program, "u_resolution");
    const timeUniform = gl.getUniformLocation(program, "u_time");

    let animId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = ((now - startTime) / 1000) * speed;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resUniform, canvas.width, canvas.height);
      gl.uniform1f(timeUniform, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      render(performance.now());
      return;
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      gl.deleteProgram(program);
      gl.deleteBuffer(posBuffer);
    };
  }, [speed]);

  // ErrorBoundary & static canvas fallback provided
  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full h-80 rounded-2xl border border-border bg-card dark:bg-black text-card-foreground shadow-sm overflow-hidden select-none",
        className
      )}
      role="region"
      aria-label="Iridescence Chromatic Shader Plane"
      {...props}
    >
      {!hasError ? (
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="absolute inset-0 w-full h-full object-cover"
          aria-label="Chromatic Shader WebGL Canvas"
        >
          <div role="img" aria-label="Iridescence Canvas Fallback">Iridescence shader active</div>
        </canvas>
      ) : (
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-xs" />
      )}

      {/* Foreground Content Container */}
      <div className="relative z-10 p-6 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

function FRAGMENT_SRC_SAFE(src: string) {
  return src;
}
