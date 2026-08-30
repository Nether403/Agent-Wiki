#!/usr/bin/env python3
import os
import sys
import re
from datetime import datetime

# Define standard anti-pattern matching rules
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
        "description": "Use of the classic, overdone gradient (from-purple-500 to-blue-500) that signals generic AI-generated backgrounds.",
        "regex": re.compile(r"from-purple-500\s+to-blue-500|bg-gradient-to-[r|tr|tl|b]\s+from-fuchsia|bg-gradient-to-[r|tr|tl|b]\s+from-purple", re.IGNORECASE)
    },
    {
        "id": "SLOP-003",
        "name": "Glassmorphism Background Defaults",
        "severity": "Low",
        "category": "Styling & Color Palette",
        "description": "Ad-hoc glassmorphism (bg-white/10 backdrop-blur-md) across blocks instead of structural variables.",
        "regex": re.compile(r"bg-white/10\s+backdrop-blur|bg-white/5\s+backdrop-blur", re.IGNORECASE)
    },
    {
        "id": "SLOP-004",
        "name": "Chained Type Assertions",
        "severity": "High",
        "category": "Code Quality",
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
        "name": "Arbitrary Sizing Overrides",
        "severity": "Low",
        "category": "Layout & Spacing",
        "description": "Use of non-standard arbitrary units (e.g., p-[17px], m-[11px]) instead of system-standard Tailwind tokens.",
        "regex": re.compile(r"(?:p|m|gap|w|h|top|left|right|bottom)-\[(?:\d+px|\d+rem)\]", re.IGNORECASE)
    },
    {
        "id": "SLOP-008",
        "name": "Decorative Emojis inside Cards/Buttons",
        "severity": "Medium",
        "category": "Typography & Iconography",
        "description": "Emojis used as icons inside interactive layout blocks instead of typed semantic SVGs or Lucide items.",
        "regex": re.compile(r"<span>\s*[\uD800-\uDBFF][\uDC00-\uDFFF]\s*</span>|<li>\s*[\uD800-\uDBFF][\uDC00-\uDFFF]", re.IGNORECASE)
    }
]

EXTS = {'.tsx', '.ts', '.jsx', '.js', '.css', '.html'}
EXCLUDE_DIRS = {'node_modules', '.next', 'dist', 'build', '.git', 'out', 'artifacts', 'scratch'}

def scan_directory(target_dir):
    file_list = []
    for root, dirs, files in os.walk(target_dir):
        # Exclude directories in-place to prevent scanning them
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for file in files:
            _, ext = os.path.splitext(file)
            if ext in EXTS:
                file_list.append(os.path.join(root, file))
    return file_list

def audit_file(file_path, project_root):
    relative_path = os.path.relpath(file_path, project_root)
    findings = []
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Skipping file {relative_path} due to read error: {e}")
        return findings

    for index, line in enumerate(lines):
        for pattern in SLOP_PATTERNS:
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
    target_dir = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    print(f"Starting Modern UI & Anti-Slop Audit...")
    print(f"Scanning path: {target_dir}")

    if not os.path.exists(target_dir):
        print(f"Error: Target path '{target_dir}' does not exist.")
        sys.exit(1)

    files = scan_directory(target_dir)
    print(f"Discovered {len(files)} design or code files to analyze.")

    all_findings = []
    for file in files:
        findings = audit_file(file, target_dir)
        all_findings.extend(findings)

    print(f"Analysis complete. Found {len(all_findings)} violations/patterns.")

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

    # Compile report markdown content
    report = f"""# 📊 Completed Workspace Design Audit & Anti-Slop Scorecard
> Generated on: {datetime.now().strftime("%Y-%m-%d")} (Automated Audit Task)
> Target Workspace: `{target_dir}`

---

## 🏎️ Executive Summary

| Metrics & Scores | Value | Assessment |
| :--- | :--- | :--- |
| **Health Index Score** | **{health_score}/100** | **{rating}** |
| High Severity Flags | {severity_counts["High"]} | Instant failure potential (TypeScript/logic) |
| Medium Severity Flags | {severity_counts["Medium"]} | Design alignment tells (vibe gradients, colors) |
| Low Severity Flags | {severity_counts["Low"]} | Micro-detailing flags (spacing, transitions) |
| Total Scanned Files | {len(files)} | Source base breadth checked |

---

## 🚫 Detailed Anti-Pattern Detections

"""

    if not all_findings:
        report += "### 🎉 Zero Slop Detected!\nAll components align perfectly with clean patterns. Excellent engineering hygiene!\n"
    else:
        # Group by file
        grouped_by_file = {}
        for f in all_findings:
            path_key = f["filePath"]
            if path_key not in grouped_by_file:
                grouped_by_file[path_key] = []
            grouped_by_file[path_key].append(f)

        for file_path, findings in grouped_by_file.items():
            report += f"### 📁 File: `{file_path}` ({len(findings)} findings)\n\n"
            report += "| Line | Severity | Category | Rule Detected | Match Snippet |\n"
            report += "| :--- | :--- | :--- | :--- | :--- |\n"
            for f in findings:
                # Escape pipes in markdown text block
                safe_snippet = f["lineText"].replace("|", "\\|")[:80]
                report += f"| **{f['lineNum']}** | `{f['severity']}` | {f['category']} | **{f['patternName']}** ({f['patternId']}) | `{safe_snippet}` |\n"
            report += "\n"

    report += """
---

## 🛠️ Recommended Redesign Recipes

Based on your scanned files, here are your target action blocks:
"""

    if severity_counts["High"] > 0:
        report += """
### 🔴 Priority 1: Repair TS/JS Code Quality Rules
- Ensure all chained type assertions (`as any as`) are replaced with explicit utility types or TypeScript function overloads.
- Re-write conditional object spreads (`...(... ? {...} : {})`) using standard fallback mappings.
"""

    if severity_counts["Medium"] > 0:
        report += """
### 🟡 Priority 2: Align Styling with Design-System Variables
- Replace explicit color styles (`bg-indigo-600` or hex colors) with Tailwind standard CSS properties (e.g., `bg-primary`, `text-primary-foreground`).
- Migrate linear purple-to-blue gradients over to sophisticated flat surfaces accented with structural border rules.
"""

    if severity_counts["Low"] > 0:
        report += """
### 🟢 Priority 3: Polish Fluid Animations & Spatial Ratios
- Audit global `transition-all` variables. Narrow down transitions solely to variables that actually animate (e.g., `transition-colors` or `transition-transform`).
- Convert custom manual arbitrary offsets (like `p-[17px]`) into standard system steps (`p-4` or `p-5`).
"""

    # Write report
    output_report_path = os.path.join(target_dir, "COMPLETED-DESIGN-AUDIT.md")
    with open(output_report_path, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"\nSuccessfully created design audit report at: {output_report_path}")
    print("You can open this report to view targeted code violations with exact line numbers!")

if __name__ == "__main__":
    main()
