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
    name: "Non-Token Arbitrary Pixel Spacing / Sizing",
    category: "Layout & Spacing",
    severity: "Low",
    description: "Use of arbitrary pixel escapes (e.g. p-[17px], m-[13px], gap-[15px]) instead of standard Tailwind system spacing tokens.",
    check: (line) =>
      /(?:p[xytrbl]?|m[xytrbl]?|gap|space-[xy])-\[(?:\d+px|\d+rem)\]/i.test(line) &&
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
  {
    id: "SLOP-021",
    name: "Raw Unshaded Background",
    category: "Styling & Surface",
    severity: "Medium",
    description: "Raw unshaded background (bg-white, bg-black, or un-tokenized bg-[#...]) used without dark variant or semantic tokens (bg-card, bg-background, bg-muted).",
    check: (line) =>
      !line.includes("dark:bg-") &&
      !line.includes("bg-white/") &&
      !line.includes("bg-black/") &&
      (/(?:bg-white|bg-black)\b/i.test(line) || /bg-\[#(?:fff|ffffff|000|000000)\]/i.test(line)),
  },
  {
    id: "SLOP-022",
    name: "AI Writing Clichés",
    category: "Copy & Writing",
    severity: "Medium",
    description: "Bans AI writing clichés and tropes (e.g. 'In today's fast-paced world', 'Unleash the power of', 'The future of X is here').",
    check: (line) =>
      /(?:in today's fast-paced|unleash the power of|it's not just .* it's|the future is here|supercharge your workflow|revolutionize the way you|dive deep into|testament to)/i.test(
        line
      ),
  },
  {
    id: "SLOP-023",
    name: "Oxlint Contract Hygiene",
    category: "TypeScript Safety",
    severity: "High",
    description: "Rejects loose Record<string, any>, untyped callback parameters, and unconstrained any interfaces.",
    check: (line) =>
      /(?:Record<string,\s*any>|:\s*any\[\]|\((?:e|evt|event|item|data|val|props):\s*any\))/i.test(
        line
      ),
  },
  {
    id: "SLOP-024",
    name: "Strict WCAG 2.1 AA Contrast Ratio",
    category: "Accessibility",
    severity: "High",
    description: "Flags low-contrast text color combinations (e.g. muted text opacity under 40% or light gray on light gray backgrounds).",
    check: (line) =>
      /(?:text-muted-foreground\/(?:10|20|30)|text-zinc-400\s+bg-zinc-300|text-gray-300\s+bg-gray-200|text-white\/20\s+bg-white)/i.test(
        line
      ),
  },
  {
    id: "SLOP-025",
    name: "Uncancelled Timer or Listener Leaks",
    category: "Performance & Architecture",
    severity: "High",
    description: "Flags timer (setInterval) or event listener attachments in useEffect missing return cleanup handler.",
    check: (line, content) =>
      (line.includes("setInterval(") || line.includes("addEventListener(")) &&
      content.includes("useEffect(") &&
      !content.includes("clearInterval") &&
      !content.includes("removeEventListener"),
  },
  {
    id: "SLOP-026",
    name: "Arbitrary Color Token Escapes",
    category: "Styling & Color",
    severity: "Medium",
    description: "Flags hardcoded hex/RGB color escapes where standard semantic tokens (bg-background, text-foreground, border-border) should be used.",
    check: (line) =>
      /(?:bg|text|border)-\[#(?:0f172a|1e293b|334155|64748b|94a3b8|cbd5e1|e2e8f0|f1f5f9|f8fafc)\]/i.test(
        line
      ),
  },
  {
    id: "SLOP-027",
    name: "Unbounded List Rendering Without Stable Key",
    category: "Architecture & Quality",
    severity: "Medium",
    description: "Flags .map() iterations over JSX elements missing stable keys or using fragile array index fallback.",
    check: (line) =>
      /\.map\(\s*\([^)]*\)\s*=>\s*<[a-zA-Z]/i.test(line) &&
      !line.includes("key=") &&
      !line.includes("return"),
  },
  {
    id: "SLOP-028",
    name: "Missing Spring Fallback Damping",
    category: "Motion Quality",
    severity: "Low",
    description: "Flags Framer Motion spring physics definitions with excessive stiffness (>500) and zero/low damping.",
    check: (line) =>
      /stiffness:\s*(?:[5-9]\d{2}|\d{4,})/i.test(line) &&
      !line.includes("damping:"),
  },
  {
    id: "SLOP-029",
    name: "Hardcoded SVG Dimensions",
    category: "Iconography & A11y",
    severity: "Low",
    description: "Flags raw inline SVGs with fixed pixel dimensions and missing scalable viewBox or currentColor inheritance.",
    check: (line) =>
      /<svg\b[^>]*\b(?:width|height)=["'](?:[5-9]\d{2}|\d{4,})["'](?!.*viewBox)/i.test(
        line
      ),
  },
  {
    id: "SLOP-030",
    name: "Clean SPDX & Origin Header Verification",
    category: "Legal & IP Compliance",
    severity: "High",
    description: "Requires verified machine-readable @origin, @license, and @curated-by frontmatter headers on all registry components.",
    check: (line, content, lineIndex, filePath) =>
      lineIndex === 0 &&
      Boolean(filePath && (filePath.includes("registry") || filePath.includes("components"))) &&
      (!content.includes("@origin") || !content.includes("@license") || !content.includes("@curated-by")),
  },
  {
    id: "SLOP-031",
    name: "Missing Error Boundary Fallback",
    category: "Production Runtime Resilience",
    severity: "Medium",
    description: "Complex canvas/WebGL/media component missing a fallback UI or error boundary handling.",
    check: (line, content, lineIndex, filePath) =>
      lineIndex === 0 &&
      Boolean(content.includes("<canvas") || content.includes("getContext('webgl')") || content.includes("WebGLRenderer")) &&
      !content.includes("fallback") &&
      !content.includes("Fallback") &&
      !content.includes("ErrorBoundary") &&
      !content.includes("prefers-reduced-motion"),
  },
  {
    id: "SLOP-032",
    name: "Unbounded Canvas Memory Allocation",
    category: "Performance & Memory",
    severity: "High",
    description: "Allocating new objects or arrays inside requestAnimationFrame animation loop causing garbage collection stutter.",
    check: (line, content) =>
      /requestAnimationFrame/i.test(content) &&
      !line.trim().startsWith("const ") &&
      !line.trim().startsWith("let ") &&
      /new\s+(?:Array|Object|Float32Array|Uint8Array|Path2D)\s*\(|new\s+\w+\(/i.test(line) &&
      !line.includes("new Date") &&
      !line.includes("new RegExp"),
  },
  {
    id: "SLOP-033",
    name: "Missing Escape Key Overlay Dismiss",
    category: "Accessibility & Interaction",
    severity: "High",
    description: "Custom modal dialog, popover, or drawer lacking Escape key dismiss listener or onKeyDown handler.",
    check: (line, content, lineIndex) =>
      lineIndex === 0 &&
      (content.includes("role=\"dialog\"") || content.includes("role='dialog'") || /const\s+\[(?:open|isOpen),\s*set(?:Open|IsOpen)\]/.test(content)) &&
      (/\bmodal\b/i.test(content) || /\bdialog\b/i.test(content) || /\bdrawer\b/i.test(content)) &&
      !content.includes("Escape") &&
      !content.includes("onKeyDown") &&
      !content.includes("@radix-ui/react-dialog") &&
      !content.includes("@radix-ui/react-popover") &&
      !content.includes("@radix-ui/react-dropdown-menu"),
  },
  {
    id: "SLOP-034",
    name: "Redundant Nested Context Providers",
    category: "Architecture & Performance",
    severity: "Medium",
    description: "Duplicate nested context providers of identical types causing redundant React sub-tree re-renders.",
    check: (line, content) =>
      /<\s*([A-Z]\w+Context)\.Provider/i.test(line) &&
      (content.match(new RegExp(`<\\s*${(line.match(/<\s*([A-Z]\w+Context)\.Provider/i) || [])[1]}\\.Provider`, "g")) || []).length > 2,
  },
  {
    id: "SLOP-035",
    name: "Un-memoized Heavy Array Sort/Filter in Render",
    category: "Performance & React Discipline",
    severity: "Medium",
    description: "Performing in-place or heavy array sorting/filtering directly in render return without useMemo.",
    check: (line) =>
      /return\s*\(/.test(line) === false &&
      /\.(?:sort|filter)\([^)]*\)\.map\(/i.test(line) &&
      !line.includes("useMemo") &&
      !line.includes("const ") &&
      !line.includes("let "),
  },
  {
    id: "SLOP-036",
    name: "Hallucinated Static KPI Metric Claims",
    category: "Copy & Production Validity",
    severity: "Medium",
    description: "Hardcoding exaggerated vanity statistics ('99.9% Faster', '10x Productivity') into component templates without dynamic props.",
    check: (line) =>
      /(?:99\.9%|10x\s+Faster|100x\s+Speed|#1\s+Platform|Zero\s+Latency)/i.test(line) &&
      !line.includes("//") &&
      !line.includes("props") &&
      !line.includes("metric") &&
      !line.includes("interface ") &&
      !line.includes("type "),
  },
  {
    id: "SLOP-037",
    name: "Unvalidated Form Handler or Silent Submit",
    category: "Interaction & Logic",
    severity: "High",
    description: "Form element with dummy onSubmit handler preventing default without state handling or validation feedback.",
    check: (line, content) =>
      /<form\b/.test(line) &&
      /onSubmit=\{\s*\(\s*e\s*\)\s*=>\s*e\.preventDefault\(\)\s*\}/.test(line) &&
      !content.includes("useState") &&
      !content.includes("useForm") &&
      !content.includes("action"),
  },
  {
    id: "SLOP-038",
    name: "Mobile Viewport Height Cutoff",
    category: "Layout & Mobile Responsiveness",
    severity: "Medium",
    description: "Using hardcoded h-screen instead of min-h-screen or min-h-[100dvh] causing mobile address bar cutoff.",
    check: (line) =>
      /\bh-screen\b/.test(line) &&
      !line.includes("min-h-") &&
      !line.includes("max-h-") &&
      !line.includes("dvh") &&
      !line.includes("//"),
  },
  {
    id: "SLOP-039",
    name: "Global Outline Suppression Without Replacement",
    category: "Accessibility & WCAG",
    severity: "High",
    description: "Universal CSS or Tailwind rule stripping focus outlines without providing a visible focus indicator.",
    check: (line) =>
      /(?:outline-none|\*:\s*outline-none)\b/.test(line) &&
      !line.includes("focus-visible:") &&
      !line.includes("focus:") &&
      !line.includes("ring-"),
  },
  {
    id: "SLOP-040",
    name: "Non-Semantic Div Soup Navigation Landmark",
    category: "Accessibility & Semantics",
    severity: "Medium",
    description: "Navigation or header section constructed purely of generic div tags lacking semantic nav or header landmarks.",
    check: (line, content, lineIndex) =>
      lineIndex === 0 &&
      (/(?:function|const)\s+(?:[A-Z]\w*NavBar|[A-Z]\w*Navigation|NavBar|NavigationBar)\b/.test(content)) &&
      !content.includes("<nav") &&
      !content.includes("role=\"navigation\"") &&
      !content.includes("role='navigation'"),
  },
  {
    id: "SLOP-041",
    name: "Mobile Dynamic Viewport Unit Omission",
    category: "Layout & Responsiveness",
    severity: "Medium",
    description: "Using hardcoded h-screen or fixed 100vh on root application views without min-h-screen or dvh/svh unit support.",
    check: (line) =>
      /\bh-screen\b/.test(line) &&
      !line.includes("min-h-") &&
      !line.includes("max-h-") &&
      !line.includes("dvh") &&
      !line.includes("svh") &&
      !line.includes("//"),
  },
  {
    id: "SLOP-042",
    name: "Unbounded Arbitrary High Z-Index Clashes",
    category: "Styling & Hierarchy",
    severity: "Low",
    description: "Arbitrary extreme z-index values (e.g. z-[9999], z-[99999]) causing stacking context warfare instead of standard z-10/20/30/40/50 scale.",
    check: (line) =>
      /z-\[(?:9999|99999|\d{4,})\]/i.test(line),
  },
  {
    id: "SLOP-043",
    name: "Unannounced Dynamic Streaming Content",
    category: "Accessibility & ARIA",
    severity: "High",
    description: "Streaming AI message or dynamic status update container lacking aria-live or role='status' / role='log'.",
    check: (line, content, lineIndex) =>
      lineIndex === 0 &&
      (/(?:StreamingMessage|StreamingChat|TokenStream|AgentStatus)\b/.test(content)) &&
      !content.includes("aria-live") &&
      !content.includes("role=\"status\"") &&
      !content.includes("role='status'") &&
      !content.includes("role=\"log\"") &&
      !content.includes("role='log'"),
  },
  {
    id: "SLOP-044",
    name: "Uncleaned Animation/Resize Listeners in useEffect",
    category: "Performance & Memory",
    severity: "High",
    description: "Adding resize/scroll window listeners or animation loops in useEffect without returning a cleanup function.",
    check: (line, content) =>
      /addEventListener\s*\(\s*["'](?:resize|scroll|mousemove|keydown)["']/.test(line) &&
      !content.includes("removeEventListener"),
  },
  {
    id: "SLOP-045",
    name: "Non-Responsive Hardcoded Container Min-Width",
    category: "Layout & Responsiveness",
    severity: "Medium",
    description: "Hardcoded arbitrary large min-width (e.g. min-w-[700px] or min-w-[800px]) on containers that break on mobile screens.",
    check: (line) =>
      /min-w-\[(?:[6-9]\d\dpx|1\d{3}px)\]/i.test(line) &&
      !line.includes("sm:") &&
      !line.includes("md:") &&
      !line.includes("lg:"),
  },
  {
    id: "SLOP-046",
    name: "Nested Interactive Control Trap",
    category: "HTML Semantics & A11y",
    severity: "High",
    description: "Nesting an interactive button inside an anchor or another button tag, causing accessibility parse errors.",
    check: (line) =>
      /<a\b[^>]*>.*<button\b/i.test(line) ||
      /<button\b[^>]*>.*<button\b/i.test(line),
  },
  {
    id: "SLOP-047",
    name: "Hardcoded Exaggerated SLA Claims",
    category: "Copy & Production Validity",
    severity: "Medium",
    description: "Hardcoding non-provable SLA statistics ('100% Guaranteed', 'Zero Downtime', 'Instant 0ms Latency') directly into copy.",
    check: (line) =>
      /(?:100%\s+Guaranteed|Zero\s+Downtime|Instant\s+0ms\s+Latency|Completely\s+Unbreakable)/i.test(line) &&
      !line.includes("//"),
  },
  {
    id: "SLOP-048",
    name: "Excessive DOM Nesting Wrapper Clutter",
    category: "Performance & DOM Health",
    severity: "Low",
    description: "Constructing more than 6 immediately adjacent un-styled nested divs (div soup) without semantic structure.",
    check: (line, content) =>
      /(?:<div[^>]*>\s*){6,}/i.test(content),
  },
  {
    id: "SLOP-049",
    name: "Unconstrained Image Loading Without Lazy/Priority",
    category: "Performance & Web Vitals",
    severity: "Medium",
    description: "External <img> tag lacking loading='lazy' or explicit dimensions and decoding strategy.",
    check: (line) =>
      /<img\b[^>]*\bsrc=["']http/i.test(line) &&
      !line.includes("loading=") &&
      !line.includes("decoding="),
  },
  {
    id: "SLOP-050",
    name: "Font Family Override Without Fallbacks",
    category: "Typography & Web Vitals",
    severity: "Low",
    description: "Setting inline or arbitrary font-family without generic system font fallback (sans-serif, serif, monospace).",
    check: (line) =>
      /font-\[[^\]]+\]/i.test(line) &&
      !line.includes("sans") &&
      !line.includes("serif") &&
      !line.includes("mono"),
  },
];

export interface CssAntiPatternMatch {
  lineNum: number;
  arbitraryValue: string;
  property: string;
  recommendedToken: string;
  lineSnippet: string;
}

/**
 * Specifically scans CSS/Tailwind class strings for non-token arbitrary escapes
 * such as p-[17px], m-[13px], gap-[15px], text-[#...], etc.
 */
export function scanCssAntiPatterns(code: string): CssAntiPatternMatch[] {
  const lines = code.split("\n");
  const matches: CssAntiPatternMatch[] = [];

  const mapPxToToken = (propPrefix: string, pxVal: number): string => {
    const step = Math.round(pxVal / 4);
    return `${propPrefix}-${step}`;
  };

  const arbitrarySpacingRegex = /\b(p[xytrbl]?|m[xytrbl]?|gap|w|h|top|bottom|left|right|space-[xy])-\[(\d+)px\]/g;
  const arbitraryColorRegex = /\b(bg|text|border)-\[#([0-9a-fA-F]{3,8})\]/g;
  const arbitraryRadiusRegex = /\brounded-\[(\d+)px\]/g;

  lines.forEach((line, index) => {
    let match: RegExpExecArray | null;

    // 1. Arbitrary spacing: p-[17px], m-[13px], etc.
    while ((match = arbitrarySpacingRegex.exec(line)) !== null) {
      const prop = match[1];
      const px = parseInt(match[2], 10);
      matches.push({
        lineNum: index + 1,
        arbitraryValue: match[0],
        property: prop,
        recommendedToken: mapPxToToken(prop, px),
        lineSnippet: line.trim(),
      });
    }

    // 2. Arbitrary colors: bg-[#4f46e5], text-[#6366f1]
    while ((match = arbitraryColorRegex.exec(line)) !== null) {
      const prop = match[1];
      matches.push({
        lineNum: index + 1,
        arbitraryValue: match[0],
        property: prop,
        recommendedToken: `${prop}-primary (or semantic token)`,
        lineSnippet: line.trim(),
      });
    }

    // 3. Arbitrary radius: rounded-[13px]
    while ((match = arbitraryRadiusRegex.exec(line)) !== null) {
      const px = parseInt(match[1], 10);
      const rec = px <= 4 ? "rounded-sm" : px <= 8 ? "rounded-md" : px <= 12 ? "rounded-lg" : "rounded-xl";
      matches.push({
        lineNum: index + 1,
        arbitraryValue: match[0],
        property: "rounded",
        recommendedToken: rec,
        lineSnippet: line.trim(),
      });
    }
  });

  return matches;
}

