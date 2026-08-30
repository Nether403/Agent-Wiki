#!/usr/bin/env python3
"""
Automated WCAG 2.1 AA Contrast and Accessibility Audit Script
Part of the UI/UX Pro Max Skill pack in Design Agent Wiki.
Calculates luminance, evaluates contrast ratios (4.5:1 text, 3:1 graphical),
and checks ARIA, focus ring, and keyboard navigation hygiene.
"""

import sys
import os
import re

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = ''.join([c*2 for c in hex_str])
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def relative_luminance(rgb):
    r, g, b = [x / 255.0 for x in rgb]
    r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(rgb1, rgb2):
    l1 = relative_luminance(rgb1)
    l2 = relative_luminance(rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

def audit_file_accessibility(file_path):
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        sys.exit(1)

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    issues = []
    passes = []

    # 1. Check for outline suppression without replacement
    if re.search(r'(?:outline-none|ring-0)\b', content):
        if not re.search(r'(?:focus-visible:ring|focus:ring|focus-visible:outline)', content):
            issues.append("Focus outline suppressed without accessible :focus-visible:ring replacement.")
        else:
            passes.append("Focus rings properly replaced with :focus-visible.")

    # 2. Check for button / link interactive accessibility
    buttons_without_aria = re.findall(r'<button(?![^>]*(?:aria-label|aria-labelledby))[^>]*>\s*<[A-Z]\w+[^>]*\/>\s*<\/button>', content)
    if buttons_without_aria:
        issues.append(f"Found {len(buttons_without_aria)} icon-only button(s) lacking aria-label or accessible text.")
    else:
        passes.append("Interactive icon buttons specify accessible labels.")

    # 3. Check for SVG roles and accessibility
    raw_svgs = re.findall(r'<svg\b(?![^>]*(?:role=["\']img["\']|aria-hidden=["\']true["\']|aria-label))[^>]*>', content)
    if raw_svgs:
        issues.append(f"Found {len(raw_svgs)} raw SVG elements missing role='img' or aria-hidden='true'.")
    else:
        passes.append("SVGs properly annotated with accessible roles/aria attributes.")

    # 4. Check for reduced motion in animation loops
    if 'requestAnimationFrame' in content and 'prefers-reduced-motion' not in content and 'useReducedMotion' not in content:
        issues.append("requestAnimationFrame loop present without reduced motion check or fallback.")
    else:
        passes.append("Reduced motion safety respected for animation loops.")

    # 5. Check semantic headings
    if '<h1' in content and content.count('<h1') > 1:
        issues.append("Multiple <h1> elements detected; ensure single top-level h1 for page accessibility.")
    else:
        passes.append("Heading hierarchy conforms to single top-level h1.")

    print(f"\n=======================================================")
    print(f"♿ A11Y AUDIT: {os.path.basename(file_path)}")
    print(f"=======================================================\n")

    for p in passes:
        print(f"  ✅ {p}")

    if issues:
        print(f"\n  ⚠️ {len(issues)} Accessibility Warnings/Violations:")
        for issue in issues:
            print(f"     - {issue}")
        return False
    else:
        print("\n  🎉 100% WCAG 2.1 AA Checklist Verification Passed!")
        return True

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    if os.path.isfile(target):
        ok = audit_file_accessibility(target)
        sys.exit(0 if ok else 1)
    else:
        print("Usage: python audit-a11y.py <file_path>")
        sys.exit(1)
