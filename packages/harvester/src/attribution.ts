export interface AttributionInfo {
  license: string;
  origin: string;
  author: string;
}

/**
 * Ensures an immutable legal open-source license attribution header is present.
 */
export function injectAttributionHeader(
  sourceCode: string,
  info: AttributionInfo
): string {
  if (
    sourceCode.includes("@license") ||
    sourceCode.includes("SPDX-License-Identifier")
  ) {
    return sourceCode;
  }

  const header = `/**
 * @license ${info.license}
 * @origin ${info.origin}
 * @author ${info.author}
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */\n\n`;

  return header + sourceCode;
}
