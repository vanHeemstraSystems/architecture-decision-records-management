# Skipped Memo — LikeC4 + Babylon Lite Architecture Explorer

Status: Implementation vision  
Target repository: vanHeemstraSystems/architecture-decision-records-management  
Primary artifact: skipped-memo.md  

## 1. Purpose

This memo defines the end-state architecture and implementation plan for the architecture visualization environment.

The solution uses:

* LikeC4 as the single source of truth for architecture-as-code;
* a small LikeC4-to-scene adapter to translate the compiled architecture model into a renderer-neutral scene representation;
* Babylon Lite as the visualization engine for both 2D and 3D;
* Kami design tokens as the shared visual language across both projections;
* Markdown for long-form Architecture Decision Records (ADRs);
* Docker and Docker Compose as the standard local and deployable runtime.

The result is not a conventional diagram viewer with a separate 3D mode. It is a single architecture explorer in which 2D and 3D are two projections of the same model and scene.

## 2. Architectural principles

### 2.1 LikeC4 is the source of truth

Architecture semantics live in .c4 files.

Do not maintain a parallel Structurizr DSL model, a separate hand-authored JSON graph, or a second 3D-specific architecture definition.
```
LikeC4 DSL
    |
    v
LikeC4 compiled model
    |
    v
Architecture Scene Model
    |
    v
Babylon Lite
```
All renderers and derived artifacts MUST be generated from the LikeC4 model.

### 2.2 2D and 3D are projections, not separate models

The same architecture entities, relationships, selection state, filters, metadata, ADR links and visual identity MUST be reused in both modes.

2D uses an orthographic camera and a largely planar layout.

3D uses a perspective camera and may map hierarchy, containment, grouping and semantic depth into the Z axis.
```
                    Architecture Scene
                          |
              +-----------+-----------+
              |                       |
              v                       v
       Orthographic mode       Perspective mode
              |                       |
              +-----------+-----------+
                          |
                          v
                     Babylon Lite
```
Switching between 2D and 3D should therefore be a camera/layout transition rather than a page reload into an unrelated renderer.

## 2.3 Kami is a renderer-independent design system

Kami styling MUST not be hard-coded separately in many renderer components.

Define shared design tokens and map those tokens into Babylon Lite materials, geometry, text, spacing, depth and motion.

## 2.4 ADRs are architecture entities and documents

An ADR has two complementary representations:

1. a LikeC4 architecture entity describing its identity and architectural impact;
2. a Markdown document containing the full decision record.

The LikeC4 entity answers:

What does this decision affect?

The Markdown document answers:

Why was this decision made?

Do not reduce ADRs to detached documents that cannot participate in architecture views.

## 2.5 Keep the Babylon integration replaceable

LikeC4 domain objects MUST NOT be directly coupled throughout the rendering code to Babylon Lite classes or data structures.

Introduce a renderer-neutral ArchitectureScene model between them.

This keeps the rendering boundary testable and allows the scene to be exported, inspected or reused without running a GPU renderer.

## 3. Target solution
```
                         SOURCE
                           |
                           v
                     LikeC4 DSL
                    (*.c4 files)
                           |
                           v
                   LikeC4 Model API
                           |
                           v
               LikeC4 -> Scene Adapter
                           |
                           v
                ArchitectureScene JSON
                           |
               +-----------+-----------+
               |                       |
               v                       v
         Planar layout           Spatial layout
               |                       |
               v                       v
        Orthographic camera      Perspective camera
               |                       |
               +-----------+-----------+
                           |
                           v
                      Babylon Lite
                           |
                           v
                      Kami Theme
                           |
               +-----------+-----------+
               |                       |
               v                       v
            Kami 2D                 Kami 3D
```
The browser application is the Architecture Explorer.

Its responsibilities are:

* loading or receiving the compiled architecture scene;
* rendering it through Babylon Lite;
* switching between 2D and 3D;
* selecting and focusing elements;
* preserving orientation when drilling down;
* showing containment regions;
* displaying relationships and metadata;
* opening ADR documents;
* applying filters and view definitions;
* supporting deep links to a view or selected entity.

## 4. Recommended repository layout
```
.
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── compose.yaml
├── Dockerfile
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── likec4.config.ts
│
├── architecture/
│   ├── specification.c4
│   ├── landscape.c4
│   ├── systems/
│   ├── decisions/
│   └── views/
│
├── docs/
│   └── decisions/
│
├── public/
│   └── assets/
│
├── src/
│   ├── main.ts
│   ├── app/
│   ├── architecture/
│   ├── adapters/
│   │   └── likec4/
│   ├── layout/
│   ├── renderer/
│   │   └── babylon/
│   ├── kami/
│   └── ui/
│
├── scripts/
│   ├── generate-scene.ts
│   ├── validate-model.ts
│   └── build-architecture.ts
│
└── generated/
    └── architecture.scene.json
```
generated/ MAY be excluded from Git when CI and Docker always regenerate it.

## 5. LikeC4 modelling

Use LikeC4’s flexible specification to define the architecture vocabulary needed by this repository.

A starting point:
```
specification {
  element person
  element system
  element service
  element component
  element datastore
  element region
  element cluster
  element namespace
  element decision
}
```
The exact syntax MUST be validated against the LikeC4 version pinned by the project before implementation is committed.

Containment should express architecture ownership and natural drill-down. In 2D, containment becomes visual regions. In 3D, it may additionally become semantic depth, platforms, volumes or nested spaces.

ADRs should be modeled as first-class elements, for example:
```
decision adr006 {
  title 'Use LikeC4 with Babylon Lite'
  metadata {
    status 'accepted'
    document '/docs/decisions/ADR-006-likec4-babylon-lite.md'
  }
}
adr006 -> architectureManagement 'governs'
adr006 -> explorer 'introduces'
```
The viewer MUST recognize kind = decision and apply decision-specific Kami tokens.

## 6. Renderer-neutral scene model

Create a stable internal representation.
```
export interface ArchitectureScene {
  version: 1
  views: ArchitectureView[]
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
}
export interface ArchitectureNode {
  id: string
  kind: string
  title: string
  description?: string
  parentId?: string
  children: string[]
  position: {
    x: number
    y: number
    z: number
  }
  size: {
    width: number
    height: number
    depth: number
  }
  tags: string[]
  metadata: Record<string, string>
}
```
Do not expose Babylon objects from this package.

## 7. Layout model

### 7.1 2D mode

Use an orthographic camera, planar X/Y positioning, near-zero Z values, flat geometry, containment boundaries, relationship routing, minimal lighting and Kami-style visual elevation.

### 7.2 3D mode

Use a perspective camera, preserve X/Y positions where possible, derive Z from hierarchy or semantic grouping, introduce extrusion and beveling, and use animated camera navigation.

The 3D projection SHOULD preserve the mental map established in 2D.

### 7.3 Semantic zoom

When focusing on a node:

1. keep relevant parent and neighbouring context visible;
2. expand or reveal children;
3. de-emphasize unrelated architecture;
4. move the camera rather than replace the entire world;
5. keep a breadcrumb/path available;
6. allow immediate return to the previous level.

## 8. Babylon Lite integration

Babylon Lite is the preferred renderer.

It is WebGPU-only and should be treated as such deliberately.

The application MUST detect WebGPU support at startup and show a clear unsupported-browser message when unavailable.

Use native Babylon Lite APIs for new code where practical. During initial implementation, @babylonjs/lite-compat MAY accelerate prototyping, but native Lite APIs are the target state.

Conceptually:
```
const engine = await createEngine(canvas)
const scene = createSceneContext(engine)
createArchitectureScene(sceneModel, scene, engine)
await startEngine(engine)
```
Expose an application-level camera API:
```
setProjection('2d')
setProjection('3d')
focusNode(nodeId)
resetCamera()
```
Every visible architecture node MUST map back to its stable LikeC4-derived ID.

## 9. Kami design system

Create renderer-neutral design tokens for colors, geometry, spacing, motion and architecture kinds.

Prefer importing the authoritative Kami tokens from the Kami project/package when that repository exposes them in machine-consumable form. Do not indefinitely duplicate the design system.

For 2D, map radius to rounded planar geometry, elevation to subtle shadows and surfaces to flat materials.

For 3D, map radius to beveling, elevation to physical depth, surfaces to Babylon materials and motion tokens to camera/layout transitions.

## 10. Browser application

Use TypeScript and Vite.

The minimal UI should provide:
```
[ View selector ] [ 2D ] [ 3D ] [ Fit ] [ Reset ]
```
A side inspector should expose the selected node’s details.

For ADR nodes it should additionally show the decision status, date, impacted elements and an Open ADR action.

Deep links should preserve view, projection and selection.

## 11. Package management

Use Node.js 22 and pnpm.

Pin versions; do not use "latest" in production dependency declarations.

Example scripts:
```
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "pnpm architecture:build && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "architecture:validate": "tsx scripts/validate-model.ts",
    "architecture:generate": "tsx scripts/generate-scene.ts",
    "architecture:build": "pnpm architecture:validate && pnpm architecture:generate",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```
## 12. Environment configuration

Commit .env.example and never commit .env.
```
APP_HOST=0.0.0.0
APP_PORT=8080
VITE_APP_TITLE=Architecture Explorer
VITE_DEFAULT_VIEW=landscape
VITE_DEFAULT_PROJECTION=2d
LIKEC4_SOURCE_DIR=/app/architecture
LIKEC4_GENERATED_DIR=/app/generated
HMR_PORT=24678
CHOKIDAR_USEPOLLING=1
CHOKIDAR_INTERVAL=200
VITE_ENABLE_3D=true
VITE_ENABLE_DECISIONS=true
VITE_ENABLE_DEBUG=false
```
## 13. Docker strategy

Use a multi-stage Dockerfile.
```
# syntax=docker/dockerfile:1
FROM node:22-alpine AS dependencies
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
FROM dependencies AS development
WORKDIR /app
COPY . .
EXPOSE 8080
EXPOSE 24678
CMD ["pnpm", "dev", "--", "--port", "8080"]
FROM dependencies AS build
WORKDIR /app
COPY . .
RUN pnpm typecheck
RUN pnpm test
RUN pnpm build
FROM nginx:1.29-alpine AS production
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:8080/ >/dev/null 2>&1 || exit 1
```
Use this Nginx baseline:
```
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
```
Development compose.yaml:
```
name: architecture-decision-records-management
services:
  explorer:
    build:
      context: .
      dockerfile: Dockerfile
      target: ${DOCKER_TARGET:-development}
    ports:
      - "${APP_PORT:-8080}:8080"
      - "${HMR_PORT:-24678}:24678"
    env_file:
      - .env
    environment:
      CHOKIDAR_USEPOLLING: "${CHOKIDAR_USEPOLLING:-1}"
      CHOKIDAR_INTERVAL: "${CHOKIDAR_INTERVAL:-200}"
    volumes:
      - ./:/app
      - node_modules:/app/node_modules
    init: true
    restart: unless-stopped
volumes:
  node_modules:
```
Do not set a host UID/GID user: mapping by default.

Production compose.production.yaml:
```
name: architecture-decision-records-management
services:
  explorer:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "${APP_PORT:-8080}:8080"
    restart: unless-stopped
```
Development:
```
cp .env.example .env
docker compose up --build
```
Production:
```
docker compose -f compose.production.yaml up --build -d
```
## 14. Docker and Git ignore
```
.dockerignore:

.git
.github
.env
node_modules
dist
coverage
.vscode
.idea
.DS_Store
*.log

.gitignore:

.env
node_modules/
dist/
coverage/
.DS_Store
generated/*.json
!generated/.gitkeep
```
## 15. Development workflow
```
edit *.c4
    |
    v
validate LikeC4
    |
    v
regenerate ArchitectureScene
    |
    v
Vite HMR
    |
    v
Babylon Lite updates viewer
```
Keep the intermediate scene JSON initially because it is easy to inspect, validate and test.

## 16. Build pipeline

The build MUST fail when LikeC4 is invalid, references are broken, ADR links are malformed, TypeScript fails or tests fail.

Recommended sequence:

1. install
2. validate LikeC4
3. generate ArchitectureScene
4. validate ArchitectureScene
5. typecheck
6. test
7. Vite production build
8. package production image

## 17. Tests

Implement unit tests for LikeC4-to-scene mapping, hierarchy, relationships, ADR metadata, Kami mappings and layouts.

Implement contract tests ensuring 2D and 3D contain the same semantic entities and share stable IDs and selection state.

Use Playwright for browser tests and visual regression once the Kami rendering stabilizes.

## 18. Performance

Design for models larger than the initial repository.

Reuse geometry and materials where practical, use thin instances when beneficial, hide irrelevant labels at distance, reduce relationship detail with zoom, expand only relevant child levels, and keep layout computation outside hot rendering loops.

## 19. WebGPU requirement

Babylon Lite is deliberately WebGPU-only.
```
if (!navigator.gpu) {
  showUnsupportedBrowser()
  return
}
```
Do not build a WebGL fallback unless a future requirement explicitly demands it.

## 20. Implementation phases

### Phase 1 — Foundation

Create the repository structure, LikeC4 layout, TypeScript/Vite application, Docker support, validation and a minimal Babylon Lite scene.

Success: docker compose up --build displays architecture derived from .c4.

### Phase 2 — Kami 2D

Add orthographic rendering, planar layout, regions, labels, relationships, Kami tokens, selection and inspector.

### Phase 3 — 3D projection

Add perspective rendering, semantic Z-depth, extrusion, camera transitions and preserved selection.

### Phase 4 — Decisions

Add LikeC4 decision entities, ADR metadata, impact relationships, Markdown viewing and decision views.

### Phase 5 — Semantic zoom

Add hierarchical focus, preserved context, child expansion, breadcrumbs and animated navigation.

### Phase 6 — Hardening

Add browser testing, visual regression, optimization, production image construction, CI and security scanning.

## 21. Definition of done

The solution is done when:

* LikeC4 is the only hand-maintained architecture model;
* Structurizr is no longer required;
* Three.js is not required;
* Babylon Lite renders both 2D and 3D;
* both projections share semantic identity;
* switching projection preserves selection and orientation;
* Kami controls visual identity;
* nested architecture is represented spatially;
* ADRs are first-class LikeC4 elements backed by Markdown;
* Docker Compose starts the application;
* a production container can be built;
* .env.example documents runtime configuration;
* tests validate translation and browser behaviour;
* WebGPU absence is handled explicitly;
* another engineer or AI coding agent can implement and maintain the solution using this repository alone.

## 22. Initial developer experience
```
git clone <repository>
cd architecture-decision-records-management
cp .env.example .env
docker compose up --build
```
Then open:

http://localhost:8080

The initial view should display the configured LikeC4 architecture in Kami 2D.

Selecting 3D should transition that same architecture scene into Kami 3D using Babylon Lite.

## 23. References

* LikeC4 — https://likec4.dev/
* LikeC4 CLI — https://likec4.dev/tooling/cli/
* LikeC4 Docker — https://likec4.dev/tooling/docker/
* LikeC4 views — https://likec4.dev/dsl/views/
* LikeC4 repository — https://github.com/likec4/likec4
* Babylon Lite — https://github.com/BabylonJS/Babylon-Lite
* Babylon Lite porting guide — https://github.com/BabylonJS/Babylon-Lite/blob/master/docs/lite/03-porting-guide.md
* Kami — https://github.com/vanHeemstraDesigns/Kami

## 24. Final implementation statement
```
LikeC4 defines the architecture.
The Architecture Scene Model decouples semantics from rendering.
Babylon Lite renders the same world in orthographic 2D and perspective 3D.
Kami defines how that world looks and moves.
Markdown records why architectural decisions were made.
Docker makes the complete environment reproducible.
```
This is the target architecture. Future implementation decisions should preserve this separation of concerns unless a documented ADR deliberately changes it.
:::
