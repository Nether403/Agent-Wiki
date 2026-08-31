---
name: cross-platform-token-synchronization
description: "Manage, export, and synchronize W3C DTCG design tokens across web (Tailwind v4 @theme), iOS (SwiftUI), Android (Jetpack Compose), and Figma with automated WCAG AA contrast gates."
risk: safe
source: "https://github.com/style-dictionary/style-dictionary"
date_added: "2026-08-31"
---

# Cross-Platform Token Synchronization Skill

This playbook guides agents through structuring and compiling enterprise design tokens into multi-platform deliverables using W3C DTCG (Design Tokens Community Group) standards and Style Dictionary v4 principles.

---

## 1. Single Source of Truth: W3C DTCG Format

All design tokens are defined in JSON using the standardized `$value` and `$type` schema:

```json
{
  "color": {
    "background": { "$value": "#09090b", "$type": "color" },
    "foreground": { "$value": "#fafafa", "$type": "color" },
    "primary": { "$value": "#10b981", "$type": "color" },
    "primaryForeground": { "$value": "#000000", "$type": "color" },
    "card": { "$value": "#18181b", "$type": "color" },
    "cardForeground": { "$value": "#fafafa", "$type": "color" },
    "border": { "$value": "#27272a", "$type": "color" }
  },
  "spacing": {
    "1": { "$value": "4px", "$type": "dimension" },
    "2": { "$value": "8px", "$type": "dimension" },
    "4": { "$value": "16px", "$type": "dimension" }
  }
}
```

---

## 2. Multi-Platform Export Targets

These platform targets are a Phase 4 playbook. There is no live MCP export tool; compile tokens with `pnpm build:tokens` (`packages/registry/tokens`).

1. **Tailwind CSS v4 (`@theme`)**:
   ```css
   @theme {
     --color-background: #09090b;
     --color-foreground: #fafafa;
     --color-primary: #10b981;
     --color-card: #18181b;
     --color-border: #27272a;
   }
   ```
2. **SwiftUI (iOS)**:
   ```swift
   import SwiftUI
   public struct DesignTokens {
       public static let background = Color(hex: "#09090b")
       public static let primary = Color(hex: "#10b981")
   }
   ```
3. **Jetpack Compose (Android)**:
   ```kotlin
   package dev.agentwiki.tokens
   import androidx.compose.ui.graphics.Color
   object DesignTokens {
       val Background = Color(0xFF09090B)
       val Primary = Color(0xFF10B981)
   }
   ```

---

## 3. Mandatory Contrast Gate

Every token set must pass WCAG 2.1 AA contrast validation (minimum 4.5:1 ratio for normal text) using `verify_accessibility_contrast` on foreground/background pairs, or a dedicated matrix checker when one exists.
