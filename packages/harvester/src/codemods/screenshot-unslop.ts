/**
 * @license MIT
 * @origin Machine-First Design Agent Wiki
 * Screenshot-to-Code AST / Regex Normalization Codemod
 */

export interface UnslopTransformationReceipt {
  originalLength: number;
  transformedLength: number;
  fixesApplied: string[];
  tokensRemapped: number;
  a11yLabelsInjected: number;
}

export function unslopScreenshotCode(rawCode: string): { code: string; receipt: UnslopTransformationReceipt } {
  let code = rawCode;
  const fixes: string[] = [];
  let tokenCount = 0;
  let a11yCount = 0;

  // 1. Remap hardcoded indigo buttons to semantic primary tokens (SLOP-001)
  if (/(?:bg-indigo-(?:500|600|700)|text-indigo-(?:500|600)|#4f46e5|#6366f1)/i.test(code)) {
    code = code.replace(/bg-indigo-(?:500|600|700)/g, "bg-primary");
    code = code.replace(/text-indigo-(?:500|600)/g, "text-primary");
    code = code.replace(/(?:#4f46e5|#6366f1)/g, "var(--primary)");
    fixes.push("SLOP-001: Remapped hardcoded indigo colors to semantic tokens (bg-primary, text-primary)");
    tokenCount++;
  }

  // 2. Remap purple-to-blue linear gradients to subtle card surface (SLOP-002)
  if (/bg-gradient-to-[r|tr|tl|b]\s+from-(?:purple|fuchsia)-500\s+to-blue-500/i.test(code)) {
    code = code.replace(
      /bg-gradient-to-[r|tr|tl|b]\s+from-(?:purple|fuchsia)-500\s+to-blue-500/g,
      "bg-card border border-border"
    );
    fixes.push("SLOP-002: Eliminated generic purple-blue linear gradient; applied structured card border");
    tokenCount++;
  }

  // 3. Remap arbitrary pixel spacing escapes p-[17px] -> p-4 (SLOP-007)
  code = code.replace(/(p|m|gap)-\[(\d+)px\]/g, (match, prefix, px) => {
    const num = parseInt(px, 10);
    let step = "4";
    if (num <= 4) step = "1";
    else if (num <= 8) step = "2";
    else if (num <= 12) step = "3";
    else if (num <= 16) step = "4";
    else if (num <= 24) step = "6";
    else if (num <= 32) step = "8";
    else step = "12";
    fixes.push("SLOP-007: Normalized arbitrary " + match + " to standard " + prefix + "-" + step);
    tokenCount++;
    return prefix + "-" + step;
  });

  // 4. Inject accessible aria-labels on icon-only buttons (SLOP-010)
  code = code.replace(/<button([^>]*?)>(\s*<[A-Z]\w+Icon[^>]*\/>\s*)<\/button>/g, (match, attrs, icon) => {
    if (!attrs.includes("aria-label")) {
      a11yCount++;
      fixes.push("SLOP-010: Injected aria-label on icon-only button");
      return '<button' + attrs + ' aria-label="Action">' + icon + '</button>';
    }
    return match;
  });

  // 5. Ensure inline SVGs declare role="img" and aria-hidden="true" (SLOP-011)
  code = code.replace(/<svg\b(?![^>]*(?:role=|aria-hidden=|aria-label))([^>]*)>/g, (match, attrs) => {
    a11yCount++;
    fixes.push("SLOP-011: Added role='img' and aria-hidden='true' to inline SVG element");
    return '<svg role="img" aria-hidden="true"' + attrs + '>';
  });

  // 6. Ensure focus ring suppression is replaced with focus-visible (SLOP-012)
  if (/(?:outline-none|ring-0)\b/i.test(code) && !code.includes("focus-visible:")) {
    code = code.replace(/(outline-none|ring-0)/g, "$1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none");
    fixes.push("SLOP-012: Injected focus-visible:ring-2 compliance for keyboard navigation");
    a11yCount++;
  }

  // 7. Ensure SPDX and origin headers exist
  if (!code.includes("@license") && !code.includes("@origin")) {
    code = "/**\n * @license MIT\n * @origin Machine-First Design Agent Wiki\n * Refactored from Screenshot-to-Code Reference\n */\n\n" + code;
    fixes.push("SLOP-020: Injected mandatory SPDX license header");
  }

  return {
    code,
    receipt: {
      originalLength: rawCode.length,
      transformedLength: code.length,
      fixesApplied: fixes,
      tokensRemapped: tokenCount,
      a11yLabelsInjected: a11yCount,
    },
  };
}
