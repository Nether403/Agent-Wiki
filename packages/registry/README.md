# 🎨 @design-wiki/registry

The curated core component registry and machine-first compiler for the **Machine-First Design Agent Wiki**.

Contains 112+ verified zero-slop UI components across 8 taxonomy domains, compiled to shadcn v3 JSON format (`/r/[name].json`), flat discovery manifests (`llms.txt`, `llms-full.txt`), and machine-readable markdown contracts (`/raw/components/[slug].md`).

---

## 🏷️ Taxonomy Domains (192 Components)

1. **AI-Native Primitives (`ui:ai-native`)**: `ai-chat-bubble`, `ai-reasoning-foldout`, `ai-prompt-input`, `ai-token-meter`, `ai-artifact-canvas`, `ai-model-selector`, `ai-human-in-the-loop-diff`, `ai-artifact-sandbox-iframe`, `ai-tool-call-card`, `ai-voice-orb`.
2. **Workflow & Canvas System (`ui:workflow`)**: `agent-node-graph`, `agent-inspector-drawer`, `workflow-minimap-controls`, `data-pipeline-canvas`, `decision-node-canvas`, `embedded-whiteboard`, `agent-step-pipeline`.
3. **Diagram Design System (`ui:editorial`)**: Strategic SVG diagrams based on Cathryn Lavery's taxonomy (`flywheel-momentum-diagram`, `venn-three-circle-diagram`, `value-chain-map`, `iceberg-depth-diagram`, `matrix-grid-diagram`, `pyramid-hierarchy-chart`, `timeline-roadmap-track`).
4. **Analytical Data & Metrics (`ui:editorial`)**: `comparative-bar-list`, `tracker-status-strip`, `stat-metric-card`, `dot-matrix-scoreboard`, `stats-counter-banner`.
5. **Motion & Micro-Interactions (`ui:motion`)**: `number-ticker`, `sparkles-text`, `border-beam`, `particle-burst-button`, `morphing-dialog`, `sliding-number`, `scratch-to-reveal-card`, `smooth-scroll-provider`, `spring-dialog`, `dock-magnification`, `floating-dock`.
6. **Procedural 3D & WebGL (`ui:creative`)**: `paper-mesh-shader`, `aurora-background-shader`, `grain-noise-shader`, `three-interactive-scene`, `matrix-code-stream`, `liquid-metal-shader`, `canvas-fluid-wave`, `dither-noise-card`.
7. **Enterprise Application (`ui:primitive`, `ui:block`)**: `reui-data-grid`, `draggable-kanban-board`, `event-calendar-view`, `filter-builder-toolbar`, `split-pane-layout`, `command-menu`.
8. **Programmatic Media (`ui:media`)**: `kinetic-title-card`, `karaoke-caption-stream`, `split-video-comparator`, `media-scrubber-timeline`, `waveform-audio-player`, `activity-feed-timeline`.
9. **SaaS Architecture Blocks (`ui:block`)**: `saas-hero-browser-mockup`, `interactive-feature-cycler`, `competitor-comparison-matrix`, `customer-story-masonry`, `integration-grid-showcase`, `cta-banner-geometric`, `pricing-table`, `bento-grid`.
10. **Headless & Utility Primitives (`ui:primitive`, `ui:utility`)**: `color-picker-primitive`, `date-range-picker-popover`, `roving-tab-list`, `split-button`, `reui-animated-icons-pack`, `copy-button`, `theme-toggle-dropdown`, `button`, `input`, `dialog`, `tabs`, `switch`, `tooltip`.

---

## 🛠️ Compiler Usage

```bash
# Compile all components into /r/ JSON and llms.txt
pnpm build:registry
```

---

## 📄 License & Attribution

All components are distributed under open-source licenses (MIT, Apache-2.0, BSD-3-Clause) with machine-readable `@origin`, `@license`, and `@curated-by` headers.
