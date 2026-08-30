---
name: "enterprise-design-systems"
description: "High-density B2B application architecture, multi-pane layouts, bulk resource tables, facet filtering, and keyboard-first power workflows."
version: "1.0.0"
freshness: "2026-08-31"
dials:
  DESIGN_VARIANCE: 3
  MOTION_INTENSITY: 2
  VISUAL_DENSITY: 9
---

# Enterprise Design Systems Playbook
*Synthesized from Shopify Polaris, IBM Carbon, AWS Cloudscape, and Microsoft Fluent UI.*

Enterprise and B2B SaaS applications require ultra-high information density, rapid keyboard traversal, bulk data manipulations, and strict accessibility compliance.

---

## 1. Information Density Architecture

In enterprise dashboards, whitespace must be controlled and functional:
- **Table Cell Padding**: Use compact padding (`px-3 py-2` or `px-4 py-2.5`) with 12px text (`text-xs`).
- **Status Strips & Badges**: Display multi-dimensional statuses using low-saturation pill indicators with semantic border tokens (`border-emerald-500/20 bg-emerald-500/10 text-emerald-500`).
- **Monospace Alignments**: Align SKU numbers, currency values, dates, and IP addresses using `font-mono` with right-aligned tabular numerals.

---

## 2. Multi-Pane & Master-Detail Patterns

```
┌─────────────────┬───────────────────────────────┬─────────────────┐
│  Sidebar Nav    │        Resource Table         │ Context Drawer  │
│ (Hierarchical)  │  (Bulk Actions, Pagination)   │ (Item Details)  │
│                 │                               │                 │
│ - Inventory     │ [x] SKU-001  Active   $49.00  │ SKU-001 Meta    │
│ - Orders        │ [x] SKU-002  Low-Stk  $12.50  │ Telemetry Log   │
│ - Telemetry     │ [ ] SKU-003  Pending  $99.00  │ Edit Parameters │
└─────────────────┴───────────────────────────────┴─────────────────┘
```

- **Persistent Sidebar Shell**: Use `<AppShellSidebarLayout>` with collapsible navigation tiers.
- **Bulk Action Toolbar**: When rows are selected, render an action bar for batch export, status changes, and deletion.
- **Contextual Side Drawer**: Open an `<AgentInspectorDrawer>` or side sheet rather than modal overlays when users need to maintain page context while editing sub-records.

---

## 3. Recommended Enterprise Primitives Matrix

| Enterprise Requirement | Recommended Agent Wiki Component |
| :--- | :--- |
| **Inventory / Resource Management** | `<ResourceInventoryList>` (`ui:editorial`) |
| **Faceted Filter Toolbar** | `<FacetedFilterBar>` (`ui:primitive`) |
| **Cohort & Retention Analysis** | `<CohortRetentionHeatmap>` (`ui:editorial`) |
| **High-Volume Search Dropdown** | `<ComboboxVirtualized>` (`ui:primitive`) |
| **Multi-Stage Operational Pipeline** | `<ProgressWizardStepper>` (`ui:primitive`) |
| **Data Flow & DAG Graph** | `<DataPipelineCanvas>` (`ui:workflow`) |
