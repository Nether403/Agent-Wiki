---
name: video-to-ui-prompt-extraction
description: "Deconstruct screen recording videos, GIFs, and interaction captures into precise motion/react spring configurations, keyframe curves, and zero-slop TSX implementations."
risk: safe
source: "https://github.com/MengTo/Skills"
date_added: "2026-08-31"
---

# Video-to-UI Interaction Deconstruction Skill

This playbook provides AI agents with a systematic engineering workflow for analyzing screen recording videos (MP4/WebM/GIF) or frame-by-frame captures of web interactions, extracting their underlying motion physics, and synthesizing production-ready `motion/react` components.

---

## 1. The Interaction Deconstruction Loop

When a user provides a video reference or describes a screen interaction:

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  1. Temporal Framing   │ ───► │  2. Physics Extraction │ ───► │  3. Layout Synthesis   │
│ - Initial/Rest State   │      │ - Spring Stiffness/Damp│      │ - motion/react TSX     │
│ - Trigger Event        │      │ - Easing & Duration    │      │ - LayoutId & Animate   │
│ - Apex & Exit Motion   │      │ - Mass & Velocity      │      │ - Reduced Motion Guard │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

---

## 2. Spring Physics Parameter Calibration

Map visual observations to numeric spring configurations:

| Visual Characteristic | Estimated Spring Type | `stiffness` | `damping` | `mass` |
| :--- | :--- | :--- | :--- | :--- |
| **Snappy / Crisp UI** (Tabs, dropdowns) | Fast Spring | `300 - 400` | `25 - 30` | `0.8 - 1.0` |
| **Bouncy / Playful** (Badges, icons) | High-Bounce Spring | `400 - 500` | `15 - 20` | `1.0` |
| **Gentle / Spatial** (Drawers, dialogs) | Damped Spring | `200 - 260` | `24 - 28` | `1.0 - 1.2` |
| **Heavy / Stately** (Hero reveals) | Smooth Ease | `duration: 0.6s`, `ease: [0.16, 1, 0.3, 1]` |

---

## 3. Code Generation Rules

1. **Always Target `motion/react`**: Use modern React 19 imports:
   ```tsx
   import { motion, AnimatePresence, useSpring } from "motion/react";
   ```
2. **Enforce `prefers-reduced-motion`**:
   Wrap spring animations with CSS fallbacks or motion variants that collapse transitions when reduced motion is detected:
   ```tsx
   const transition = {
     type: "spring",
     stiffness: 300,
     damping: 25,
   };
   ```
3. **Prevent Layout Jitter**:
   Use `layout` and `layoutId` for smooth geometric morphing rather than animating raw height/width values directly in CSS.
4. **Anti-Slop Audit**: Ensure generated component passes the 50 anti-slop rules (no `#6366f1`, no arbitrary pixel hacks).
