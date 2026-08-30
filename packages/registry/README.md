# 🎨 @design-wiki/registry

The curated core component registry and machine-first compiler for the **Machine-First Design Agent Wiki**.

Contains 112+ verified zero-slop UI components across 8 taxonomy domains, compiled to shadcn v3 JSON format (`/r/[name].json`), flat discovery manifests (`llms.txt`, `llms-full.txt`), and machine-readable markdown contracts (`/raw/components/[slug].md`).

---

## 🏷️ Taxonomy Domains (112 Components)

1. **AI-Native Primitives (`ui:primitive`, `ui:block`)**: `ai-prompt-input`, `ai-message-thread`, `ai-reasoning-foldout`, `ai-artifact-canvas`, `ai-chat-bubble`, `ai-model-selector`, `ai-token-meter`, `agent-step-pipeline`.
2. **Diagram Design System (`ui:editorial`, `ui:block`)**: 14 pure SVG diagrams based on Cathryn Lavery's 39 taxonomy (`architecture-topology-diagram`, `decision-tree-node-graph`, `venn-comparison-matrix`, `pyramid-hierarchy-chart`, `strategic-quadrant-matrix`, `timeline-roadmap-track`, `funnel-conversion-chart`, `matrix-grid-diagram`, `cycle-loop-diagram`, `fishbone-root-cause-diagram`, `radar-spider-chart`, `flowchart-process-graph`, `tree-hierarchy-map`, `inline-sparkline-chart`).
3. **Motion & Micro-Interactions (`ui:motion`)**: `morphing-dialog`, `sliding-number`, `border-trail`, `progressive-blur`, `view-transition-theme-toggle`, `text-shimmer-wave`, `counter-odometer`, `expandable-card`, `magnetic-badge`, `ripple-button`, `floating-dock`, `animated-tabs`.
4. **Procedural 3D & WebGL (`ui:creative`)**: `threejs-model-viewport`, `matrix-code-stream`, `dot-matrix-scoreboard`, `liquid-metal-shader`, `text-scrambler`, `ascii-rain`, `digital-ticker`, `cyber-hud-frame`, `hacker-decrypt`, `canvas-fluid-wave`.
5. **Enterprise Application (`ui:primitive`, `ui:block`)**: `reui-data-grid`, `draggable-kanban-board`, `event-calendar-view`, `stat-metric-card`, `filter-builder-toolbar`, `activity-feed-timeline`, `split-pane-layout`, `command-menu`.
6. **Programmatic Media (`ui:media`)**: `kinetic-title-card`, `karaoke-caption-stream`, `split-video-comparator`, `media-scrubber-timeline`, `waveform-audio-player`, `timeline-player`, `audio-visualizer`.
7. **SaaS Architecture Blocks (`ui:block`)**: `saas-hero-browser-mockup`, `interactive-feature-cycler`, `competitor-comparison-matrix`, `customer-story-masonry`, `integration-grid-showcase`, `cta-banner-geometric`, `stats-counter-banner`, `footer-mega-menu`, `bento-grid`, `hero-section`, `pricing-table`.
8. **Utility & Micro-Primitives (`ui:utility`, `ui:primitive`)**: `reui-animated-icons-pack`, `copy-button`, `scroll-progress-bar`, `theme-toggle-dropdown`, `button`, `input`, `dialog`, `tabs`, `switch`, `tooltip`, `card`, `badge`, `dot-loader`.

---

## 🛠️ Compiler Usage

```bash
# Compile all components into /r/ JSON and llms.txt
pnpm build:registry
```

---

## 📄 License & Attribution

All components are distributed under open-source licenses (MIT, Apache-2.0, BSD-3-Clause) with machine-readable `@origin`, `@license`, and `@curated-by` headers.
