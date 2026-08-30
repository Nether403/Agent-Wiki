---
name: "visual-reference-deconstruction"
description: "Deconstructs screenshots, video recordings, Figma frames, and HTML snippets into clean, zero-slop component trees and semantic design tokens."
version: "1.0.0"
freshness: "2026-08-31"
dials:
  DESIGN_VARIANCE: 7
  MOTION_INTENSITY: 5
  VISUAL_DENSITY: 6
---

# Visual Reference Deconstruction Skill
*Synthesized from MengTo/Skills, Screenshot-to-Code, and Machine-First Design Systems.*

When translating visual references (screenshots, screen recordings, video mockups, or raw vision model outputs) into code, developer agents must never blindly copy un-tokenized HTML or hallucinate arbitrary pixel sizes. Instead, execute the **4-Step Reverse Engineering Loop**:

---

## 1. The 4-Step Reverse Engineering Loop

```
┌───────────────────────────┐      ┌───────────────────────────┐
│   1. Optical Scanning     │ ───► │  2. Token Normalization   │
│ (Landmarks, Hierarchy)    │      │ (Color, Spacing, Surface) │
└───────────────────────────┘      └───────────────────────────┘
              │                                  │
              ▼                                  ▼
┌───────────────────────────┐      ┌───────────────────────────┐
│   3. Primitive Mapping    │ ───► │   4. Anti-Slop Gateway    │
│ (Match to Agent Wiki Slugs)│     │  (SPDX, WCAG AA, Types)   │
└───────────────────────────┘      └───────────────────────────┘
```

### Step 1: Optical Scanning (Spatial Blueprinting)
- **Identify Major Landmarks**: Break reference into `<header role="banner">`, `<main>`, `<aside>`, `<nav>`, `<footer role="contentinfo">`.
- **Rhythm Extraction**: Identify the layout archetype (`bento-grid`, `split-pane`, `app-shell-sidebar`, `masonry`).

### Step 2: Token Normalization
- **Color Remapping**: Never transcribe hex values like `#4f46e5` or `#6366f1`. Map directly to semantic tokens: `bg-primary`, `text-primary-foreground`, `bg-card`, `border-border`.
- **Spacing Quantization**: Round arbitrary pixel distances (`17px`, `23px`, `31px`) to standard 4px/8px Tailwind steps (`p-4`, `gap-6`, `py-8`).

### Step 3: Primitive Mapping (No Re-invention)
Always query `@design-wiki/mcp` `semantic_search_components` to match observed elements with audited primitives:
- Modal Dialog / Popover ➔ `dialog`, `command-menu`
- Segmented Tablist ➔ `segmented-control-slider`, `roving-tab-list`
- Notification Toast ➔ `toast-notification-center`
- Interactive Graph ➔ `xyflow`, `agent-node-graph`
- Shader / Dither Card ➔ `halftone-matrix-card`, `paper-shaders`

### Step 4: Anti-Slop Gateway
- Inject explicit TypeScript prop interfaces.
- Guarantee WCAG 2.1 AA contrast ratio (4.5:1 for normal text).
- Add `prefers-reduced-motion` checks to any requestAnimationFrame loops.
- Guarantee `min-h-[100dvh]` dynamic viewport sizing.

---

## 2. Reference Translation Examples

| Observed Visual Pattern | Anti-Pattern AI Instinct | Correct Zero-Slop Implementation |
| :--- | :--- | :--- |
| Floating nav dock with icon bounce | `div style={{ left: 100 }}` + raw keyframes | `<FloatingDock items={...} />` (`ui:motion`) |
| Glowing laser border hero card | `bg-gradient-to-r from-purple-500 to-blue-500` | `<BentoSpotlightCard>` or `<GlowBorder>` |
| Multi-step setup form | Sequential unstyled `div`s with `TODO` | `<ProgressWizardStepper>` (`ui:primitive`) |
| Real-time inventory table | Un-paginated `<table>` with emoji status | `<ResourceInventoryList>` (`ui:editorial`) |
