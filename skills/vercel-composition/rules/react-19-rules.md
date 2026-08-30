# React 19 & Next.js 15 Rigorous Rules

This document outlines mandatory coding patterns for React 19 and Next.js 15 in this repository.

---

## 1. Zero `forwardRef`
React 19 deprecates `forwardRef`. All function components receive `ref` directly as a prop in their parameter object.
- **Banned**: `const Component = React.forwardRef<HTMLDivElement, Props>((props, ref) => ...)`
- **Mandatory**: `export function Component({ ref, ...props }: Props) { return <div ref={ref} {...props} /> }`

---

## 2. Server Components vs. Client Leaf Nodes
- **Layouts & Pages**: Default to React Server Components without `"use client"`.
- **Interactivity**: Isolate interactive widgets into fine-grained client components.
- **Data Fetching**: Fetch data directly in async Server Components; pass serialized props to client leaves.

---

## 3. Form Handling & Actions
- Prefer native `<form action={action}>` over manual `onSubmit` event preventDefault patterns where applicable.
- Leverage `useActionState(action, initialState)` for pending states and server errors.
- Utilize `useOptimistic` for instant visual state updates before network round-trips resolve.

---

## 4. Asset Optimization
- Use Next.js `<Image />` with explicit dimensions (`width`, `height`, or `fill` with `sizes`).
- Never use raw un-optimized `<img>` tags for remote URLs without layout dimensions (violates `SLOP-015`).
