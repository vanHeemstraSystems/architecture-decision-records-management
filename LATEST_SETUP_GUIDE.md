# Latest Setup Guide - Both Apps Working (2026-08-18)

## ✅ Status Summary

| Component | Status | Details |
|-----------|--------|---------|
| **Port 9090** (Structurizr Lite) | ✅ **WORKING** | DSL fixed, Kami theme applied |
| **Port 3000** (Spacerizr) | ✅ **WORKING** | Running, but using default Three.js colors |
| **workspace.dsl** | ✅ **VALID** | Syntax corrected |
| **kami-adapter.mjs** | ✅ **READY** | Phase 4 deliverable complete |

---

## What to See on Port 9090 (Structurizr Lite)

### Visual Characteristics (Kami Design System)
- **Background:** Warm parchment (#f5f4ed)
- **Primary Elements:** Ink blue (#1B365D)
- **Muted Elements:** Warm gray (#777064)
- **Borders:** Light taupe (#B8B1A4)
- **Styling:** No gradients, no shadows, flat design

### Available Views
1. **System Landscape**
   - Shows all 3 systems: Architecture Explorer, Structurizr Lite, Architecture Decisions
   - System-level relationships

2. **System Context: Architecture Explorer**
   - Explorer system in context with user and external systems

3. **Architecture Explorer: Internal Architecture** (Phase 3 Focus)
   - **All 4 layers visible:**
     - Application Layer: Web UI, Navigation Service
     - Integration Layer: Structurizr Adapter, ADR Parser
     - Data Layer: Workspace Cache, ADR Index
     - Rendering Layer: Structurizr, SVG, Three.js Renderers
   - **Context Preservation:** External systems (Structurizr Lite, Architecture Decisions) shown in faded style
   - **Design Pattern:** Ink (focused) vs Graphite (context)

4. **Structurizr Lite: Canonical Architecture Model**
   - The authoritative C4 model system

5. **Architecture Decisions: Decision Records**
   - ADR storage and metadata system

---

## What to See on Port 3000 (Spacerizr)

### Current Display
- 3D spatial representation of architecture
- Default Three.js colors (gray, muted tones)
- Interactive camera control
- Node/edge structure visualization

### Why No Kami Theme Yet
**This is expected.** Spacerizr is a community tool that:
- Reads from `workspace.json` (generated output)
- Does NOT import `theme.json`
- Does NOT use `kami-adapter.mjs`

### What This Means
- ✅ Phase 4 created the Kami adapter (`kami-adapter.mjs`)
- ✅ Phase 4 proved Kami styling works in Structurizr Lite (port 9090)
- ⏳ Phase 4B (future): Custom Three.js renderer using kami-adapter
  - Would require creating new renderer or forking Spacerizr
  - Port 3000 will continue with default styling for now
  - This doesn't indicate an error—it's architectural scope

---

## How Kami Theme is Applied

### Structurizr Lite (Port 9090) - Theme Path
```
workspace.dsl
  ↓
theme themes/kami/theme.json
  ↓
Structurizr Lite UI
  ↓
Port 9090 displays with Kami styling
```

### Three.js (Port 3000) - Expected Future Path
```
kami-adapter.mjs (Phase 4 deliverable)
  ├── KAMI_TOKENS (8 semantic colors)
  ├── KAMI_MATERIALS (8 material factories)
  ├── KAMI_GEOMETRY (sizing conventions)
  ├── KAMI_LIGHTING (soft ambient setup)
  ├── KAMI_CAMERA (42° FOV, positioned)
  └── KAMI_INTERACTIONS (5 states)
  
  ↓ (Phase 4B: Custom renderer would import this)
  
Custom Three.js Renderer
  ↓
Port 3000 displays with Kami styling
```

---

## Verification Checklist

### Port 9090 (Structurizr Lite)
- [ ] Open http://localhost:9090
- [ ] See warm parchment background (#f5f4ed)
- [ ] See ink blue elements (#1B365D)
- [ ] Click through the 5 views
- [ ] Check "Architecture Explorer: Internal Architecture" view
  - Should see 4 layers with 9 containers
  - External systems (Structurizr Lite, ADRs) shown in faded style
  - No DSL errors in browser console

### Port 3000 (Spacerizr)
- [ ] Open http://localhost:3000
- [ ] See 3D architecture visualization
- [ ] Interact with camera (drag to rotate)
- [ ] Understand: Default Three.js colors are expected for now

### Docker Logs
```bash
docker compose logs lite | grep "Workspaces: 1"
# Should show: "Workspaces: 1" with NO error messages
```

---

## If You See Errors

### Error: "Unexpected tokens... styles {" on Port 9090
**Status:** ❌ This has been FIXED
- **Cause was:** `styles` block outside `views` block
- **Fix applied:** Moved styles inside views, before closing brace
- **Verify:** `docker compose down && docker compose up -d`

### Port 9090 Not Loading
**Try:**
```bash
cd /workspaces/architecture-decision-records-management/doc/architecture
docker compose down
docker compose up -d
sleep 5
docker compose logs lite | grep -i error
```

### Port 3000 Not Loading
**Try:**
```bash
docker ps  # Check if architecture container is running
docker logs architecture-decision-records-architecture-1
```

---

## Next Steps

### Option A: Explore Port 9090 (Recommended First)
1. Open http://localhost:9090
2. Browse the 5 views
3. Examine the "Architecture Explorer: Internal Architecture" view
4. Note how external systems appear faded (context preservation)

### Option B: Continue to Phase 5
**Three.js Semantic Zoom Implementation**
- Extend `kami-adapter.mjs` with camera animation methods
- Implement 4 zoom levels with smooth transitions
- Preserve spatial context during drill-down

### Option C: Continue to Phase 6
**ADR Import and Metadata**
- Parse Structurizr ADR relationships
- Extract decision metadata from markdown files
- Make architecture decisions queryable

---

## Key Design Principles (Kami System)

1. **Single Authoritative Model:** `workspace.dsl` is source of truth
2. **Multiple Projections:** Same model viewed via:
   - Structurizr Lite (2D diagrams with theme)
   - SVG renderer (state/lifecycle diagrams)
   - Three.js adapter (3D spatial, future custom renderer)
3. **Context Preservation:** Use opacity/fading for context, not color
4. **Design Tokens:** 8 semantic colors shared across all implementations
5. **No Gradients/Shadows:** Flat, Kami-styled aesthetic

---

## Technical Details

### Files Modified (Phase 4 Fix)
- `doc/architecture/workspace.dsl` (lines 104-121)
  - Moved `styles` block inside `views` block
  - Syntax now valid for Structurizr DSL parser

### Files Ready for Future Integration
- `doc/architecture/kami-adapter.mjs` (604 lines)
  - Export: `KAMI_TOKENS`, `KAMI_MATERIALS`, `KAMI_GEOMETRY`, `KAMI_LIGHTING`, `KAMI_CAMERA`, `KAMI_INTERACTIONS`
  - Class: `KamiAdapter` with 8 initialization methods
  - Waiting for custom Three.js renderer to import and use

---

## Commands Reference

```bash
# View logs
docker compose logs lite

# Restart everything
docker compose restart

# Full reset
docker compose down
docker compose up -d

# Check if workspaces loaded
docker compose logs lite | grep "Workspaces"

# Check for DSL errors
docker compose logs lite | grep -i error
```

---

## What This Phase Achieved

✅ **Phase 1:** Kami Structurizr Theme (theme.json, visual system)
✅ **Phase 2:** Architectural Regions & Groups (4 layers, 11 containers)
✅ **Phase 3:** Context-Preserving Views (visual hierarchy with fading)
✅ **Phase 4:** Kami Three.js Adapter (kami-adapter.mjs module)
🔧 **Phase 4 Fix:** DSL Syntax Correction (styles block placement)

**Result:** Authoritative architecture model with Kami styling visible on Port 9090. Foundation laid for Phase 4B custom Three.js renderer.

---

## Questions?

- **Why doesn't Port 3000 have Kami theme?** Spacerizr is a community tool that doesn't integrate Structurizr themes. Phase 4B (custom renderer) will integrate `kami-adapter.mjs`.
- **Is the error about port 9090 fixed?** Yes. The `styles` block was moved inside `views`.
- **Should I worry about Port 3000?** No. It's working as expected—just using default Three.js styling.
- **What's next after Phase 4?** Phase 5 (Semantic Zoom with camera animations) or Phase 6 (ADR Import).
