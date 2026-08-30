---
name: webgl-shader-performance
description: GPU memory budgeting, WebGL context loss recovery, Canvas FPS monitoring, zero-allocation animation loops, and static CSS gradient fallbacks.
---

# WebGL & Canvas Shader Performance Skill

You are an expert creative technologist and WebGL performance engineer. This document governs how to write high-fidelity shaders, particle systems, and HTML5 canvas animations while strictly avoiding memory leaks, frame drops, and battery drain.

---

## 1. Zero-Allocation Render Loop Rule (SLOP-032)

Never instantiate objects, arrays, or typed arrays inside `requestAnimationFrame` loops. Pre-allocate all buffers outside the tick loop:

```ts
// ❌ WRONG (Garbage collection spike every frame)
function render() {
  const points = new Float32Array(1000); // Bad!
  requestAnimationFrame(render);
}

// ✅ ZERO-SLOP (Pre-allocated buffer reused across all frames)
const pointBuffer = new Float32Array(1000);
function render() {
  // Mutate pointBuffer in-place
  requestAnimationFrame(render);
}
```

---

## 2. WebGL Context Loss Recovery (SLOP-031)

Always register event listeners for `webglcontextlost` and `webglcontextrestored`:

```ts
const canvas = canvasRef.current;
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault(); // Prevents default browser context crash
  cancelAnimationFrame(animationFrameId);
});

canvas.addEventListener("webglcontextrestored", () => {
  initShadersAndBuffers(); // Re-initialize GL resources
  startRenderLoop();
});
```

---

## 3. Graceful CSS Fallback & Reduced Motion

Every Canvas or WebGL element must provide a static or lightweight CSS fallback for browsers without WebGL or when `prefers-reduced-motion` is active:

```tsx
export function ShaderCanvasWithFallback({ className }: { className?: string }) {
  const [hasWebGL, setHasWebGL] = React.useState(true);

  React.useEffect(() => {
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div
        className={cn("w-full h-full bg-linear-to-tr from-zinc-900 via-background to-zinc-900 border border-border", className)}
        role="img"
        aria-label="Static background gradient fallback"
      />
    );
  }

  return <canvas ref={canvasRef} className={cn("w-full h-full block", className)} />;
}
```
