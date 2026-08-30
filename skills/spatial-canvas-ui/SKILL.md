---
name: "spatial-canvas-ui"
description: "Architecture, memory safety, and interaction standards for infinite canvas viewports, node workflows, and WebGL overlays."
version: "1.0.0"
freshness: "2026-08-30"
dials:
  DESIGN_VARIANCE: 7
  MOTION_INTENSITY: 6
  VISUAL_DENSITY: 7
---

# Spatial Canvas & Node Workflow Architecture Playbook
*Synthesized from XY Flow, ThreeUI, and Excalidraw for autonomous agent engineering.*

Spatial interfaces, infinite whiteboards, and node-based agent graphs require specialized constraints to avoid frame drops, unbounded heap allocations, and broken touch interactions.

---

## 1. Core Architecture Principles

1. **Decouple Viewport State from Node Render Tree**:
   - Pan/zoom coordinates (`x`, `y`, `zoom`) must reside in an optimized transform context or CSS matrix rather than triggering full React re-renders on all children.
2. **Memory Safety in Render Loops (SLOP-032)**:
   - Never allocate objects (`new Array()`, `new Float32Array()`, `new Path2D()`) inside `requestAnimationFrame` loops.
   - Pre-allocate scratch vectors, typed arrays, and buffers outside the loop lifecycle.
3. **Cubic Bezier Routing with Cubic Splines**:
   - Connection wires between nodes must use smooth cubic bezier curves (`M startX startY C cp1x cp1y, cp2x cp2y, endX endY`).
   - Use `agent-node-wire-pulse` for live execution feedback.
4. **Accessible Keyboard Panning & Semantic Landmarks**:
   - Provide an off-canvas accessible tree representation (`role="tree"` or `role="region"`) so screen readers can navigate nodes without canvas coordinates.

---

## 2. Memory-Safe Animation Frame Pattern

```typescript
// ✅ Good: Zero-allocation loop
const positionBuffer = new Float32Array(nodeCount * 2);

useEffect(() => {
  let frameId: number;

  const loop = (timestamp: number) => {
    // Read and update pre-allocated typed buffer directly
    renderCanvas(ctx, positionBuffer);
    frameId = requestAnimationFrame(loop);
  };

  frameId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(frameId); // Cleaned up (SLOP-025)
}, [nodeCount]);
```

---

## 3. Node Graph Component Recipe
- **Canvas Base**: Fullscreen container with `touch-action: none` and `user-select: none`.
- **Minimap Overlay**: Fixed bottom-right corner showing scaled bounding box of active nodes.
- **Node Component**: Focus-navigable card with input and output port anchors.
- **Connection Spline**: Responsive SVG overlay with SVG gradient glow pulses.
