/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Module: Style Dictionary v4 & W3C DTCG Token Exporter
 */

import fs from "fs";
import path from "path";

export interface DesignTokenValue {
  $value: string;
  $type: "color" | "dimension" | "duration" | "cubicBezier" | "number";
  $description?: string;
}

export interface DesignTokenDictionary {
  color: Record<string, Record<string, DesignTokenValue>>;
  spacing: Record<string, DesignTokenValue>;
  borderRadius: Record<string, DesignTokenValue>;
  motion: Record<string, DesignTokenValue>;
}

export const CANONICAL_DESIGN_TOKENS: DesignTokenDictionary = {
  color: {
    background: {
      default: { $value: "#09090b", $type: "color", $description: "Default background surface (zinc-950)" },
      subtle: { $value: "#18181b", $type: "color", $description: "Secondary background surface (zinc-900)" },
    },
    foreground: {
      default: { $value: "#fafafa", $type: "color", $description: "Primary text and icons (zinc-50)" },
      muted: { $value: "#a1a1aa", $type: "color", $description: "Secondary muted text (zinc-400)" },
    },
    card: {
      default: { $value: "#121215", $type: "color", $description: "Card elevated surface" },
      foreground: { $value: "#fafafa", $type: "color", $description: "Card foreground text" },
    },
    border: {
      default: { $value: "#27272a", $type: "color", $description: "Structural divider and card borders (zinc-800)" },
      focus: { $value: "#10b981", $type: "color", $description: "Accessible focus ring token (emerald-500)" },
    },
    primary: {
      default: { $value: "#10b981", $type: "color", $description: "Brand accent emerald-500" },
      foreground: { $value: "#000000", $type: "color", $description: "Primary action text (high contrast AA)" },
    },
  },
  spacing: {
    "1": { $value: "4px", $type: "dimension" },
    "2": { $value: "8px", $type: "dimension" },
    "3": { $value: "12px", $type: "dimension" },
    "4": { $value: "16px", $type: "dimension" },
    "6": { $value: "24px", $type: "dimension" },
    "8": { $value: "32px", $type: "dimension" },
    "12": { $value: "48px", $type: "dimension" },
    "16": { $value: "64px", $type: "dimension" },
  },
  borderRadius: {
    sm: { $value: "6px", $type: "dimension" },
    md: { $value: "8px", $type: "dimension" },
    lg: { $value: "12px", $type: "dimension" },
    xl: { $value: "16px", $type: "dimension" },
    full: { $value: "9999px", $type: "dimension" },
  },
  motion: {
    fast: { $value: "150ms", $type: "duration" },
    normal: { $value: "250ms", $type: "duration" },
    slow: { $value: "400ms", $type: "duration" },
  },
};

/**
 * Compiles canonical tokens to standard Tailwind CSS v4 @theme block
 */
export function compileToTailwindV4Theme(): string {
  return `/* Auto-generated via Machine-First Style Dictionary v4 Exporter */
@theme {
  --color-background: ${CANONICAL_DESIGN_TOKENS.color.background.default.$value};
  --color-foreground: ${CANONICAL_DESIGN_TOKENS.color.foreground.default.$value};
  --color-card: ${CANONICAL_DESIGN_TOKENS.color.card.default.$value};
  --color-card-foreground: ${CANONICAL_DESIGN_TOKENS.color.card.foreground.$value};
  --color-border: ${CANONICAL_DESIGN_TOKENS.color.border.default.$value};
  --color-primary: ${CANONICAL_DESIGN_TOKENS.color.primary.default.$value};
  --color-primary-foreground: ${CANONICAL_DESIGN_TOKENS.color.primary.foreground.$value};
  --color-muted: ${CANONICAL_DESIGN_TOKENS.color.background.subtle.$value};
  --color-muted-foreground: ${CANONICAL_DESIGN_TOKENS.color.foreground.muted.$value};
  --color-ring: ${CANONICAL_DESIGN_TOKENS.color.border.focus.$value};

  --radius-sm: ${CANONICAL_DESIGN_TOKENS.borderRadius.sm.$value};
  --radius-md: ${CANONICAL_DESIGN_TOKENS.borderRadius.md.$value};
  --radius-lg: ${CANONICAL_DESIGN_TOKENS.borderRadius.lg.$value};
  --radius-xl: ${CANONICAL_DESIGN_TOKENS.borderRadius.xl.$value};
}
`;
}

/**
 * Compiles canonical tokens to iOS Swift Struct
 */
export function compileToSwiftTokens(): string {
  return `// Auto-generated via Machine-First Style Dictionary v4 Exporter
import SwiftUI

public struct DesignTokens {
    public struct Colors {
        public static let background = Color(hex: "${CANONICAL_DESIGN_TOKENS.color.background.default.$value}")
        public static let foreground = Color(hex: "${CANONICAL_DESIGN_TOKENS.color.foreground.default.$value}")
        public static let card = Color(hex: "${CANONICAL_DESIGN_TOKENS.color.card.default.$value}")
        public static let border = Color(hex: "${CANONICAL_DESIGN_TOKENS.color.border.default.$value}")
        public static let primary = Color(hex: "${CANONICAL_DESIGN_TOKENS.color.primary.default.$value}")
    }
    public struct Spacing {
        public static let step1: CGFloat = 4
        public static let step2: CGFloat = 8
        public static let step4: CGFloat = 16
        public static let step8: CGFloat = 32
    }
}
`;
}

/**
 * Compiles canonical tokens to Android Jetpack Compose Kotlin object
 */
export function compileToComposeTokens(): string {
  return `// Auto-generated via Machine-First Style Dictionary v4 Exporter
package dev.agentwiki.tokens

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

object DesignTokens {
    object Colors {
        val Background = Color(0xFF09090B)
        val Foreground = Color(0xFFFAFAFA)
        val Card = Color(0xFF121215)
        val Border = Color(0xFF27272A)
        val Primary = Color(0xFF10B981)
    }
    object Spacing {
        val Step1 = 4.dp
        val Step2 = 8.dp
        val Step4 = 16.dp
        val Step8 = 32.dp
    }
}
`;
}
