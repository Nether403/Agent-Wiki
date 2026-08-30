---
name: "interface-craft-micro-typography"
description: "Precision typography, optical kerning, baseline alignment, tabular figures, and typographic contrast for developer agents."
version: "1.0.0"
freshness: "2026-08-31"
dials:
  DESIGN_VARIANCE: 5
  MOTION_INTENSITY: 2
  VISUAL_DENSITY: 7
---

# Interface Craft & Micro-Typography Playbook
*Synthesized from Jakub Krehel Interface Skills, Julian Oczkowski Designer Skills, and Style Dictionary.*

Typography is the structural skeleton of web interfaces. Generic AI outputs frequently suffer from un-proportional line heights, lack of tabular numeral alignment in metrics tables, and severe contrast collapse in secondary text.

---

## 1. Core Typographic Tokens & Rules

### Rule 1: Tabular Figures for All Numerical Data
Always apply `font-mono` or `tabular-nums` (`font-variant-numeric: tabular-nums`) to financial figures, timestamp counters, latency metrics, and countdowns. This prevents jitter and column misalignments during real-time updates.

```tsx
// ❌ Slop: Proportional digits causing layout jitter on tick
<span className="text-xl font-bold">{counter}</span>

// ✅ Zero-Slop: Stable tabular digits
<span className="text-xl font-bold font-mono tracking-tight tabular-nums">{counter}</span>
```

### Rule 2: Tracking & Kerning Discipline by Font Size
- **Large Display Titles (`text-3xl` to `text-6xl`)**: Apply `tracking-tight` or `-tracking-[0.02em]` to maintain visual cohesion and optical weight.
- **Microcopy / Uppercase Badges (`text-[10px]` to `text-xs`)**: Apply `uppercase tracking-wider` or `tracking-widest` to ensure letterform legibility.
- **Body Copy (`text-sm` to `text-base`)**: Keep default tracking with relaxed line height (`leading-relaxed`).

### Rule 3: Optical Hierarchy & Muted Text Contrast
Never drop secondary copy below WCAG 2.1 AA (4.5:1 on light mode, 4.5:1 on dark mode):
- Primary Headings: `text-foreground` (minimum 12:1)
- Subtitles & Descriptions: `text-muted-foreground` (verified 5.2:1 against `bg-card`)
- Code and Metadata Pills: `font-mono text-xs text-primary/90 bg-primary/10`

---

## 2. Typographic Scale Matrix

| Semantic Role | Tailwind Classes | Line Height | Tracking | Recommended Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title** | `text-3xl sm:text-4xl font-extrabold` | `leading-tight` | `tracking-tight` | Hero headlines, landing section titles |
| **Section Header** | `text-xl sm:text-2xl font-bold` | `leading-snug` | `tracking-tight` | Card section titles, modal headers |
| **Card Title** | `text-base font-semibold` | `leading-normal` | `tracking-normal` | Bento grid titles, sidebar group headers |
| **Body Copy** | `text-sm font-normal` | `leading-relaxed` | `tracking-normal` | Paragraph descriptions, documentation prose |
| **Metadata / Stat** | `text-xs font-mono font-medium` | `leading-none` | `tabular-nums` | Timestamps, stock numbers, latency gauges |
| **Micro Badge** | `text-[10px] font-bold uppercase` | `leading-none` | `tracking-widest` | Status indicators, tier tags, version pills |
