# Visualisations

This directory is the starting point for the multiple visual projections described in Memo 1.

## Goal

Structurizr remains the source of truth for the architecture model, while additional renderers provide different ways to inspect and understand it.

The intended decomposition is:

- Structurizr 2D: architectural structure and relationships
- SVG: state, lifecycle, process, regional, and other domain-specific views
- Three.js 3D: spatial exploration, semantic zoom, and ADR-aware navigation

## Early structure

The repository is being prepared to support the following layout:

```text
doc/architecture/
├── workspace.dsl
├── workspace.json
├── themes/
│   └── kami/
│       ├── README.md
│       └── theme.json
├── visualisations/
│   └── README.md
├── decisions/
└── ...
```

## Design principle

The visual system should preserve both meaning and context. That means the architecture should remain legible while additional detail is revealed, rather than replacing the surrounding model with a new diagram.

This is the foundation for semantic zoom, region-aware grouping, and decision-aware exploration.
