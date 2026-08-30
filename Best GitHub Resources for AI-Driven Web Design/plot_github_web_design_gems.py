#!/usr/bin/env python3
"""Create a compact category-distribution chart from screened GitHub gems."""
from __future__ import annotations

import json
from pathlib import Path

import matplotlib.pyplot as plt

source = json.loads(Path('/home/ubuntu/github_web_design_gems_screened.json').read_text(encoding='utf-8'))
summary = source['category_summary']
rows = sorted(summary.items(), key=lambda pair: pair[1]['count'], reverse=True)
labels = [name.replace(' and ', ' & ') for name, _ in rows]
counts = [data['count'] for _, data in rows]
active = [data['active_90d'] for _, data in rows]

plt.style.use('seaborn-v0_8-whitegrid')
fig, ax = plt.subplots(figsize=(10.4, 6.4), dpi=180)
y = range(len(labels))
ax.barh(y, counts, color='#2563eb', height=0.7, label='Screened repositories')
ax.barh(y, active, color='#22c55e', height=0.36, label='Active within 90 days')
ax.set_yticks(list(y), labels, fontsize=9)
ax.invert_yaxis()
ax.set_xlabel('Repository count')
ax.set_title('AI-Assisted Web Design GitHub Gems: Breadth and Recent Activity', loc='left', fontweight='bold', fontsize=14)
ax.set_xlim(0, max(counts) + 1.1)
for i, (total, recent) in enumerate(zip(counts, active)):
    ax.text(total + 0.08, i + 0.14, str(total), va='center', fontsize=9, color='#1f2937', fontweight='bold')
    ax.text(recent + 0.08, i - 0.17, str(recent), va='center', fontsize=8, color='#166534')
ax.legend(loc='lower right', frameon=True)
fig.text(0.125, 0.01, 'Metadata collected 30 Aug 2026. “Active” = last GitHub push within 90 days.', fontsize=8, color='#4b5563')
plt.tight_layout(rect=(0, 0.03, 1, 1))
output = '/home/ubuntu/github_web_design_gems_category_chart.png'
fig.savefig(output, bbox_inches='tight')
print(output)
