import fs from "fs";
import path from "path";

export interface TokenExportOptions {
  format?: string;
  outputPath?: string;
  cwd?: string;
}

const CANONICAL_TOKENS = {
  color: {
    background: "#09090b",
    foreground: "#fafafa",
    card: "#121215",
    border: "#27272a",
    primary: "#10b981",
    ring: "#10b981",
  },
  spacing: {
    "1": "4px",
    "2": "8px",
    "4": "16px",
    "8": "32px",
  },
  borderRadius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
};

export function exportMultiplatformTokens(targetFormat: string): string {
  switch (targetFormat) {
    case "tailwind-v4":
    case "tailwind":
      return `/* Auto-generated via Machine-First Style Dictionary v4 Exporter */
@theme {
  --color-background: ${CANONICAL_TOKENS.color.background};
  --color-foreground: ${CANONICAL_TOKENS.color.foreground};
  --color-card: ${CANONICAL_TOKENS.color.card};
  --color-border: ${CANONICAL_TOKENS.color.border};
  --color-primary: ${CANONICAL_TOKENS.color.primary};
  --color-ring: ${CANONICAL_TOKENS.color.ring};

  --radius-sm: ${CANONICAL_TOKENS.borderRadius.sm};
  --radius-md: ${CANONICAL_TOKENS.borderRadius.md};
  --radius-lg: ${CANONICAL_TOKENS.borderRadius.lg};
  --radius-xl: ${CANONICAL_TOKENS.borderRadius.xl};
}
`;
    case "css":
      return `/* Auto-generated via Machine-First Style Dictionary v4 Exporter */
:root {
  --background: #ffffff;
  --foreground: #09090b;
  --primary: ${CANONICAL_TOKENS.color.primary};
}
.dark {
  --background: ${CANONICAL_TOKENS.color.background};
  --foreground: ${CANONICAL_TOKENS.color.foreground};
  --card: ${CANONICAL_TOKENS.color.card};
  --border: ${CANONICAL_TOKENS.color.border};
  --primary: ${CANONICAL_TOKENS.color.primary};
}
`;
    case "swift":
    case "ios":
      return `// Auto-generated via Machine-First Style Dictionary v4 Exporter
import SwiftUI

public struct DesignTokens {
    public struct Colors {
        public static let background = Color(hex: "${CANONICAL_TOKENS.color.background}")
        public static let foreground = Color(hex: "${CANONICAL_TOKENS.color.foreground}")
        public static let card = Color(hex: "${CANONICAL_TOKENS.color.card}")
        public static let border = Color(hex: "${CANONICAL_TOKENS.color.border}")
        public static let primary = Color(hex: "${CANONICAL_TOKENS.color.primary}")
    }
}
`;
    case "compose":
    case "android":
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
}
`;
    case "figma":
    case "dtcg":
    case "tokens-studio":
      return JSON.stringify(
        {
          version: "1.0.0",
          description: "Machine-First Design Agent Wiki W3C DTCG Tokens for Figma",
          tokens: CANONICAL_TOKENS,
        },
        null,
        2
      );
    default:
      return exportMultiplatformTokens("tailwind-v4");
  }
}

export async function tokensCommand(options: TokenExportOptions = {}): Promise<void> {
  const format = options.format || "tailwind-v4";
  const cwd = path.resolve(options.cwd || process.cwd());

  console.log(`\n🎨 [Style Dictionary Exporter] Exporting W3C DTCG Design Tokens as: ${format}...`);

  const compiled = exportMultiplatformTokens(format);

  if (options.outputPath) {
    const destPath = path.resolve(cwd, options.outputPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, compiled, "utf-8");
    console.log(`✓ Tokens successfully written to: ${destPath}`);
  } else {
    console.log("\n----------------------------------------");
    console.log(compiled);
    console.log("----------------------------------------");
    console.log("Tip: Use --output <file> to write to disk, or --format <tailwind|css|swift|compose|figma> to change format.");
  }
}
