/**
 * @license Apache-2.0
 * @origin Machine-First Design Agent Wiki
 * WCAG 2.1 AA Relative Luminance & Contrast Checker
 */

export interface ContrastResult {
  ratio: number;
  meetsNormalAA: boolean; // >= 4.5:1
  meetsLargeAA: boolean;  // >= 3.0:1
  meetsAAA: boolean;      // >= 7.0:1
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function calculateContrastRatio(fgHex: string, bgHex: string): ContrastResult {
  const [r1, g1, b1] = hexToRgb(fgHex);
  const [r2, g2, b2] = hexToRgb(bgHex);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const rounded = Math.round(ratio * 100) / 100;

  return {
    ratio: rounded,
    meetsNormalAA: rounded >= 4.5,
    meetsLargeAA: rounded >= 3.0,
    meetsAAA: rounded >= 7.0,
  };
}
