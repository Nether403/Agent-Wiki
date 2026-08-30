---
name: "vercel-composition"
description: "React 19, Next.js 15, and modern composition architecture patterns from Vercel Labs for high-performance frontend engineering."
version: "1.0.0"
freshness: "2026-08-30"
dials:
  DESIGN_VARIANCE: 5
  MOTION_INTENSITY: 3
  VISUAL_DENSITY: 6
---

# Vercel Composition & React 19 Playbook
*Adapted from vercel-labs/agent-skills for the Machine-First Design Agent Wiki.*

This skill guides agents in writing clean, idiomatic React 19 and Next.js 15 code that minimizes bundle size, leverages native server boundaries, and ensures fluid client interactions.

---

## 1. Core React 19 Architectural Principles

### 1. Push Client Boundaries Down
- Keep the majority of your page tree as **React Server Components (RSC)**.
- Only mark components with `"use client"` when they require:
  - Event handlers (`onClick`, `onChange`, `onSubmit`)
  - React hooks (`useState`, `useEffect`, `useReducer`, `useRef`)
  - Browser-only APIs (`window`, `localStorage`, `HTMLCanvasElement`)
  - Animation libraries (`motion/react`)

### 2. Native Ref Support (No `forwardRef`)
In React 19, `ref` is a standard prop. Never wrap components in `React.forwardRef`:
```tsx
// ✅ Correct (React 19)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ ref, variant = "primary", className, ...props }: ButtonProps) {
  return <button ref={ref} className={className} {...props} />;
}
```

### 3. Server Actions & Optimistic UI
Use React 19's native `useActionState` and `useOptimistic` for form interactions:
- Avoid writing manual `isSubmitting` / `isPending` state handling with `useState`.
- Let Server Actions handle mutations directly with automatic server revalidation.

---

## 2. View Transitions API
Use the native document `startViewTransition` API for seamless theme switching and tab switches:
```tsx
export function toggleTheme(newTheme: "light" | "dark") {
  if (!document.startViewTransition) {
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    return;
  }

  document.startViewTransition(() => {
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  });
}
```

---

## 3. Hydration Discipline
- Never access browser globals (`window`, `document`, `navigator`) during initial render.
- Use `useEffect` or safe hooks for client-only dimensions to eliminate hydration mismatches.
