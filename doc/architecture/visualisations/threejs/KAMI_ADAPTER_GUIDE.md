# Kami Three.js Adapter — Phase 4 Implementation

**Status:** ✅ Complete  
**Date:** 2026-08-18  
**Phase:** 4 — Kami Three.js Adapter (Spatial Renderer with Kami Semantics)  

---

## Overview

The Kami Three.js Adapter formalizes how Three.js projects should honor Kami design tokens and architectural principles.

This is **not** a complete renderer, but rather a foundation module that any Three.js-based architecture explorer can build upon—whether that's Spacerizr, a custom project, or a future implementation.

---

## Key Design Principles

### 1. Material System

All materials use **MeshStandardMaterial** with high roughness (0.82-0.96) for a matte, non-reflective appearance.

**Rationale:** Architectural drawings and physical models, not 3D games.

```javascript
// Focus material (primary emphasis)
color: #1B365D (Ink)
roughness: 0.82
metalness: 0.0
opacity: 1.0

// Context material (surrounding, faded)
color: #777064 (Graphite)
roughness: 0.92
metalness: 0.0
opacity: 0.6

// Muted material (background reference)
color: #777064
roughness: 0.92
metalness: 0.0
opacity: 0.4
```

**Philosophy:** Restraint over decoration. No chrome, no neon, no game-like effects.

### 2. Geometry

Containers and components use **rounded boxes** (not harsh rectangles) with shallow depth (0.1-0.2 units) to create a card-like appearance.

```javascript
// System/Container
width: 3.0, height: 1.5, depth: 0.15
cornerRadius: 0.15

// Component
width: 2.0, height: 1.0, depth: 0.1
cornerRadius: 0.1
```

**Philosophy:** Editorial/architectural drawing aesthetic, subtle visual depth.

### 3. Lighting

Soft, ambient-focused lighting with **no shadows** (too game-like).

```javascript
// Ambient light: fills entire scene evenly
color: #f7f2ea (warm off-white)
intensity: 1.4

// Directional key light: soft modeling
color: #dfe9f4 (cool white)
intensity: 1.0
position: (5, 8, 8) - from above-right
castShadow: false
```

**Philosophy:** Museum lighting, not dramatic gaming effect. Emphasis on clarity.

### 4. Camera

Near-orthographic perspective (FOV: 42°) for architectural clarity and legibility.

```javascript
fov: 42          // Narrow for clarity
position: (0, 6, 18)  // Isometric-like view
near: 0.1
far: 1000
```

**Alternative:** Orthographic camera available for technical drawing feel.

**Philosophy:** Drawings over photographs. Clarity and proportion matter more than realism.

### 5. Interaction States

**Hover:**
- Opacity: 1.0 (full)
- Scale: 1.05 (slight enlargement)
- Outline: 2px

**Selected:**
- Opacity: 1.0
- Material: Focus (Ink #1B365D)
- Outline: 3px

**Context:**
- Opacity: 0.6 (faded)
- Material: Context (Graphite #777064)

**Muted:**
- Opacity: 0.4 (heavily faded)
- Material: Muted

**Philosophy:** Opacity and emphasis instead of color coding. Preserves Kami palette.

---

## Module Structure

### Exported Constants

```javascript
KAMI_TOKENS       // Color palette
KAMI_MATERIALS    // Material factory functions
KAMI_GEOMETRY     // Geometry configurations
KAMI_LIGHTING     // Lighting presets
KAMI_CAMERA       // Camera settings
KAMI_INTERACTIONS // Interaction state definitions
KAMI_SCENE        // Overall scene configuration
```

### Exported Class

```javascript
KamiAdapter       // Factory for creating Kami-styled Three.js objects
```

---

## Usage

### Basic Setup

```javascript
import * as THREE from 'three';
import { KamiAdapter } from './kami-adapter.mjs';

// Initialize adapter
const kami = new KamiAdapter(THREE);
kami.initializeMaterials();

// Create Kami-styled objects
const scene = kami.createScene();
const camera = kami.createCamera(window.innerWidth, window.innerHeight);
const lighting = kami.createLighting(scene);
const ground = kami.createGround(scene);

// Get materials
const materials = kami.getMaterials();
const tokens = kami.getTokens();

// Create architecture element using materials
const container = new THREE.Mesh(
  new THREE.BoxGeometry(3.0, 1.5, 0.15),
  materials.focus  // Ink emphasis
);
scene.add(container);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

### Creating Architecture Elements

```javascript
// System (primary focus)
const system = new THREE.Mesh(
  new THREE.BoxGeometry(3.0, 1.5, 0.15),
  materials.focus
);

// Container (secondary)
const container = new THREE.Mesh(
  new THREE.BoxGeometry(3.0, 1.5, 0.15),
  materials.secondary
);

// External context (faded)
const externalSystem = new THREE.Mesh(
  new THREE.BoxGeometry(3.0, 1.5, 0.15),
  materials.context  // 60% opacity
);
```

### Styling Elements Based on State

```javascript
// Get interaction configurations
const interactions = kami.getInteractions();

// Apply hover state
mesh.userData.targetOpacity = interactions.hover.opacity;
mesh.scale.multiplyScalar(interactions.hover.scale);

// Apply selected state
mesh.material = materials.focus;
mesh.userData.targetOpacity = interactions.selected.opacity;

// Apply muted state
mesh.material = materials.muted;
mesh.userData.targetOpacity = interactions.muted.opacity;
```

---

## Kami Tokens Reference

| Token | Hex | Usage |
|-------|-----|-------|
| `canvas` | #f5f4ed | Background, parchment surface |
| `ink` | #1B365D | Primary emphasis, focus elements |
| `text` | #2C2924 | Text and labels |
| `muted` | #777064 | Subdued elements, context, relationships |
| `border` | #B8B1A4 | Subtle boundaries, outlines |
| `surface` | #F5F4ED | Secondary containers |
| `surfaceMuted` | #EFEDE4 | Muted secondary surfaces |
| `neutral` | #9E978B | Deployment nodes, infrastructure |

---

## Material Properties

### Focus Material
- **When to use:** Primary system/container being examined
- **Color:** Ink (#1B365D)
- **Opacity:** 1.0
- **Roughness:** 0.82
- **Effect:** High contrast, draws attention

### Secondary Material
- **When to use:** Supporting elements, secondary containers
- **Color:** Surface (#F5F4ED)
- **Opacity:** 1.0
- **Roughness:** 0.92
- **Effect:** Balanced visibility, not overwhelming

### Context Material
- **When to use:** Surrounding systems during drill-down
- **Color:** Muted (#777064)
- **Opacity:** 0.6
- **Roughness:** 0.92
- **Effect:** Visible but faded, preserves spatial memory

### Muted Material
- **When to use:** Background reference, least important elements
- **Color:** Muted (#777064)
- **Opacity:** 0.4
- **Roughness:** 0.92
- **Effect:** Heavily faded, provides information without distraction

---

## Applying to Spacerizr

The current Spacerizr implementation (port 3000) is a community tool that doesn't integrate Kami styling.

To apply Kami styling to Spacerizr or create a custom Kami-aware Three.js renderer:

1. **Install the adapter** in your Three.js project
2. **Initialize KamiAdapter** with THREE
3. **Use `kami.getMaterials()` instead of custom materials**
4. **Apply `kami.createLighting()` instead of custom lighting**
5. **Use tokens from `kami.getTokens()`** for consistent colors
6. **Reference `kami.getGeometry()` and `kami.getInteractions()`** for layout and behavior

---

## Kami Compliance Levels (Reference)

From memo1.md Section 8.3:

> **Kami Spatial:** Used for Three.js. Preserve the same visual principles while introducing genuinely spatial concepts.

The adapter achieves this through:

✅ **Palette consistency** — Same tokens as Structurizr theme
✅ **Visual hierarchy** — Ink/Graphite/Parchment in 3D space
✅ **Matte surfaces** — No reflections, focus on clarity
✅ **Soft lighting** — Museum aesthetic, not gaming
✅ **Shallow depth** — Card-like, architectural drawing feel
✅ **Interaction states** — Opacity/scale instead of color coding
✅ **Spatial principles** — Genuine 3D navigation with preserved context

---

## File Locations

```
doc/architecture/
└── visualisations/
    └── threejs/
        ├── kami-adapter.mjs        ← Kami adapter module
        ├── app.js                  ← Updated to use adapter
        ├── index.html              ← Three.js viewer
        ├── styles.css              ← Styling
        ├── generate-graph.mjs       ← Architecture graph generator
        └── data/
            └── architecture-graph.json
```

---

## Next Steps

### For Custom Three.js Renderers

To build a Kami-aware Three.js architecture explorer:

1. Import `KamiAdapter`
2. Initialize with your THREE instance
3. Create architecture elements using `kami.getMaterials()`
4. Implement semantic zoom using `kami.getCamera().animation`
5. Apply interaction states using `kami.getInteractions()`

### For Spacerizr Integration

To adapt existing Spacerizr to use Kami:

1. Fork/patch Spacerizr with kami-adapter module
2. Replace hardcoded colors with `kami.getTokens()`
3. Replace materials with `kami.getMaterials()`
4. Apply Kami lighting setup in initialization
5. Test context preservation during zoom

### For Future Phases

- **Phase 5:** Three.js semantic zoom with context preservation
- **Phase 6:** ADR import and metadata extraction
- **Phase 7:** Decision layer with ADR visual primitives
- **Phase 8:** Bidirectional decision navigation

---

## Design Philosophy Embodied

✅ **Restraint over decoration**
- Matte surfaces (no chrome)
- Soft lighting (no drama)
- Subtle depth (not exaggerated)
- No arbitrary animations

✅ **Kami everywhere**
- Single token set used consistently
- Shared palette across 2D and 3D
- Same visual grammar as Structurizr theme
- Editorial/architectural aesthetic throughout

✅ **Model once, project many times**
- Workspace.dsl remains authoritative
- Adapter projects onto Three.js consistently
- Tokens flow from design system to renderer
- No duplication of style definitions

✅ **Preserve spatial memory**
- Materials support context/muted states
- Opacity fading for drill-down
- Interaction states use scale + emphasis
- No harsh color changes during navigation

---

## Technical Notes

### Why MeshStandardMaterial?

- Physically-based rendering model
- Consistent appearance across lighting conditions
- Industry standard for architectural visualization
- Supports metalness/roughness controls

### Why No Shadows?

- Shadows create dramatic/theatrical effect
- Distract from architectural clarity
- Add computational cost
- Unnecessary for 2D-adjacent orthographic views

### Why High Roughness?

- Matte appearance (not shiny)
- Consistent with paper/card physical models
- Reduces visual complexity
- Supports editorial aesthetic

### Why Warm Ambient Light?

- Pure white can feel sterile
- Warm tone aligns with parchment canvas
- Creates cohesive visual experience
- Supports Kami's warm, editorial aesthetic

---

## Integration Checklist

- [ ] Import `KamiAdapter` in your Three.js project
- [ ] Initialize: `const kami = new KamiAdapter(THREE)`
- [ ] Call: `kami.initializeMaterials()`
- [ ] Create scene: `const scene = kami.createScene()`
- [ ] Create camera: `const camera = kami.createCamera(width, height)`
- [ ] Create lighting: `kami.createLighting(scene)`
- [ ] Add ground: `kami.createGround(scene)`
- [ ] Get materials: `const materials = kami.getMaterials()`
- [ ] Get tokens: `const tokens = kami.getTokens()`
- [ ] Create elements using materials and tokens
- [ ] Apply interaction states from `kami.getInteractions()`
- [ ] Test warm parchment background
- [ ] Test matte, non-reflective surfaces
- [ ] Verify soft ambient lighting
- [ ] Validate context preservation (opacity/fading)

---

## References

- **Memo1.md Section 12-13:** Structurizr → Three.js material mapping, Three.js-specific properties
- **Memo1.md Section 31:** Target experience (physical architectural model aesthetic)
- **Theme.json:** `doc/architecture/themes/kami/theme.json`
- **Existing app.js:** Already updated to use adapter

---

## Phase 4 Success Criterion

**"2D Structurizr, SVG, and Three.js look like different projections of one design system."**

**Status:** ✅ MET

Evidence:
- ✅ Kami tokens centralized in adapter
- ✅ Material system formalizes Structurizr color → Three.js mapping
- ✅ Lighting and geometry follow Kami principles
- ✅ Interaction states use Kami visual hierarchy
- ✅ Camera and scene configuration optimized for architectural clarity
- ✅ Warm parchment canvas consistent across all renderers
- ✅ Ink/Graphite/Muted hierarchy preserved in 3D
- ✅ No game-like effects, editorial aesthetic throughout

---

## What's Next

**Phase 5: Three.js Semantic Zoom**

Implement camera-based drill-down that preserves spatial context:

1. System Landscape → approach and expand system
2. System → containers become visible
3. Container → components revealed
4. At each level, surrounding elements remain visible but faded
5. Camera animates smoothly between levels

Success criterion: "Landscape → System → Container → Component navigation retains spatial context."

