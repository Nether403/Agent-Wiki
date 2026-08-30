# Typography & Motion Discipline Rules

This document specifies the exact typographic scales, font pairings, and motion contracts required for all web interfaces in this repository.

---

## 1. Typographic Hierarchy & Pairing Rules

### The Tri-Tier Font System
Every interface must establish clear division between three typographic layers:

1. **Display & Section Titles (Editorial)**
   - Font Family: High-character Serif (e.g., `Playfair Display`, `Instrument Serif`, `Newsreader`) or Crisp Sans Display.
   - Tracking: `tracking-tight` (-0.02em to -0.04em).
   - Leading: Compact line heights (`leading-[1.1]` to `leading-[1.15]`).
   - Use Case: Page headers, hero punchlines, major milestones.

2. **Body & Interface Elements (Functional)**
   - Font Family: Neutral, highly legible Sans-Serif (e.g., `Inter`, `Geist`, `Plus Jakarta Sans`).
   - Sizing: Base text `text-sm` (14px) or `text-base` (16px) with generous line heights (`leading-relaxed` or `leading-normal`).
   - Weights: Strict adherence to `font-normal` (400) and `font-medium` (500). Avoid overuse of `font-bold` for body text.

3. **Metadata, Metrics & Code (Telemetry)**
   - Font Family: High-legibility Monospace (e.g., `JetBrains Mono`, `Geist Mono`).
   - Sizing: `text-xs` (12px) or `text-[13px]`.
   - Weights: `font-mono font-medium`.
   - Use Case: Timestamps, API status badges, git SHAs, numerical readouts, sparkline values.

---

## 2. Fluid Sizing & Spacing Matrix

Do not use arbitrary pixel values (e.g. `text-[19px]` or `mt-[13px]`). Adhere strictly to the Tailwind v4 modular scale:

| Token | Size | Line Height | Usage |
| :--- | :--- | :--- | :--- |
| `text-xs` | 0.75rem (12px) | 1rem (16px) | Badges, footnotes, monospace metadata |
| `text-sm` | 0.875rem (14px) | 1.25rem (20px) | Secondary labels, table cells, form help text |
| `text-base` | 1rem (16px) | 1.5rem (24px) | Standard body copy, inputs, button labels |
| `text-lg` | 1.125rem (18px) | 1.75rem (28px) | Card titles, intro leads, emphasized callouts |
| `text-xl` | 1.25rem (20px) | 1.75rem (28px) | Section subtitles, modal headers |
| `text-2xl` | 1.5rem (24px) | 2rem (32px) | Subheadings, KPI metric numbers |
| `text-4xl` | 2.25rem (36px) | 2.5rem (40px) | Standard section headers |
| `text-6xl` | 3.75rem (60px) | 1 | Hero punchlines (desktop) |

---

## 3. Motion & Animation Principles

### Spring Physics Over Linear Easing
All animated UI components should use damped spring physics rather than arbitrary linear or ease-in-out curves:
- **Stiffness**: 260–380 (crisp response)
- **Damping**: 24–32 (minimal to zero overshoot)
- **Mass**: 0.8–1.0

```tsx
// Compliant Spring Configuration
const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
  mass: 0.9,
};
```

### Motion Intensity Dial Alignment
- **Low (1–3)**: Only color and opacity transitions (`transition-colors duration-150`).
- **Medium (4–7)**: Spring-based layout entry (`motion.div` with layoutId and fade-up).
- **High (8–10)**: Canvas simulations, WebGL shaders, smooth-scroll Lenis orchestration.

### Accessibility Contract (WCAG 2.2.2 / 2.3.3)
Any component with active motion or canvas loops must incorporate:
```tsx
import { useReducedMotion } from "motion/react";

export function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
    />
  );
}
```
