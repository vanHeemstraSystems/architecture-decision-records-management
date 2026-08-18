# Kami Architecture Theme

This directory establishes the first implementation step described in Memo 1: a shared visual language for the architecture model.

## Purpose

The repository already contains a Structurizr-based architecture model and ADRs. The next step is not to replace Structurizr, but to define a shared design system that all renderers can respect.

This module introduces a canonical warm, editorial visual palette and the guiding principle behind the project:

- one architecture model
- one architectural history
- multiple visual projections

## Tokens

The values in the theme JSON are intentionally conservative and consistent with the memo:

- warm parchment as the canvas
- ink blue as the primary emphasis
- neutral borders and muted surfaces
- restrained typography and spacing
- soft geometry without harsh diagramming conventions

## Compliance model

This theme is designed to support the three levels described in Memo 1:

1. Kami Native for SVG and direct HTML renderers
2. Kami Adapted for Structurizr-native views
3. Kami Spatial for Three.js-driven exploration

## Files

- `theme.json`: machine-readable design tokens and style definitions
- `theme.dsl`: Structurizr DSL defining styles that can be exported as a Structurizr theme

## Exporting the Theme

To export the theme.dsl as a Structurizr-compatible theme:

```bash
# Install Structurizr CLI (requires Java)
# https://github.com/structurizr/cli

# Export the theme
structurizr export \
  -workspace theme.dsl \
  -format theme
```

This generates a `theme.json` in Structurizr's native format, which can be imported into other workspaces.

## Using the Theme

Import this theme in your workspace.dsl:

```
workspace {
    !include ./themes/kami/theme.json
    
    model { ... }
    views { ... }
}
```

## Next steps

This is the Phase 1 foundation. The next evolutionary steps are:

- **Phase 2**: region/group styling for architectural regions
- **Phase 3**: context-preserving drilldown conventions
- **Phase 4**: Kami Three.js adapter with materials and lighting
- **Phase 5**: Three.js semantic zoom and spatial navigation
