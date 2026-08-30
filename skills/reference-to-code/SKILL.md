---
name: "reference-to-code"
description: "Deconstructs visual design references (video recordings, Figma frames, screenshot images) into structured component specifications."
version: "1.0.0"
freshness: "2026-08-30"
dials:
  DESIGN_VARIANCE: 6
  MOTION_INTENSITY: 5
  VISUAL_DENSITY: 6
---

# Reference-to-Code Reverse Engineering Playbook
*Adapted from MengTo/Skills and Screenshot-to-Code for the Machine-First Design Agent Wiki.*

This skill guides AI agents in systematically converting visual references (video recordings, prototypes, UI mockups) into clean, production-ready TSX components.

---

## 1. Visual Deconstruction Methodology

When presented with an image or video reference:

```
[Visual Reference] ──> [1. Spatial Layout Grid] ──> [2. Token Extraction] ──> [3. Interaction Timeline] ──> [4. Registry Mapping]
```

1. **Spatial Layout Grid**:
   - Determine layout constraints (container width, column structure, flex alignment).
   - Identify visual anchors (sticky navigation, asymmetrical hero blocks, floating docks).

2. **Token Extraction**:
   - Extract primary, neutral, and accent colors. Map them to semantic tokens (`bg-background`, `text-foreground`, `border-border`).
   - Extract typographic scales and line heights.
   - Measure border radius, shadows, and spacing steps.

3. **Interaction & Motion Decomposition**:
   - For video or animated references: identify initial, hover, active, and exit states.
   - Determine spring dynamics (stiffness, damping, duration).

4. **Component Registry Mapping**:
   - Never build from zero if an audited component exists.
   - Map canvas elements to `packages/registry/src/creative/` or `workflow/`.
   - Map controls to `packages/registry/src/primitives/`.

---

## 2. Interaction Extraction CLI
Agents can run `node skills/reference-to-code/scripts/extract-interaction.js` to parse interaction parameters.
