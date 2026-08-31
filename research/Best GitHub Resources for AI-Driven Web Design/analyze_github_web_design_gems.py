#!/usr/bin/env python3
"""Score collected GitHub repository metadata for shortlist generation."""
from __future__ import annotations

import json
import math
from datetime import datetime, timezone
from pathlib import Path

NOW = datetime(2026, 8, 30, tzinfo=timezone.utc)

CATEGORY = {
    "anthropics/skills": "Agent skills",
    "vercel-labs/agent-skills": "Agent skills",
    "MengTo/Skills": "Agent skills",
    "nextlevelbuilder/ui-ux-pro-max-skill": "Agent skills",
    "plugin87/ux-ui-agent-skills": "Agent skills",
    "julianoczkowski/designer-skills": "Agent skills",
    "jakubkrehel/skills": "Agent skills",
    "maxbogo/awesome-ai-tools-for-ui": "Discovery index",
    "abi/screenshot-to-code": "Design-to-code",
    "bernaferrari/FigmaToCode": "Design-to-code",
    "BuilderIO/builder": "Visual development",
    "webstudio-is/webstudio": "Visual development",
    "buildingopen/openpage": "Visual development",
    "chaibuilder/sdk": "Visual development",
    "shadcn-ui/ui": "Component library",
    "radix-ui/primitives": "Accessible primitives",
    "tailwindlabs/headlessui": "Accessible primitives",
    "adobe/react-spectrum": "Accessible primitives",
    "chakra-ui/ark": "Accessible primitives",
    "mui/material-ui": "Component library",
    "chakra-ui/chakra-ui": "Component library",
    "mantinedev/mantine": "Component library",
    "ant-design/ant-design": "Component library",
    "heroui-inc/heroui": "Component library",
    "primefaces/primereact": "Component library",
    "tremorlabs/tremor": "Component library",
    "magicuidesign/magicui": "UI blocks and effects",
    "PageAI-Pro/page-ui": "UI blocks and effects",
    "launch-ui/launch-ui": "UI blocks and effects",
    "codse/animata": "UI blocks and effects",
    "paper-design/shaders": "UI blocks and effects",
    "motiondivision/motion": "Motion and interaction",
    "greensock/GSAP": "Motion and interaction",
    "pmndrs/react-three-fiber": "Motion and interaction",
    "pmndrs/drei": "Motion and interaction",
    "tsparticles/tsparticles": "Motion and interaction",
    "xyflow/xyflow": "Interactive UI",
    "excalidraw/excalidraw": "Interactive UI",
    "tldraw/tldraw": "Interactive UI",
    "style-dictionary/style-dictionary": "Tokens and design systems",
    "tokens-studio/figma-plugin": "Tokens and design systems",
    "carbon-design-system/carbon": "Tokens and design systems",
    "microsoft/fluentui": "Tokens and design systems",
    "cloudscape-design/components": "Tokens and design systems",
    "lucide-icons/lucide": "Icons and assets",
    "iconify/iconify": "Icons and assets",
    "tabler/tabler-icons": "Icons and assets",
    "iconoir-icons/iconoir": "Icons and assets",
    "storybookjs/storybook": "Design workflow and QA",
    "microsoft/playwright": "Design workflow and QA",
    "dequelabs/axe-core": "Design workflow and QA",
    "GoogleChrome/lighthouse": "Design workflow and QA",
    "garris/BackstopJS": "Design workflow and QA",
}


def score(item: dict) -> float:
    # Simple transparent screening score; it is not a measure of code quality.
    stars = item.get("stars", 0)
    adoption = min(math.log10(stars + 1) / 5.5, 1.0) * 55
    days_old = (NOW - datetime.fromisoformat(item["pushed_at"].replace("Z", "+00:00"))).days
    freshness = 25 if days_old <= 30 else 18 if days_old <= 90 else 11 if days_old <= 180 else 5 if days_old <= 365 else 0
    license = item.get("license")
    license_score = 10 if license in {"MIT", "Apache-2.0", "BSD-3-Clause", "MPL-2.0"} else 4 if license == "GPL-3.0" else 0
    community = min(item.get("forks", 0) / 1000, 1.0) * 10
    return round(adoption + freshness + license_score + community, 1)


rows = []
for path in ["/home/ubuntu/github_web_design_gems_metadata.json", "/home/ubuntu/github_web_design_gems_corrected.json"]:
    loaded = json.loads(Path(path).read_text(encoding="utf-8"))
    values = loaded["repositories"] if isinstance(loaded, dict) else loaded
    rows.extend(item for item in values if "error" not in item and not item.get("archived"))

# Keep one row per canonical GitHub URL, favor the corrected check which has fewer fields only when absent.
deduped = {}
for item in rows:
    key = item["url"].lower()
    existing = deduped.get(key, {})
    deduped[key] = existing | item

ranked = []
for item in deduped.values():
    repo = item["repo"]
    if repo not in CATEGORY:
        continue
    item["category"] = CATEGORY[repo]
    item["screening_score"] = score(item)
    item["days_since_push"] = (NOW - datetime.fromisoformat(item["pushed_at"].replace("Z", "+00:00"))).days
    ranked.append(item)
ranked.sort(key=lambda x: (x["category"], -x["screening_score"], -x["stars"]))

summary = {}
for item in ranked:
    bucket = summary.setdefault(item["category"], {"count": 0, "median_stars": [], "active_90d": 0, "open_license": 0})
    bucket["count"] += 1
    bucket["median_stars"].append(item["stars"])
    bucket["active_90d"] += int(item["days_since_push"] <= 90)
    bucket["open_license"] += int(item.get("license") in {"MIT", "Apache-2.0", "BSD-3-Clause", "MPL-2.0", "GPL-3.0", "AGPL-3.0"})
for item in summary.values():
    values = sorted(item["median_stars"])
    item["median_stars"] = values[len(values) // 2]

out = {"shortlist_count": len(ranked), "repositories": ranked, "category_summary": summary}
Path("/home/ubuntu/github_web_design_gems_screened.json").write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")

lines = ["# Screened GitHub Web Design Gems", "", "| Category | Repos | Median stars | Active ≤90 days | Repos with explicit open license |", "|---|---:|---:|---:|---:|"]
for category, x in sorted(summary.items()):
    lines.append(f"| {category} | {x['count']} | {x['median_stars']:,} | {x['active_90d']} | {x['open_license']} |")
lines += ["", "| Repository | Category | Stars | Last push age (days) | License | Screening score |", "|---|---|---:|---:|---|---:|"]
for item in sorted(ranked, key=lambda x: -x["screening_score"]):
    lines.append(f"| [{item['repo']}]({item['url']}) | {item['category']} | {item['stars']:,} | {item['days_since_push']} | {item.get('license') or 'not declared'} | {item['screening_score']:.1f} |")
Path("/home/ubuntu/github_web_design_gems_screening.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(json.dumps({"shortlist_count": len(ranked), "categories": summary}, indent=2))
