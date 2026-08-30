---
name: "content-first-architecture"
description: "Patterns for data-rich interfaces, academic publication showcases, research portfolios, and SVG conceptual diagrams."
version: "1.0.0"
freshness: "2026-08-30"
dials:
  DESIGN_VARIANCE: 6
  MOTION_INTENSITY: 2
  VISUAL_DENSITY: 7
---

# Content-First Interface Architecture Playbook
*Synthesized from HugoBlox, Cathryn Lavery Diagram Design, and Academic Web Patterns.*

When building interfaces for research labs, editorial publications, developer wikis, or analytical portfolios, readability, information density, and precise diagrammatic models supersede decorative visual fluff.

---

## 1. Editorial Hierarchy & Typographic Scale

Content-first pages require high typographic contrast and restrained, semantic color palettes:

- **Monospace Accents**: Use `font-mono` for metadata tags, version pills, publication dates, and metric counters.
- **Asymmetrical Section Headers**: Combine bold title typography with subtle, secondary rule lines and stage numbers (`Step 01`, `Pillar A`).
- **Semantic Badges**: Use low-saturation background tints (`bg-primary/10 text-primary border-primary/20`) rather than bright fluorescent solids.

---

## 2. Diagrammatic Blueprint Selection Matrix

Always replace generic bullet lists with an audited visual conceptual diagram:

| Cognitive Model | Best Component | Appropriate Use Case |
| :--- | :--- | :--- |
| **Self-Reinforcing Loops** | `flywheel-momentum-diagram` | Growth engines, continuous CI/CD pipelines, compounding effects |
| **Set Overlap & Convergence** | `venn-three-circle-diagram` | Core value propositions, multi-disciplinary intersections |
| **Linear Pipeline / Stages** | `value-chain-map` | Operational workflows, compiler passes, manufacturing/data chains |
| **Surface vs. Root Cause** | `iceberg-depth-diagram` | Problem statements, architecture breakdowns, vulnerability roots |
| **Systemic Topology** | `architecture-topology-diagram` | Cloud infrastructure, microservice networks, agent communication |

---

## 3. Publication & Research Showcase Discipline
- **DOI & BibTeX**: Every academic entry must offer direct links to verified DOI handles and copy-to-clipboard BibTeX citations.
- **Collapsible Abstracts**: Long abstracts must be truncated with accessible toggle controls (`aria-expanded`) to preserve viewport rhythm.
- **Accessible Math & Equations**: Format mathematical formulas with KaTeX or semantic MathML tags.
