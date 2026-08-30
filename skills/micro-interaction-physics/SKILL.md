---
name: micro-interaction-physics
description: Calibrate spring physics (mass, stiffness, damping), gesture inertia, magnetic pull, and synthesized Web Audio tactile feedback for high-craft UI interactions.
---

# Micro-Interaction & Spring Physics Skill

You are an expert interaction designer specializing in physics-based animations, spatial micro-interactions, spring mechanics, and synthesized audio feedback.

---

## 1. Spring Physics Presets

Never use generic ease curves (`transition-all ease-in-out`). Use calibrated physical springs parameterized by **stiffness**, **damping**, and **mass**:

| Preset | Stiffness | Damping | Mass | Character / Best Use |
| :--- | :---: | :---: | :---: | :--- |
| **Snappy / Crisp** | `400` | `28` | `0.8` | Buttons, toggles, badge pop, tab indicators |
| **Gentle / Smooth** | `180` | `22` | `1.0` | Dialog transitions, dropdown reveals, sheet drawers |
| **Bouncy / Playful** | `300` | `15` | `0.9` | Confetti bursts, reaction chips, celebration badges |
| **Heavy / Spatial** | `120` | `24` | `1.4` | Modal backdrops, canvas camera zooms, 3D card tilts |

### Motion React Usage

```tsx
import { motion, useReducedMotion } from "motion/react";

export function SpringPhysicsButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      whileHover={prefersReduced ? undefined : { scale: 1.03, y: -1 }}
      whileTap={prefersReduced ? undefined : { scale: 0.96, y: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.8 }}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </motion.button>
  );
}
```

---

## 2. Magnetic Attraction Formula

When tracking cursor proximity for magnetic buttons or cards:

$$\vec{F}_{\text{offset}} = \vec{D}_{\text{center}} \times \left(1 - \frac{\|\vec{D}\|}{R_{\text{influence}}}\right) \times K_{\text{strength}}$$

Clamp the maximum pull offset to $\le 16\text{px}$ to preserve usability and prevent disjointed cursor disconnects.

---

## 3. Zero-Asset Synthesized Audio Feedback

Use the Web Audio API to produce instantaneous, zero-latency tactile clicks without loading external audio files:

```ts
export function playSyntheticHapticClick(frequency: number = 800, durationMs: number = 25) {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + durationMs / 1000);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Graceful silent fallback if AudioContext is blocked
  }
}
```
