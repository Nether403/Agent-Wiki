/**
 * @license Apache-2.0
 * @origin Machine-First Design Agent Wiki
 * W3C Design Tokens Community Group (DTCG) -> Tailwind v4 CSS Variables Compiler
 */

export interface DTCGTokenNode {
  $value?: string | number;
  $type?: string;
  $description?: string;
  [key: string]: any;
}

export interface DTCGCompileResult {
  cssVariables: string;
  tailwindThemeRules: string;
  tokensCount: number;
}

export function compileDTCGToTailwindV4(tokenTree: Record<string, DTCGTokenNode>): DTCGCompileResult {
  const cssVars: string[] = [];
  const themeTokens: string[] = [];
  let count = 0;

  function traverse(node: Record<string, any>, prefix: string[] = []) {
    for (const [key, val] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      if (val && typeof val === "object") {
        if ("$value" in val) {
          const varName = ["--", ...prefix, key].join("-");
          const rawValue = val.$value;
          cssVars.push(`  ${varName}: ${rawValue};`);
          themeTokens.push(`  --color-${[...prefix, key].join("-")}: var(${varName});`);
          count++;
        } else {
          traverse(val, [...prefix, key]);
        }
      }
    }
  }

  traverse(tokenTree);

  return {
    cssVariables: `:root {\n${cssVars.join("\n")}\n}`,
    tailwindThemeRules: `@theme {\n${themeTokens.join("\n")}\n}`,
    tokensCount: count,
  };
}
