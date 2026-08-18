# Three.js Spatial Projection

This folder implements the first spatial projection layer described in Memo 1.

## Purpose

The Three.js view is a semantic, context-preserving architectural explorer. It does not replace Structurizr or ADR markdown; it adds a third-dimensional interpretation of the same architecture knowledge.

## Included files

- `index.html`: browser entry point
- `app.js`: scene setup and simple architectural model
- `styles.css`: warm, Kami-inspired styling

## How to run

From the repository root:

```bash
cd doc/architecture/visualisations/threejs
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Design intent

- warm parchment background
- ink blue emphasis
- subtle layering and depth
- non-gaming, editorial feel
- a simple semantic zoom and context-preserving layout

This is intentionally small and intentionally not a full explorer yet. It is the first working scaffold for the memo’s Phase 5 direction.
