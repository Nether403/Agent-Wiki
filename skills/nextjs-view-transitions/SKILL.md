---
name: nextjs-view-transitions
description: "Best practices for React 19 View Transitions, Server Component composition patterns, and zero-layout-shift routing in Next.js 15."
version: 1.0.0
category: react-architecture
---

# Next.js 15 & React 19 View Transitions Skill

Inspired by Vercel Agent Skills, this playbook guides agents in implementing performant, accessible page transitions and Server/Client Component composition boundaries.

---

## 1. Composition Rules for React 19 & Next.js 15

1. **Server-First by Default**: Keep pages and layout wrappers as React Server Components (RSC) unless interactive state or client hooks (`useState`, `useEffect`, `motion`) are strictly required.
2. **Push Client Boundaries to the Leaves**: Wrap individual interactive widgets in `'use client'` files rather than slapping `'use client'` on top-level pages.
3. **Deterministic Suspense Fallbacks**: Always provide accessible skeletons (`skeleton.tsx`) for streaming data boundaries.

---

## 2. React 19 View Transitions Pattern

When animating route changes:
1. Use native CSS View Transitions API wrapped in React 19 `startTransition` or Next.js link wrappers.
2. Map transition names cleanly with `view-transition-name: element-id`.
3. Provide an instant fallback for browsers without View Transitions support or when `prefers-reduced-motion` is active.

```tsx
// Example View Transition Morph pattern:
import { useTransition } from "react";

export function MorphingNavigationLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();

  return (
    <a
      href={href}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
      onClick={(e) => {
        if (!document.startViewTransition) return;
        e.preventDefault();
        document.startViewTransition(() => {
          startTransition(() => {
            window.location.href = href;
          });
        });
      }}
    >
      {children}
    </a>
  );
}
```

---

## 3. Anti-Slop Check for Next.js 15

- Reject `transition-all duration-300` on top-level layout containers.
- Enforce `min-h-[100dvh]` instead of rigid `h-screen`.
- Clean up any route change listeners in `useEffect`.
