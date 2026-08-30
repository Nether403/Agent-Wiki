export type Severity = "High" | "Medium" | "Low";

export interface SlopRule {
  id: string;
  name: string;
  category: string;
  severity: Severity;
  description: string;
  check: (line: string, fileContent: string, lineIndex: number, filePath?: string) => boolean;
}

export const SLOP_RULES: SlopRule[] = [
  {
    id: "SLOP-001",
    name: "Generic Indigo Color Default",
    category: "Styling & Color",
    severity: "Medium",
    description: "Hardcoded indigo shades (e.g. #4f46e5, bg-indigo-600) indicating default un-themed AI styling.",
    check: (line) =>
      /bg-indigo-(?:500|600|700)|text-indigo-(?:500|600)|(?:#4f46e5|#6366f1|rgb\(79,\s*70,\s*229\))/i.test(
        line
      ),
  },
  {
    id: "SLOP-002",
    name: "Standard Purple-to-Blue Linear Gradient",
    category: "Styling & Color",
    severity: "Medium",
    description: "Cliché purple-to-blue linear gradients signaling generic AI-generated backgrounds.",
    check: (line) =>
      /from-purple-500\s+to-blue-500|bg-gradient-to-[r|tr|tl|b]\s+from-fuchsia|bg-gradient-to-[r|tr|tl|b]\s+from-purple/i.test(
        line
      ),
  },
  {
    id: "SLOP-003",
    name: "Blanket Glassmorphism Default",
    category: "Styling & Surface",
    severity: "Low",
    description: "Ad-hoc glassmorphism (bg-white/10 backdrop-blur-md) across cards instead of defined structural tokens.",
    check: (line) =>
      /bg-white\/10\s+backdrop-blur|bg-white\/5\s+backdrop-blur/i.test(line),
  },
  {
    id: "SLOP-004",
    name: "Chained Type Assertions",
    category: "TypeScript Safety",
    severity: "High",
    description: "Bypassing TypeScript compiler safety by chaining type assertions (e.g. as any as, as unknown as).",
    check: (line) => /as\s+\w+\s+as\s+\w+/i.test(line),
  },
  {
    id: "SLOP-005",
    name: "Conditional Empty Object Spreads",
    category: "Code Quality",
    severity: "High",
    description: "Ad-hoc object spreads with empty object fallbacks (e.g. ...(condition ? { val } : {})).",
    check: (line) =>
      /\.\.\.\s*\(\s*[^?]+\s*\?\s*\{[^}]*\}\s*:\s*\{\s*\}\s*\)/i.test(line),
  },
  {
    id: "SLOP-006",
    name: "Blanket Ad-hoc Transitions",
    category: "Motion & Performance",
    severity: "Low",
    description: "Global transition-all duration-300 applied to large parent wrappers instead of explicit mutable styles.",
    check: (line) =>
      /transition-all\s+duration-(?:300|500)/i.test(line) &&
      !line.includes("transition-all focus-visible"),
  },
  {
    id: "SLOP-007",
    name: "Non-Token Arbitrary Pixel Spacing",
    category: "Layout & Spacing",
    severity: "Low",
    description: "Use of arbitrary pixel escapes (e.g. p-[17px], m-[13px]) instead of Tailwind system spacing steps.",
    check: (line) =>
      /(?:p|m|gap|w|h|top|left|right|bottom)-\[(?:\d+px|\d+rem)\]/i.test(line) &&
      !line.includes("left-[50%]") &&
      !line.includes("top-[50%]"),
  },
  {
    id: "SLOP-008",
    name: "Decorative Emojis inside Cards/Buttons",
    category: "Typography & Iconography",
    severity: "Medium",
    description: "Emojis used inside buttons or cards instead of typed semantic SVGs or Lucide icons.",
    check: (line) =>
      /(?:<span>|<li>|<p>|<button>)\s*[\uD800-\uDBFF][\uDC00-\uDFFF]\s*(?:<\/span>|<\/li>|<\/p>|<\/button>)/i.test(
        line
      ),
  },
  {
    id: "SLOP-009",
    name: "Truncated Logic / Incomplete TODOs",
    category: "Code Completeness",
    severity: "High",
    description: "Truncated placeholder code or unfinished implementation comments.",
    check: (line) =>
      /\/\/\s*TODO:\s*(?:implement|add\s+logic|finish|mock)/i.test(line),
  },
  {
    id: "SLOP-010",
    name: "Interactive Element Missing A11y Label",
    category: "Accessibility",
    severity: "High",
    description: "Interactive button/link with only an icon and no aria-label or accessible text.",
    check: (line) =>
      /<button[^>]*>\s*<[A-Z]\w+[^>]*\/>\s*<\/button>/i.test(line) &&
      !line.includes("aria-label") &&
      !line.includes("sr-only"),
  },
  {
    id: "SLOP-011",
    name: "Inline SVG Missing Role or Title",
    category: "Accessibility",
    severity: "Medium",
    description: "Inline SVG icons missing role='img' and accessible title or aria-hidden.",
    check: (line) =>
      /<svg\b(?![^>]*(?:role=["']img["']|aria-hidden=["']true["']|aria-label))[^>]*>/i.test(
        line
      ),
  },
  {
    id: "SLOP-012",
    name: "Focus Ring Suppression Without Replacement",
    category: "Accessibility",
    severity: "High",
    description: "Removing focus ring (outline-none or ring-0) without providing a focus-visible ring.",
    check: (line) =>
      !line.includes("pointer-events-none") &&
      /(?:outline-none|ring-0)\b/i.test(line) &&
      !line.includes("focus-visible:") &&
      !line.includes("focus:ring") &&
      !line.includes("focus:bg-"),
  },
  {
    id: "SLOP-013",
    name: "Layout-Triggering Transitions",
    category: "Performance",
    severity: "Medium",
    description: "Animating layout-triggering properties (transition-[height], transition-[width]) that force reflows.",
    check: (line) =>
      /transition-\[(?:height|width|margin|padding)\]/i.test(line),
  },
  {
    id: "SLOP-014",
    name: "Canvas Loop Missing Reduced Motion Check",
    category: "Performance & A11y",
    severity: "Medium",
    description: "HTML5 Canvas loop without checking window.matchMedia('(prefers-reduced-motion)').",
    check: (line, content) =>
      /requestAnimationFrame/i.test(line) &&
      !content.includes("prefers-reduced-motion"),
  },
  {
    id: "SLOP-015",
    name: "External Image Missing Fallback Dimensions",
    category: "Architecture",
    severity: "High",
    description: "Raw external HTTP image elements without explicit width, height, or aspect ratio.",
    check: (line) =>
      /<img[^>]+src=["']http[^"']+["'](?!.*(?:width=|height=|aspect-))/i.test(
        line
      ),
  },
  {
    id: "SLOP-016",
    name: "Missing LayoutGroup or AnimatePresence Key",
    category: "Motion Quality",
    severity: "Low",
    description: "Motion component with layoutId inside mapping without explicit stable key.",
    check: (line) =>
      /layoutId=/i.test(line) &&
      line.includes(".map(") &&
      !line.includes("key="),
  },
  {
    id: "SLOP-017",
    name: "Implicit Any Props on Component Export",
    category: "TypeScript Safety",
    severity: "Medium",
    description: "Exported React component using un-typed props signature (props: any).",
    check: (line) =>
      /export\s+(?:function|const)\s+\w+\s*=\s*\([^)]*:\s*any\s*\)/i.test(line),
  },
  {
    id: "SLOP-018",
    name: "Repetitive Centered Card Layout Pattern",
    category: "Styling & Layout",
    severity: "Medium",
    description: "Cliché 3-column centered informational cards with identical top icon and text.",
    check: (line) =>
      /grid-cols-3.*items-center.*text-center.*rounded-xl.*p-6/i.test(line),
  },
  {
    id: "SLOP-019",
    name: "Deep Relative Import Bypassing Aliases",
    category: "Architecture",
    severity: "High",
    description: "Deep traversing relative imports (../../../../) instead of standard path aliases (@/).",
    check: (line) =>
      /import\s+.*from\s+["'](?:\.\.\/){3,}/i.test(line),
  },
  {
    id: "SLOP-020",
    name: "Missing Mandatory License Attribution Header",
    category: "Legal & IP Compliance",
    severity: "High",
    description: "Component file missing mandatory SPDX or upstream license attribution header.",
    check: (line, content, lineIndex, filePath) =>
      lineIndex === 0 &&
      Boolean(filePath && (filePath.includes("registry") || filePath.includes("components"))) &&
      !content.includes("@license") &&
      !content.includes("@origin") &&
      !content.includes("SPDX-License-Identifier"),
  },
];
