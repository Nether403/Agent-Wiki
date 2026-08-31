---
name: video-to-design
description: "Deconstructs video references, screen recordings, and live web animations into structured UI prompts, motion curves, and zero-slop component specifications."
version: 1.0.0
category: interaction-design
---

# Video & Reference-to-Design Deconstruction Skill

Inspired by the MengTo/Skills workflow, this skill guides AI developer agents in converting visual inspirations, motion recordings, and live website captures into reproducible, zero-slop component implementations.

---

## 1. Video & Motion Deconstruction Protocol

When a user provides a video description, screen recording timestamps, or dynamic interaction reference:

### Step 1: Temporal Segmentation
Divide the interaction into 4 discrete animation phases:
1. **Entry Trigger**: Hover, scroll intersect, click, or component mount.
2. **Kinetic Interpolation**: Spring physics parameters (stiffness, damping, mass) or CSS bezier curve (`cubic-bezier(0.16, 1, 0.3, 1)`).
3. **Resting State**: High-contrast, WCAG AA verified surface with crisp border tokens.
4. **Exit Transition**: Symmetrical or accelerated dismissal with unmounted memory cleanup.

### Step 2: Component Architecture Extraction
Map the visual elements to existing zero-slop registry items:
- Header / Navigation $\rightarrow$ `navbar-sticky` or `floating-dock`
- Interactive Hero Moment $\rightarrow$ `google-gemini-glow-hero` or `hero-parallax-scroll`
- Content Cards $\rightarrow$ `bento-spotlight-card` or `tilt-card`
- Dynamic Dialogs $\rightarrow$ `spring-dialog` or `morphing-dialog`
- Whiteboard / Graph $\rightarrow$ `infinite-canvas-whiteboard` or `agent-node-graph`

### Step 3: Motion Budget & Accessibility Fallback
- Check `prefers-reduced-motion: reduce` in all animations.
- Prevent layout shifts by animating `transform` and `opacity` exclusively instead of `height` or `width`.
- Ensure zero uncancelled `requestAnimationFrame` or `setInterval` listeners in `useEffect`.

---

## 2. Prompt Synthesis Output Format

When generating an interaction prompt for downstream subagents or coding tools, output structured YAML:

```yaml
interaction_signature:
  name: "interactive-feature-cycler"
  entry_trigger: "interval-timer-or-click"
  spring_profile:
    stiffness: 260
    damping: 20
    mass: 1
  a11y_fallback:
    reduced_motion: "instant-opacity-crossfade"
    aria_live: "polite"
  matched_registry_slugs:
    - "interactive-feature-cycler"
    - "progress-wizard-stepper"
```
