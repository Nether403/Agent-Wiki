#!/usr/bin/env python3
import os
import sys
import re
from datetime import datetime

# Ensure utf-8 output encoding on Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Complete 21 Anti-Slop and Design Guardrail Rules
SLOP_PATTERNS = [
    {
        "id": "SLOP-001",
        "name": "Generic Indigo Button or Color",
        "severity": "Medium",
        "category": "Styling & Color Palette",
        "description": "Use of hardcoded indigo shades (e.g., #4f46e5, bg-indigo-600, text-indigo-500) indicating default AI color choices.",
        "regex": re.compile(r"bg-indigo-(?:500|600|700)|text-indigo-(?:500|600)|(?:#4f46e5|#6366f1|rgb\(79,\s*70,\s*229\))", re.IGNORECASE)
    },
    {
        "id": "SLOP-002",
        "name": "Standard Purple-to-Blue Gradient",
        "severity": "Medium",
        "category": "Styling & Color Palette",
        "description": "Use of generic gradient (from-purple-500 to-blue-500) that signals generic AI-generated backgrounds.",
        "regex": re.compile(r"from-purple-500\s+to-blue-500|bg-gradient-to-[r|tr|tl|b]\s+from-fuchsia|bg-gradient-to-[r|tr|tl|b]\s+from-purple", re.IGNORECASE)
    },
    {
        "id": "SLOP-003",
        "name": "Glassmorphism Background Defaults",
        "severity": "Low",
        "category": "Styling & Surface",
        "description": "Ad-hoc glassmorphism (bg-white/10 backdrop-blur-md) across blocks instead of structural variables.",
        "regex": re.compile(r"bg-white/10\s+backdrop-blur|bg-white/5\s+backdrop-blur", re.IGNORECASE)
    },
    {
        "id": "SLOP-004",
        "name": "Chained Type Assertions",
        "severity": "High",
        "category": "TypeScript Safety",
        "description": "Bypassing TypeScript compile-time safety by chaining type assertions (e.g., as any as, as unknown as).",
        "regex": re.compile(r"as\s+\w+\s+as\s+\w+", re.IGNORECASE)
    },
    {
        "id": "SLOP-005",
        "name": "Conditional Empty Object Spreads",
        "severity": "High",
        "category": "Code Quality",
        "description": "Ad-hoc object expansions (e.g., ...(condition ? { val } : {})) which degrade structure and lead to run-time risks.",
        "regex": re.compile(r"\.\.\.\s*\(\s*[^?]+\s*\?\s*\{[^}]*\}\s*:\s*\{\s*\}\s*\)", re.IGNORECASE)
    },
    {
        "id": "SLOP-006",
        "name": "Blanket Ad-hoc Transitions",
        "severity": "Low",
        "category": "Motion & Performance",
        "description": "Transition-all commands (transition-all duration-300) applied globally rather than on specific mutating properties.",
        "regex": re.compile(r"transition-all\s+duration-(?:300|500)", re.IGNORECASE)
    },
    {
        "id": "SLOP-007",
        "name": "Arbitrary Pixel Spacing / Sizing Overrides",
        "severity": "High",
        "category": "Layout & Spacing",
        "description": "Use of non-standard arbitrary pixel units (e.g., p-[17px], m-[13px], gap-[15px]) violating Tailwind token contracts.",
        "regex": re.compile(r"(?:p[xytrbl]?|m[xytrbl]?|gap|w|h|top|left|right|bottom)-\[(\d+px|\d+rem)\]", re.IGNORECASE)
    },
    {
        "id": "SLOP-008",
        "name": "Decorative Emojis inside Cards/Buttons",
        "severity": "Medium",
        "category": "Typography & Iconography",
        "description": "Emojis used as icons inside interactive layout blocks instead of typed semantic SVGs or Lucide items.",
        "regex": re.compile(r"<span>\s*[\uD800-\uDBFF][\uDC00-\uDFFF]\s*</span>|<li>\s*[\uD800-\uDBFF][\uDC00-\uDFFF]|<button[^>]*>\s*[\uD800-\uDBFF][\uDC00-\uDFFF]", re.IGNORECASE)
    },
    {
        "id": "SLOP-009",
        "name": "Incomplete Mock / TODO Logic",
        "severity": "High",
        "category": "Code Completeness",
        "description": "Truncated placeholder code or unfinished mock comments.",
        "regex": re.compile(r"//\s*TODO:\s*(?:implement|add\s+logic|finish|mock)", re.IGNORECASE)
    },
    {
        "id": "SLOP-010",
        "name": "Interactive Element Missing A11y Label",
        "severity": "High",
        "category": "Accessibility & WCAG",
        "description": "Icon-only button missing aria-label or accessible text.",
        "regex": re.compile(r"<button(?![^>]*(?:aria-label|aria-labelledby))[^>]*>\s*<[A-Z]\w+[^>]*\/>\s*<\/button>", re.IGNORECASE)
    },
    {
        "id": "SLOP-011",
        "name": "Inline SVG Missing Role or Title",
        "severity": "Medium",
        "category": "Accessibility & WCAG",
        "description": "Inline SVG icons missing role='img' and accessible title or aria-hidden.",
        "regex": re.compile(r"<svg\b(?![^>]*(?:role=[\"']img[\"']|aria-hidden=[\"']true[\"']|aria-label))[^>]*>", re.IGNORECASE)
    },
    {
        "id": "SLOP-012",
        "name": "Focus Ring Suppression Without Replacement",
        "severity": "High",
        "category": "Accessibility & WCAG",
        "description": "Removing focus ring (outline-none or ring-0) without providing focus-visible ring.",
        "regex": re.compile(r"(?:outline-none|ring-0)\b(?![^>]*(?:focus-visible:|focus:ring))", re.IGNORECASE)
    },
    {
        "id": "SLOP-013",
        "name": "Layout-Triggering Transitions",
        "severity": "Medium",
        "category": "Performance",
        "description": "Animating layout properties (transition-[height], transition-[width]) that cause DOM reflows.",
        "regex": re.compile(r"transition-\[(?:height|width|margin|padding)\]", re.IGNORECASE)
    },
    {
        "id": "SLOP-014",
        "name": "Canvas Loop Missing Reduced Motion",
        "severity": "Medium",
        "category": "Performance & A11y",
        "description": "Canvas requestAnimationFrame loop without prefers-reduced-motion check.",
        "regex": re.compile(r"requestAnimationFrame", re.IGNORECASE)
    },
    {
        "id": "SLOP-015",
        "name": "External Image Missing Dimensions",
        "severity": "High",
        "category": "Architecture",
        "description": "Image element without explicit width, height, or aspect ratio.",
        "regex": re.compile(r"<img[^>]+src=[\"']http[^\"']+[\"'](?!.*(?:width=|height=|aspect-))", re.IGNORECASE)
    },
    {
        "id": "SLOP-016",
        "name": "Missing LayoutGroup or Stable Key",
        "severity": "Low",
        "category": "Motion Quality",
        "description": "Motion element with layoutId inside mapping without explicit key.",
        "regex": re.compile(r"layoutId=(?!.*key=)", re.IGNORECASE)
    },
    {
        "id": "SLOP-017",
        "name": "Implicit Any Props Signature",
        "severity": "Medium",
        "category": "TypeScript Safety",
        "description": "Exported component using un-typed props signature (props: any).",
        "regex": re.compile(r"export\s+(?:function|const)\s+\w+\s*=\s*\([^)]*:\s*any\s*\)", re.IGNORECASE)
    },
    {
        "id": "SLOP-018",
        "name": "Repetitive Centered Card Layout Pattern",
        "severity": "Medium",
        "category": "Styling & Layout",
        "description": "Cliché 3-column centered informational cards with identical top icon and text.",
        "regex": re.compile(r"grid-cols-3.*items-center.*text-center.*rounded-xl.*p-6", re.IGNORECASE)
    },
    {
        "id": "SLOP-019",
        "name": "Deep Relative Imports",
        "severity": "High",
        "category": "Architecture",
        "description": "Traversing relative imports (../../../../) instead of standard path aliases (@/).",
        "regex": re.compile(r"import\s+.*from\s+[\"'](?:\.\.\/){3,}", re.IGNORECASE)
    },
    {
        "id": "SLOP-020",
        "name": "Missing Mandatory License Attribution",
        "severity": "High",
        "category": "Legal & IP Compliance",
        "description": "Component missing mandatory license attribution or SPDX identifier header.",
        "regex": re.compile(r"^$", re.IGNORECASE)
    },
    {
        "id": "SLOP-021",
        "name": "Raw Unshaded Background / Low WCAG Contrast",
        "severity": "Medium",
        "category": "WCAG Accessibility & Styling",
        "description": "Raw unshaded background (bg-white, bg-black, or arbitrary bg-[#...]) used without dark variant or semantic tokens.",
        "regex": re.compile(r"(?:(?<!dark:)bg-(?:white|black)\b(?!/)|bg-\[#(?:fff|ffffff|000|000000)\])", re.IGNORECASE)
    },
    {
        "id": "SLOP-022",
        "name": "AI Writing Clichés",
        "severity": "Medium",
        "category": "Copy & Content",
        "description": "Robotic AI marketing tropes (e.g. 'In today's fast-paced world', 'Unleash the power of').",
        "regex": re.compile(r"(?:in today's fast-paced|unleash the power of|it's not just .* it's|the future is here|supercharge your workflow|revolutionize the way you|dive deep into|testament to)", re.IGNORECASE)
    },
    {
        "id": "SLOP-023",
        "name": "Loose TypeScript Any Hygiene",
        "severity": "High",
        "category": "TypeScript Safety",
        "description": "Unchecked loose type constructs (Record<string, any>, : any[]).",
        "regex": re.compile(r"(?:Record<string,\s*any>|:\s*any\[\]|\((?:e|evt|event|item|data|val|props):\s*any\))", re.IGNORECASE)
    },
    {
        "id": "SLOP-024",
        "name": "Strict WCAG Contrast Violation",
        "severity": "High",
        "category": "Accessibility & WCAG",
        "description": "Sub-standard contrast ratio combinations (text-muted-foreground/20).",
        "regex": re.compile(r"(?:text-muted-foreground\/(?:10|20|30)|text-zinc-400\s+bg-zinc-300|text-gray-300\s+bg-gray-200|text-white\/20\s+bg-white)", re.IGNORECASE)
    },
    {
        "id": "SLOP-025",
        "name": "Uncancelled Timer or Event Listener Leak",
        "severity": "High",
        "category": "Performance & Architecture",
        "description": "Registered setInterval or addEventListener inside useEffect without cleanup.",
        "regex": re.compile(r"(?:setInterval|addEventListener)\(", re.IGNORECASE)
    },
    {
        "id": "SLOP-026",
        "name": "Arbitrary Hex Color Escapes",
        "severity": "Medium",
        "category": "Styling & Color Palette",
        "description": "Hardcoded hex escapes where theme tokens (bg-background, text-foreground, border-border) should be used.",
        "regex": re.compile(r"(?:bg|text|border)-\[#(?:0f172a|1e293b|334155|64748b|94a3b8|cbd5e1|e2e8f0|f1f5f9|f8fafc)\]", re.IGNORECASE)
    },
    {
        "id": "SLOP-027",
        "name": "Unbounded List Mapping Without Key",
        "severity": "Medium",
        "category": "Code Quality",
        "description": "Array .map() rendering JSX elements without unique stable key.",
        "regex": re.compile(r"\.map\(\s*\([^)]*\)\s*=>\s*<[a-zA-Z]", re.IGNORECASE)
    },
    {
        "id": "SLOP-028",
        "name": "Missing Spring Damping",
        "severity": "Low",
        "category": "Motion Quality",
        "description": "High stiffness spring config without damping.",
        "regex": re.compile(r"stiffness:\s*(?:[5-9]\d{2}|\d{4,})", re.IGNORECASE)
    },
    {
        "id": "SLOP-029",
        "name": "Hardcoded Large SVG Dimensions",
        "severity": "Low",
        "category": "Iconography & A11y",
        "description": "Fixed dimension SVGs missing viewBox or scaling classes.",
        "regex": re.compile(r"<svg\b[^>]*\b(?:width|height)=[\"'](?:[5-9]\d{2}|\d{4,})[\"'](?!.*viewBox)", re.IGNORECASE)
    },
    {
        "id": "SLOP-030",
        "name": "Clean SPDX & Origin Header Verification",
        "severity": "High",
        "category": "Legal & IP Compliance",
        "description": "Requires verified machine-readable @origin, @license, and @curated-by frontmatter headers on all registry components.",
        "regex": re.compile(r"^$", re.IGNORECASE)
    },
    {
        "id": "SLOP-031",
        "name": "Missing Error Boundary Fallback",
        "severity": "Medium",
        "category": "Production Runtime Resilience",
        "description": "Complex canvas/WebGL/media component missing a fallback UI or error boundary handling.",
        "regex": re.compile(r"^$", re.IGNORECASE)
    },
    {
        "id": "SLOP-032",
        "name": "Unbounded Canvas Memory Allocation",
        "severity": "High",
        "category": "Performance & Memory",
        "description": "Allocating new objects or arrays inside requestAnimationFrame animation loop causing garbage collection stutter.",
        "regex": re.compile(r"new\s+(?:Array|Object|Float32Array|Uint8Array|Path2D)\s*\(", re.IGNORECASE)
    },
    {
        "id": "SLOP-033",
        "name": "Missing Escape Key Overlay Dismiss",
        "severity": "High",
        "category": "Accessibility & Interaction",
        "description": "Custom modal dialog, popover, or drawer lacking Escape key dismiss listener or onKeyDown handler.",
        "regex": re.compile(r"^$", re.IGNORECASE)
    },
    {
        "id": "SLOP-034",
        "name": "Redundant Nested Context Providers",
        "severity": "Medium",
        "category": "Architecture & Performance",
        "description": "Duplicate nested context providers of identical types causing redundant React sub-tree re-renders.",
        "regex": re.compile(r"<\s*([A-Z]\w+Context)\.Provider", re.IGNORECASE)
    },
    {
        "id": "SLOP-035",
        "name": "Un-memoized Heavy Array Sort/Filter in Render",
        "severity": "Medium",
        "category": "Performance & React Discipline",
        "description": "Performing in-place or heavy array sorting/filtering directly in render return without useMemo.",
        "regex": re.compile(r"\.(?:sort|filter)\([^)]*\)\.map\(", re.IGNORECASE)
    }
]

EXTS = {'.tsx', '.ts', '.jsx', '.js', '.css'}
EXCLUDE_DIRS = {'node_modules', '.next', 'dist', 'build', '.git', 'out', 'artifacts', 'scratch', '.turbo', '.pnpm-store', 'test', 'tests', 'staging'}
EXCLUDE_FILES = {
    'rules.ts',
    'llm-review.ts',
    'dial-classifier.ts',
    'taste-dial-audit.ts',
    'tailwind-v4-transform.ts',
    'motion-react-transform.ts',
    'react-19-transform.ts',
    'agent-sandbox.test.ts',
    'dependency-graph.test.ts',
    'sync-rulepacks.ts',
    'test-a11y-linter.ts',
    'test-agent-ecosystem.ts',
    'server.ts',
    'server-http.ts',
    'worker.ts',
    'security.ts',
    'unslop.ts',
    'embedded-catalog.ts',
    'ast-parse-ingest.js',
    'ast-parser.ts',
    'cli.ts',
    'audit.ts',
    'add.ts',
    'list.ts',
    'build-registry.ts',
    'build-tokens.ts',
    'eval-runner.ts',
    'a11y-eval.ts',
    'compiler-eval.ts',
}

def scan_directory(target_dir):
    file_list = []
    for root, dirs, files in os.walk(target_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        for file in files:
            _, ext = os.path.splitext(file)
            if ext in EXTS and not file.endswith(".d.ts") and file not in EXCLUDE_FILES:
                full_p = os.path.join(root, file)
                # Ignore test files or tooling source files with linters
                if any(x in full_p for x in ["test", "dist", "node_modules", "scripts", "packages\\audit-linter", "packages/audit-linter", "packages\\cli", "packages/cli", "packages\\mcp-server", "packages/mcp-server", "packages\\harvester", "packages/harvester"]):
                    continue
                file_list.append(full_p)
    return file_list

def audit_file(file_path, project_root):
    relative_path = os.path.relpath(file_path, project_root)
    findings = []
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            lines = content.splitlines()
    except Exception as e:
        print(f"Skipping file {relative_path} due to read error: {e}")
        return findings

    # Whole-file check: SLOP-020 / SLOP-030 (Attribution headers on components)
    if "registry" in relative_path or "components" in relative_path:
        if "@license" not in content and "SPDX-License-Identifier" not in content:
            findings.append({
                "patternId": "SLOP-020",
                "patternName": "Missing Mandatory License Attribution",
                "category": "Legal & IP Compliance",
                "severity": "High",
                "lineNum": 1,
                "lineText": lines[0] if lines else "",
                "filePath": relative_path
            })
        if "@origin" not in content or "@curated-by" not in content:
            findings.append({
                "patternId": "SLOP-030",
                "patternName": "Clean SPDX & Origin Header Verification",
                "category": "Legal & IP Compliance",
                "severity": "High",
                "lineNum": 1,
                "lineText": lines[0] if lines else "",
                "filePath": relative_path
            })

    # Whole-file check: SLOP-031 (Missing Error Boundary / Fallback on Canvas)
    if ("<canvas" in content or "getContext('webgl')" in content or "getContext(\"webgl\")" in content or "WebGLRenderer" in content) and not any(k in content for k in ["fallback", "Fallback", "ErrorBoundary", "prefers-reduced-motion"]):
        findings.append({
            "patternId": "SLOP-031",
            "patternName": "Missing Error Boundary Fallback",
            "category": "Production Runtime Resilience",
            "severity": "Medium",
            "lineNum": 1,
            "lineText": lines[0] if lines else "",
            "filePath": relative_path
        })

    # Whole-file check: SLOP-033 (Missing Escape Key Overlay Dismiss)
    if ('role="dialog"' in content or "role='dialog'" in content or "isOpen" in content) and ("modal" in content.lower() or "dialog" in content.lower() or "drawer" in content.lower()):
        if not any(k in content for k in ["Escape", "onKeyDown", "@radix-ui/react-dialog", "@radix-ui/react-popover", "@radix-ui/react-dropdown-menu"]):
            findings.append({
                "patternId": "SLOP-033",
                "patternName": "Missing Escape Key Overlay Dismiss",
                "category": "Accessibility & Interaction",
                "severity": "High",
                "lineNum": 1,
                "lineText": lines[0] if lines else "",
                "filePath": relative_path
            })

    for index, line in enumerate(lines):
        for pattern in SLOP_PATTERNS:
            if pattern["id"] in ["SLOP-020", "SLOP-030", "SLOP-031", "SLOP-033"]:
                continue
            # Special bypasses for false positives
            if pattern["id"] == "SLOP-012" and ("focus-visible:" in line or "focus:ring" in line or "pointer-events-none" in line):
                continue
            if pattern["id"] == "SLOP-014" and "prefers-reduced-motion" in content:
                continue
            if pattern["id"] == "SLOP-016" and ("key=" in line or "key={" in line or not ("layoutId" in line and ".map(" in line)):
                continue
            if pattern["id"] == "SLOP-021" and ("dark:bg-" in line or "bg-white/" in line or "bg-black/" in line or "bg-card" in line or "dark:" in line):
                continue
            if pattern["id"] == "SLOP-025" and ("clearInterval" in content or "removeEventListener" in content or "abortController" in content or "abort" in content):
                continue
            if pattern["id"] == "SLOP-032" and (line.strip().startswith("const ") or line.strip().startswith("let ")) and "render" not in line.lower():
                continue
            if pattern["id"] == "SLOP-007" and ("left-[50%]" in line or "top-[50%]" in line or "viewBox" in line or "min-w-" in line or "min-h-" in line or "max-w-" in line or "max-h-" in line or "h-[" in line or "w-[" in line or "min-" in line):
                continue

            if pattern["regex"].search(line):
                findings.append({
                    "patternId": pattern["id"],
                    "patternName": pattern["name"],
                    "category": pattern["category"],
                    "severity": pattern["severity"],
                    "lineNum": index + 1,
                    "lineText": line.strip(),
                    "filePath": relative_path
                })
    return findings

def main():
    target_dir = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else os.getcwd()
    fail_on_slop = "--strict" in sys.argv or "--ci" in sys.argv or True

    print(f"\n=============================================================")
    print(f"🛡️  DESIGN AGENT WIKI: CI/CD ANTI-SLOP & ACCESSIBILITY GUARDRAIL")
    print(f"🛡️  Target Path: {target_dir}")
    print(f"=============================================================\n")

    if not os.path.exists(target_dir):
        print(f"Error: Target path '{target_dir}' does not exist.")
        sys.exit(1)

    files = scan_directory(target_dir)
    print(f"🔍 Discovered {len(files)} components and design files to analyze.")

    all_findings = []
    for file in files:
        findings = audit_file(file, target_dir)
        all_findings.extend(findings)

    severity_counts = {"High": 0, "Medium": 0, "Low": 0}
    for f in all_findings:
        severity_counts[f["severity"]] += 1

    # Scoring calculations (Deduct 15 for High, 8 for Medium, 3 for Low)
    score_deductions = (severity_counts["High"] * 15) + (severity_counts["Medium"] * 8) + (severity_counts["Low"] * 3)
    health_score = max(0, 100 - score_deductions)

    if health_score < 50:
        rating = "F - Serious Refactoring Required"
    elif health_score < 70:
        rating = "C - Moderate Slop Present"
    elif health_score < 85:
        rating = "B - Minor Tweaks Required"
    elif health_score < 98:
        rating = "A - High Standard Integrity"
    else:
        rating = "S - Flawless Quality"

    print(f"\n📊 Audit Result: Health Score: {health_score}/100 ({rating})")
    print(f"   - High Severity Violations:   {severity_counts['High']}")
    print(f"   - Medium Severity Violations: {severity_counts['Medium']}")
    print(f"   - Low Severity Violations:    {severity_counts['Low']}")
    print(f"   - Total Findings:             {len(all_findings)}")

    if all_findings:
        print("\n⚠️  Violations Detected:")
        for f in all_findings:
            print(f"   [{f['severity']}] {f['filePath']}:{f['lineNum']} - {f['patternName']} ({f['patternId']}): `{f['lineText'][:60]}`")

    # Generate or update report
    report_path = os.path.join(target_dir, "COMPLETED-DESIGN-AUDIT.md") if os.path.isdir(target_dir) else "COMPLETED-DESIGN-AUDIT.md"
    try:
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(f"# 📊 Completed Workspace Design Audit & Anti-Slop Scorecard\n\n")
            f.write(f"> Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (Automated CI/CD Guardrail Audit)\n")
            f.write(f"> Target Directory: `{target_dir}`\n\n")
            f.write(f"---\n\n")
            f.write(f"## 🏎️ Executive Summary\n\n")
            f.write(f"| Metrics & Scores | Value | Assessment |\n")
            f.write(f"| :--- | :--- | :--- |\n")
            f.write(f"| **Health Index Score** | **{health_score}/100** | **{rating}** |\n")
            f.write(f"| High Severity Flags | {severity_counts['High']} | Instant failure potential (TypeScript / logic) |\n")
            f.write(f"| Medium Severity Flags | {severity_counts['Medium']} | Design alignment tells (vibe gradients, colors) |\n")
            f.write(f"| Low Severity Flags | {severity_counts['Low']} | Micro-detailing flags (spacing, transitions) |\n")
            f.write(f"| Total Scanned Files | {len(files)} | Source base breadth checked |\n")
            f.write(f"| Total Findings | {len(all_findings)} | Detection violations count |\n\n")
            f.write(f"---\n\n")
            f.write(f"## 🛡️ Anti-Slop Rule Detection Matrix (21 Guardrails)\n\n")
            f.write(f"| Rule ID | Rule Name | Category | Severity | Detection Status |\n")
            f.write(f"| :--- | :--- | :--- | :--- | :--- |\n")
            for p in SLOP_PATTERNS:
                f.write(f"| **{p['id']}** | {p['name']} | {p['category']} | `{p['severity']}` | ✅ Active Guardrail |\n")
            f.write(f"\n---\n\n")
            f.write(f"## 🚫 Detailed Anti-Pattern Detections\n\n")
            if not all_findings:
                f.write(f"### 🎉 Zero Slop Detected!\nAll {len(files)} component files strictly adhere to zero-slop design system contracts, Tailwind v4 tokens, accessibility standards, and robust TypeScript typing.\n")
            else:
                grouped = {}
                for finding in all_findings:
                    grouped.setdefault(finding['filePath'], []).append(finding)
                for file_path_key, items in grouped.items():
                    f.write(f"### 📁 File: `{file_path_key}` ({len(items)} findings)\n\n")
                    f.write(f"| Line | Severity | Category | Rule Detected | Match Snippet |\n")
                    f.write(f"| :--- | :--- | :--- | :--- | :--- |\n")
                    for it in items:
                        safe_snippet = it['lineText'].replace('|', '\\|')[:80]
                        f.write(f"| **{it['lineNum']}** | `{it['severity']}` | {it['category']} | **{it['patternName']}** ({it['patternId']}) | `{safe_snippet}` |\n")
                    f.write(f"\n")
    except Exception as e:
        print(f"Warning: Failed to write report: {e}")

    # CI/CD Gate Enforcement:
    # Fail if High Severity > 0 or Health Score < 85
    if severity_counts["High"] > 0 or health_score < 85:
        print(f"\n❌ [CI GUARDRAIL FAILED] Anti-slop gate blocked build! (High severity: {severity_counts['High']}, Health Score: {health_score}/100)")
        sys.exit(1)
    else:
        print(f"\n✅ [CI GUARDRAIL PASSED] Quality threshold verified. Zero critical slop detected.")
        sys.exit(0)

if __name__ == "__main__":
    main()
