#!/usr/bin/env python3
"""Fetch public GitHub metadata for candidate AI-assisted web design repositories."""
from __future__ import annotations

import concurrent.futures
import json
import os
import time
from pathlib import Path

import requests

REPOS = [
    # Agent skills and curated discovery
    "MengTo/Skills", "vercel-labs/agent-skills", "anthropics/skills",
    "julianoczkowski/designer-skills", "plugin87/ux-ui-agent-skills",
    "nextlevelbuilder/ui-ux-pro-max-skill", "jakubkrehel/skills",
    "mblode/agent-skills", "maxbogo/awesome-ai-tools-for-ui",
    # Design-to-code and visual builders
    "abi/screenshot-to-code", "bernaferrari/FigmaToCode", "BuilderIO/builder",
    "webstudio-is/webstudio", "buildingopen/openpage", "chaibuilder/sdk",
    # Component libraries and primitives
    "shadcn-ui/ui", "radix-ui/primitives", "tailwindlabs/headlessui",
    "adobe/react-spectrum", "chakra-ui/ark", "mui/material-ui",
    "chakra-ui/chakra-ui", "mantinedev/mantine", "ant-design/ant-design",
    "heroui-inc/heroui", "daisyui/daisyui", "primefaces/primereact",
    "tremorlabs/tremor",
    # Block and showcase libraries
    "magicuidesign/magicui", "aceternity/aceternity-ui", "PageAI-Pro/page-ui",
    "launch-ui/launch-ui", "codse/animata", "paper-design/shaders",
    # Motion and interactive UI
    "motiondivision/motion", "greensock/GSAP", "pmndrs/react-three-fiber",
    "pmndrs/drei", "studio-freight/lenis", "tsparticles/tsparticles",
    "xyflow/xyflow", "excalidraw/excalidraw", "tldraw/tldraw",
    # Design systems, tokens, and icons
    "style-dictionary/style-dictionary", "tokens-studio/figma-plugin",
    "github/primer", "carbon-design-system/carbon", "microsoft/fluentui",
    "shopify/polaris", "cloudscape-design/components", "lucide-icons/lucide",
    "iconify/iconify", "tabler/tabler-icons", "iconoir-icons/iconoir",
    # QA and developer workflows
    "storybookjs/storybook", "microsoft/playwright", "dequelabs/axe-core",
    "GoogleChrome/lighthouse", "garris/BackstopJS",
    "Visual-Regression-Tracker/VisualRegressionTracker",
]

API = "https://api.github.com/repos/{}"
HEADERS = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "web-design-gem-research/1.0",
}
if os.getenv("GITHUB_TOKEN"):
    HEADERS["Authorization"] = f"Bearer {os.environ['GITHUB_TOKEN']}"


def get_repo(full_name: str) -> dict:
    for attempt in range(3):
        try:
            response = requests.get(API.format(full_name), headers=HEADERS, timeout=20)
            if response.status_code == 200:
                raw = response.json()
                return {
                    "repo": full_name,
                    "url": raw["html_url"],
                    "description": raw.get("description"),
                    "stars": raw.get("stargazers_count"),
                    "forks": raw.get("forks_count"),
                    "open_issues": raw.get("open_issues_count"),
                    "language": raw.get("language"),
                    "license": (raw.get("license") or {}).get("spdx_id"),
                    "created_at": raw.get("created_at"),
                    "updated_at": raw.get("updated_at"),
                    "pushed_at": raw.get("pushed_at"),
                    "archived": raw.get("archived"),
                    "homepage": raw.get("homepage"),
                    "topics": raw.get("topics", []),
                }
            return {"repo": full_name, "error": f"HTTP {response.status_code}: {response.text[:180]}"}
        except requests.RequestException as exc:
            if attempt == 2:
                return {"repo": full_name, "error": str(exc)}
            time.sleep(1.5 * (attempt + 1))
    return {"repo": full_name, "error": "unreachable"}


def main() -> None:
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(get_repo, REPOS))
    results.sort(key=lambda entry: ("error" in entry, -(entry.get("stars") or 0)))
    output = {
        "collected_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "requested_count": len(REPOS),
        "successful_count": sum("error" not in x for x in results),
        "failed_count": sum("error" in x for x in results),
        "repositories": results,
    }
    Path("/home/ubuntu/github_web_design_gems_metadata.json").write_text(
        json.dumps(output, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({k: output[k] for k in ["collected_at_utc", "requested_count", "successful_count", "failed_count"]}, indent=2))
    for item in results:
        if "error" in item:
            print(f"FAILED\t{item['repo']}\t{item['error']}")


if __name__ == "__main__":
    main()
