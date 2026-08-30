#!/usr/bin/env python3
"""Verify corrected GitHub repository paths for shortlisted web-design resources."""
from __future__ import annotations

import concurrent.futures
import json
from pathlib import Path
import requests

REPOS = [
    "saadeghi/daisyui",
    "darkroomengineering/lenis",
    "primer/react",
    "primer/css",
    "Visual-Regression-Tracker/Visual-Regression-Tracker",
    "argyleink/gui-challenges",
    "timolins/react-hot-toast",
    "ariakit/ariakit",
    "zag-js/zag",
    "gamcoh/stytch-ui",
]


def fetch(repo: str) -> dict:
    r = requests.get(
        f"https://api.github.com/repos/{repo}",
        headers={"Accept": "application/vnd.github+json", "User-Agent": "web-design-gem-research/1.0"},
        timeout=20,
    )
    if r.status_code != 200:
        return {"repo": repo, "error": f"HTTP {r.status_code}"}
    x = r.json()
    return {
        "repo": repo,
        "url": x["html_url"],
        "description": x.get("description"),
        "stars": x.get("stargazers_count"),
        "forks": x.get("forks_count"),
        "license": (x.get("license") or {}).get("spdx_id"),
        "pushed_at": x.get("pushed_at"),
        "archived": x.get("archived"),
        "topics": x.get("topics", []),
    }

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    rows = list(pool.map(fetch, REPOS))
Path("/home/ubuntu/github_web_design_gems_corrected.json").write_text(
    json.dumps(rows, indent=2) + "\n", encoding="utf-8"
)
print(json.dumps(rows, indent=2))
