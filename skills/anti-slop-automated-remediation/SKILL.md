---
name: anti-slop-automated-remediation
description: "AST-level code refactoring recipes, unslop transformation codemods, and automated remediation against the 50 anti-slop rules."
risk: safe
source: "https://github.com/aahil62/unslop"
date_added: "2026-08-31"
---

# Anti-Slop Automated Remediation Skill

This skill records regex remaps used by `unslopCode` in `@design-wiki/audit-linter`. Scores are re-measured after remap; 100/100 is not assumed.

---

## 1. Automated Slop Remapping Recipes

| Anti-Pattern Violation | Automated Transformation Recipe | Anti-Slop Rule |
| :--- | :--- | :--- |
| `bg-indigo-600` / `#4f46e5` | Remap to `bg-primary text-primary-foreground` semantic token | **SLOP-001** |
| `from-purple-500 to-blue-500` | Replace with solid `bg-card` surface and `border-border` | **SLOP-002** |
| `p-[17px]`, `m-[13px]`, `gap-[15px]` | Convert to nearest standard step (`p-4`, `m-3`, `gap-4`) | **SLOP-007** |
| `as unknown as Type` | Extract typed interface and add type guard function | **SLOP-004** |
| `<button><Icon /></button>` | Add `aria-label="Action Name"` or `<span className="sr-only">` | **SLOP-010** |
| `outline-none` | Replace with `:focus-visible:ring-2 :focus-visible:ring-ring` | **SLOP-012** |
| `bg-white` / `bg-black` | Replace with semantic `bg-card` and dark mode variants | **SLOP-021** |
| `h-screen` | Remap to `min-h-[100dvh]` for mobile address bar safety | **SLOP-038** |
| `// TODO: add logic` | Implement complete, fully functional copy-pasteable logic | **SLOP-009** |

---

## 2. CLI Unslop Execution

Agents can run the native unslop engine directly:

```bash
# Auto-remediate a single file with Neo-Tokyo aesthetic theme
npx design-wiki unslop ./components/ui/hero.tsx --theme neo-tokyo

# Preview unslop transformations across a whole directory
npx design-wiki unslop ./components/ui --theme midnight --dry-run
```
