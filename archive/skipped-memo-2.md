# Skipped Memo (2) — LikeC4 + SvelteKit + Babylon Lite Architecture Explorer

Status: Implementation specification  
Target repository: vanHeemstraSystems/architecture-decision-records-management  
Primary artifact: skipped-memo-2.md  

## 1. Purpose

This memo defines the target architecture and implementation plan for the Architecture Explorer.

The solution uses:

* LikeC4 as the single source of truth for architecture-as-code;
* a LikeC4-to-scene adapter that translates the compiled architecture model into a renderer-neutral scene representation;
* SvelteKit with TypeScript as the application framework;
* Babylon Lite as the WebGPU visualization engine for both 2D and 3D;
* Kami design tokens as the shared visual language across the application and architecture projections;
* Markdown for long-form Architecture Decision Records;
* Docker and Docker Compose as the standard development and production runtime.

The result is a single interactive architecture environment rather than a collection of unrelated diagrams.

The central model is:
```
LikeC4
   |
   v
ArchitectureScene
   |
   v
SvelteKit
   |
   +-------------------+
   |                   |
   v                   v
Kami application   Babylon Lite
UI                 renderer
   |                   |
   |             +-----+-----+
   |             |           |
   |             v           v
   |          Kami 2D     Kami 3D
   |             |           |
   +-------------+-----------+
                 |
                 v
        Architecture Explorer
```
⸻

2. Architectural principles

2.1 LikeC4 is the architecture source of truth

Architecture semantics MUST live in .c4 source files.

Do not maintain:

* Structurizr DSL;
* a parallel hand-maintained JSON graph;
* a separate 3D architecture model;
* renderer-specific architecture definitions.

The authoritative pipeline is:

*.c4
  |
  v
LikeC4
  |
  v
compiled architecture model
  |
  v
LikeC4 adapter
  |
  v
ArchitectureScene

Every interactive representation derives from this model.

⸻

2.2 SvelteKit owns the application

SvelteKit is responsible for:

* application composition;
* routing;
* deep linking;
* architecture navigation;
* selected-element state;
* active view state;
* projection state;
* inspector panels;
* ADR presentation;
* error handling;
* WebGPU capability messaging;
* application shell;
* accessibility;
* browser history;
* future server functionality if required.

Vite is therefore not an architectural component of this solution.

It exists underneath SvelteKit as build and development tooling.

⸻

2.3 Babylon Lite owns visualization

Babylon Lite is responsible for:

* WebGPU initialization;
* architecture geometry;
* materials;
* labels;
* relationship geometry;
* picking;
* cameras;
* animation;
* spatial navigation;
* 2D projection;
* 3D projection.

Babylon MUST NOT become the application state manager.

For example:

Svelte state
selectedNode = payments
activeView   = landscape
projection   = 3d
        |
        v
Babylon renderer
focus(payments)
show(landscape)
setProjection(3d)

The Svelte application remains authoritative.

⸻

2.4 2D and 3D are projections of one world

There MUST NOT be independent 2D and 3D architecture models.

The same scene provides both.

                  ArchitectureScene
                         |
              +----------+----------+
              |                     |
              v                     v
         orthographic           perspective
             camera                camera
              |                     |
              v                     v
           Kami 2D               Kami 3D

Switching between 2D and 3D should therefore feel like changing how the architecture is viewed rather than opening another application.

⸻

2.5 Kami is shared across Svelte and Babylon

Kami defines the visual identity of the entire Architecture Explorer.

It applies to:

Kami
 |
 +-- SvelteKit application shell
 |
 +-- navigation
 |
 +-- inspector
 |
 +-- ADR viewer
 |
 +-- architecture nodes
 |
 +-- relationships
 |
 +-- boundaries
 |
 +-- typography
 |
 +-- 2D geometry
 |
 +-- 3D geometry
 |
 +-- motion

The architecture SHOULD import authoritative Kami design tokens when these become available in machine-readable form.

Do not create unrelated “Kami-like” implementations for the UI and renderer.

⸻

3. Target architecture

                       LikeC4 DSL
                          *.c4
                            |
                            v
                     LikeC4 compiler
                            |
                            v
                     LikeC4 Model API
                            |
                            v
                  LikeC4 Scene Adapter
                            |
                            v
                  ArchitectureScene
                            |
                            v
                        SvelteKit
                            |
          +-----------------+-----------------+
          |                                   |
          v                                   v
     Application UI                     Babylon Lite
          |                                   |
     Kami components                  WebGPU renderer
          |                                   |
          |                           +-------+-------+
          |                           |               |
          |                           v               v
          |                      Orthographic     Perspective
          |                           |               |
          |                           v               v
          |                        Kami 2D         Kami 3D
          |                           |               |
          +---------------------------+---------------+
                                      |
                                      v
                             Architecture Explorer

⸻

4. Repository structure

Recommended layout:

.
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
│
├── compose.yaml
├── compose.production.yaml
├── Dockerfile
│
├── package.json
├── pnpm-lock.yaml
├── svelte.config.js
├── tsconfig.json
├── vite.config.ts
├── likec4.config.ts
│
├── docker/
│   └── nginx.conf
│
├── architecture/
│   ├── specification.c4
│   ├── landscape.c4
│   │
│   ├── systems/
│   │   ├── architecture-management.c4
│   │   └── examples.c4
│   │
│   ├── decisions/
│   │   ├── decisions.c4
│   │   └── relations.c4
│   │
│   └── views/
│       ├── landscape.c4
│       ├── decisions.c4
│       └── dynamic.c4
│
├── docs/
│   └── decisions/
│       ├── ADR-001-example.md
│       └── ADR-002-example.md
│
├── static/
│   └── assets/
│
├── src/
│   ├── app.html
│   │
│   ├── lib/
│   │   ├── architecture/
│   │   │   ├── model.ts
│   │   │   ├── scene.ts
│   │   │   ├── validation.ts
│   │   │   ├── selection.ts
│   │   │   └── state.svelte.ts
│   │   │
│   │   ├── adapters/
│   │   │   └── likec4/
│   │   │       ├── adapter.ts
│   │   │       ├── elements.ts
│   │   │       ├── relationships.ts
│   │   │       ├── views.ts
│   │   │       └── metadata.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── planar.ts
│   │   │   ├── spatial.ts
│   │   │   ├── hierarchy.ts
│   │   │   └── transitions.ts
│   │   │
│   │   ├── renderer/
│   │   │   └── babylon/
│   │   │       ├── engine.ts
│   │   │       ├── scene.ts
│   │   │       ├── nodes.ts
│   │   │       ├── edges.ts
│   │   │       ├── boundaries.ts
│   │   │       ├── labels.ts
│   │   │       ├── picking.ts
│   │   │       └── cameras/
│   │   │           ├── orthographic.ts
│   │   │           └── perspective.ts
│   │   │
│   │   ├── kami/
│   │   │   ├── tokens.ts
│   │   │   ├── theme.ts
│   │   │   └── mappings.ts
│   │   │
│   │   └── components/
│   │       ├── ArchitectureCanvas.svelte
│   │       ├── ArchitectureToolbar.svelte
│   │       ├── Inspector.svelte
│   │       ├── DecisionPanel.svelte
│   │       ├── ProjectionSwitcher.svelte
│   │       ├── ViewSelector.svelte
│   │       ├── Breadcrumbs.svelte
│   │       └── WebGPUUnsupported.svelte
│   │
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte
│       │
│       ├── architecture/
│       │   └── [view]/
│       │       └── +page.svelte
│       │
│       └── decisions/
│           └── [id]/
│               └── +page.svelte
│
├── scripts/
│   ├── generate-scene.ts
│   ├── validate-model.ts
│   └── build-architecture.ts
│
└── generated/
    └── architecture.scene.json

⸻

5. LikeC4 modelling

The architecture vocabulary should be explicitly defined.

A starting point is:

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

The implementation MUST validate the exact syntax against the pinned LikeC4 release.

The important principle is that LikeC4 expresses our architecture semantics rather than forcing the repository into a fixed C4 hierarchy.

⸻

6. Architecture decisions as first-class elements

ADRs MUST exist in two forms.

Architecture representation

For example:

decision adr006 {
  title 'Use LikeC4, SvelteKit and Babylon Lite'
  metadata {
    status 'accepted'
    document '/decisions/ADR-006'
  }
}
adr006 -> architectureExplorer 'governs'
adr006 -> renderer 'introduces'

Document representation

docs/
└── decisions/
    └── ADR-006-likec4-sveltekit-babylon-lite.md

This gives us:

                     ADR-006
                        |
             +----------+----------+
             |                     |
             v                     v
       architecture node      Markdown record
             |                     |
             v                     v
       WHAT it affects        WHY we chose it

⸻

7. ArchitectureScene

Introduce a renderer-neutral internal representation.

For example:

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
export interface ArchitectureEdge {
  id: string
  source: string
  target: string
  title?: string
  kind?: string
  tags: string[]
}
export interface ArchitectureView {
  id: string
  title: string
  nodeIds: string[]
  edgeIds: string[]
}

Babylon classes MUST NOT appear in this model.

The pipeline becomes:

LikeC4
   |
   v
normalize
   |
   v
ArchitectureScene
   |
   +-- validate
   |
   +-- serialize
   |
   +-- layout
   |
   +-- Svelte application state
   |
   +-- Babylon rendering

⸻

8. SvelteKit application architecture

SvelteKit provides the application shell around the architecture renderer.

It owns:

activeView
selectedNode
projection
navigationHistory
filters
inspectorState
decisionState

A representative state model could be:

export type Projection = '2d' | '3d'
export interface ExplorerState {
  activeView: string
  selectedNode?: string
  projection: Projection
}

Babylon reacts to this state.

Babylon does not own it.

⸻

9. ArchitectureCanvas

The Babylon renderer should be encapsulated by a Svelte component.

Conceptually:

<script lang="ts">
  import { onMount } from 'svelte'
  import { createArchitectureExplorer } from '$lib/renderer/babylon'
  let canvas: HTMLCanvasElement
  onMount(async () => {
    if (!navigator.gpu) {
      return
    }
    const explorer = await createArchitectureExplorer(canvas)
    return () => {
      explorer.dispose()
    }
  })
</script>
<canvas bind:this={canvas}></canvas>

The actual implementation MUST use the APIs of the pinned Babylon Lite version.

The important rule is:

Babylon Lite initializes only in the browser.

Do not attempt WebGPU initialization during SvelteKit server rendering.

⸻

10. 2D projection

2D mode uses:

* orthographic camera;
* planar X/Y layout;
* fixed or near-zero Z;
* visually flat architecture geometry;
* containment regions;
* relationship routing;
* restrained lighting;
* Kami typography;
* Kami spacing;
* Kami elevation.

The result should behave like a polished interactive architecture diagram.

⸻

11. 3D projection

3D mode uses:

* perspective camera;
* the same semantic nodes;
* X/Y positions derived from the 2D mental map;
* semantic Z-depth;
* extrusion;
* beveling;
* spatial boundaries;
* depth-aware relationships;
* subtle lighting;
* animated navigation.

Changing projection should conceptually perform:

2D
 |
 | camera + layout transition
 v
3D

rather than:

2D application
 |
 | unload
 v
3D application

⸻

12. Projection switching

The Svelte component exposes:

[ 2D ] [ 3D ]

Changing this modifies application state:

projection = '3d'

The Babylon renderer observes that change and transitions the architecture.

Selection MUST survive the transition.

If:

selectedNode = paymentService

before switching, the payment service remains selected afterwards.

⸻

13. Semantic zoom

Semantic zoom is a primary feature.

Selecting a system should not simply replace one diagram with another.

Instead:

Landscape
    |
    | select System A
    v
camera approaches System A
    |
    +--> System A gains emphasis
    |
    +--> children become visible
    |
    +--> unrelated architecture fades
    |
    +--> neighbouring context remains visible

Svelte maintains the navigation state.

Babylon performs the visual transition.

Breadcrumbs MAY show:

Landscape / Commerce / Payments / Authorization

Clicking any ancestor returns to that level.

⸻

14. Routing

Architecture state should be shareable through URLs.

Recommended routes:

/architecture/landscape
/architecture/landscape?projection=2d
/architecture/landscape?projection=3d
/architecture/landscape?projection=3d&selected=payments

ADR routes:

/decisions/ADR-001
/decisions/ADR-006

This means architecture locations can be bookmarked, documented and shared.

⸻

15. ADR presentation

SvelteKit significantly improves the ADR experience.

An architecture decision can be selected in the Babylon canvas:

◇ ADR-006

The inspector shows:

Use LikeC4, SvelteKit and Babylon Lite
Status
Accepted
Impacts
Architecture Explorer
Renderer
[ Open decision ]

Selecting Open decision navigates to:

/decisions/ADR-006

SvelteKit then presents the Markdown decision as a normal application page.

⸻

16. Kami design system

Kami MUST span both Svelte and Babylon.

Define renderer-neutral tokens.

Conceptually:

export const kami = {
  colour: {
    canvas: '...',
    surface: '...',
    primary: '...',
    secondary: '...',
    text: '...',
    muted: '...',
    accent: '...'
  },
  geometry: {
    radiusSm: 8,
    radiusMd: 14,
    radiusLg: 22
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24
  },
  motion: {
    quick: 140,
    normal: 240,
    slow: 420
  },
  architecture: {
    system: {},
    service: {},
    component: {},
    decision: {}
  }
}

These tokens feed:

              Kami Tokens
                   |
        +----------+----------+
        |                     |
        v                     v
    Svelte UI            Babylon renderer
        |                     |
        v               +-----+-----+
   Kami application      |           |
                         v           v
                      Kami 2D     Kami 3D

⸻

17. Babylon Lite

Babylon Lite is the visualization engine.

The project intentionally accepts its WebGPU requirement.

The application MUST check:

if (!navigator.gpu) {
  showUnsupportedBrowser()
}

The Svelte application should render WebGPUUnsupported.svelte rather than attempting to initialize Babylon.

Do not implement a WebGL fallback unless a future requirement explicitly demands one.

⸻

18. Babylon abstraction

Expose a small renderer interface to Svelte:

export interface ArchitectureRenderer {
  load(scene: ArchitectureScene): Promise<void>
  setView(viewId: string): Promise<void>
  setProjection(
    projection: '2d' | '3d'
  ): Promise<void>
  focusNode(nodeId: string): Promise<void>
  fit(): Promise<void>
  reset(): Promise<void>
  dispose(): void
}

Svelte should know this interface.

It should not need to understand Babylon meshes, materials or cameras.

⸻

19. Package management

Use:

* Node.js 22;
* pnpm;
* TypeScript;
* SvelteKit;
* Babylon Lite;
* LikeC4;
* Vitest;
* Playwright.

Pin production dependencies.

Do not use "latest" in committed dependency declarations.

A representative script structure:

{
  "scripts": {
    "dev": "vite dev --host 0.0.0.0",
    "build": "pnpm architecture:build && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "architecture:validate": "tsx scripts/validate-model.ts",
    "architecture:generate": "tsx scripts/generate-scene.ts",
    "architecture:build": "pnpm architecture:validate && pnpm architecture:generate",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}

The commands are executed through SvelteKit’s Vite-based tooling, but application code should be structured around SvelteKit rather than around Vite itself.

⸻

20. SvelteKit adapter

For the initial production implementation, prefer a static SvelteKit build.

Use:

@ sveltejs/adapter-static

without the space in the actual package name:

@sveltejs/adapter-static

This produces static application output that can be served efficiently from Nginx.

Conceptually:

LikeC4
   |
   v
scene generation
   |
   v
SvelteKit build
   |
   v
static output
   |
   v
Nginx

If future requirements introduce runtime server capabilities such as:

* authentication;
* dynamic architecture APIs;
* database-backed annotations;
* server-side search;
* collaboration;
* authorization;

the application can migrate to:

@sveltejs/adapter-node

without changing the Babylon architecture.

⸻

21. Environment configuration

Commit .env.example.

Never commit .env.

Example:

APP_HOST=0.0.0.0
APP_PORT=8080
PUBLIC_APP_TITLE=Architecture Explorer
PUBLIC_DEFAULT_VIEW=landscape
PUBLIC_DEFAULT_PROJECTION=2d
LIKEC4_SOURCE_DIR=/app/architecture
LIKEC4_GENERATED_DIR=/app/generated
HMR_PORT=24678
CHOKIDAR_USEPOLLING=1
CHOKIDAR_INTERVAL=200
PUBLIC_ENABLE_3D=true
PUBLIC_ENABLE_DECISIONS=true
PUBLIC_ENABLE_DEBUG=false

Client-visible SvelteKit configuration MUST use the appropriate public environment mechanism.

Secrets MUST never use public environment variables.

⸻

22. Docker strategy

Use a multi-stage Dockerfile.

The development image runs the SvelteKit development environment.

The production image contains only generated static output and Nginx.

⸻

23. Dockerfile

Recommended baseline:

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
CMD ["pnpm", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
FROM dependencies AS build
WORKDIR /app
COPY . .
RUN pnpm check
RUN pnpm test
RUN pnpm build
FROM nginx:1.29-alpine AS production
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:8080/ >/dev/null 2>&1 || exit 1

The actual static output directory MUST correspond to the pinned SvelteKit adapter configuration.

⸻

24. Nginx

Create:

docker/nginx.conf

with:

server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
    location /_app/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

The final fallback behavior should match the SvelteKit static routing configuration.

⸻

25. Development Compose

Create compose.yaml:

name: architecture-decision-records-management
services:
  explorer:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
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

Do not add a host UID/GID user: mapping by default.

This avoids the rootless user-namespace UID mapping problem previously encountered by this repository.

⸻

26. Production Compose

Create:

compose.production.yaml

with:

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

Production MUST NOT mount the repository source tree.

⸻

27. Docker ignore

Create .dockerignore:

.git
.github
.env
node_modules
.svelte-kit
build
coverage
.vscode
.idea
.DS_Store
*.log

Do not exclude:

architecture/
docs/
static/
generated/

when these are required by the build.

⸻

28. Git ignore

Create or extend .gitignore:

.env
node_modules/
.svelte-kit/
build/
coverage/
.DS_Store
generated/*.json
!generated/.gitkeep

Generated architecture files may later be committed if reproducible static deployments require them, but generation during CI is preferred.

⸻

29. Development workflow

The intended feedback loop is:

edit *.c4
    |
    v
LikeC4 validation
    |
    v
ArchitectureScene regeneration
    |
    v
SvelteKit development server
    |
    v
ArchitectureCanvas
    |
    v
Babylon Lite
    |
    v
browser

Svelte components should update through the normal development environment.

Changes to .c4 files should trigger scene regeneration.

Initially, keep:

generated/architecture.scene.json

as an inspectable intermediate artifact.

This greatly simplifies debugging.

⸻

30. Build pipeline

The production build should perform:

1. pnpm install --frozen-lockfile
2. validate LikeC4
3. generate ArchitectureScene
4. validate ArchitectureScene
5. svelte-check
6. unit tests
7. SvelteKit build
8. optional Playwright smoke tests
9. construct production Docker image

The build MUST fail when:

* LikeC4 is invalid;
* architecture references are broken;
* relationships target unknown entities;
* ADR metadata is malformed;
* ArchitectureScene validation fails;
* Svelte validation fails;
* TypeScript fails;
* tests fail.

⸻

31. Testing

Unit tests

Test:

* LikeC4 element mapping;
* relationship mapping;
* hierarchy mapping;
* ADR mapping;
* metadata mapping;
* Kami token mapping;
* planar layout;
* spatial layout;
* projection state.

Contract tests

Given one LikeC4 model:

2D semantic entities == 3D semantic entities

Stable IDs MUST remain identical.

Projection switching MUST NOT alter semantic identity.

Svelte component tests

Test:

* projection switcher;
* inspector;
* breadcrumbs;
* ADR panel;
* WebGPU unsupported state;
* view selector.

Playwright

Test:

* application startup;
* architecture route loading;
* 2D rendering;
* 3D switching;
* selection;
* inspector;
* deep linking;
* ADR navigation;
* browser back/forward navigation.

Visual regression

Once Kami rendering stabilizes, capture representative screenshots for:

* landscape 2D;
* nested architecture 2D;
* landscape 3D;
* nested architecture 3D;
* ADR impact view.

⸻

32. Performance

The Architecture Explorer should eventually handle substantially larger models than the initial repository.

Plan for:

* shared Babylon geometry;
* shared materials;
* thin instances where appropriate;
* label level-of-detail;
* relationship level-of-detail;
* selective hierarchy expansion;
* layout caching;
* lazy ADR loading;
* Svelte component isolation;
* minimal reactive updates to the Babylon canvas.

Do not recreate the Babylon scene for ordinary Svelte state changes.

Update only the affected renderer state.

⸻

33. WebGPU requirement

Babylon Lite is WebGPU-only.

Treat that as an intentional architectural constraint.

At startup:

Does navigator.gpu exist?
          |
     +----+----+
     |         |
    yes        no
     |         |
     v         v
 Babylon    SvelteKit
  Lite      unsupported
 renderer      page

The unsupported page should explain that a modern WebGPU-capable browser is required.

Do not silently downgrade to a completely different renderer.

⸻

34. Application UI

The minimum toolbar is:

[ View ]  [ 2D | 3D ]  [ Fit ]  [ Reset ]

When an element is selected, show the inspector.

When hierarchy is entered, show breadcrumbs.

For decisions:

Decision
--------
Use Babylon Lite
Status
Accepted
Impacts
Renderer
Architecture Explorer
[ Open ADR ]

Keep the application interface deliberately restrained so that the architecture remains the primary visual object.

⸻

35. MVP implementation phases

Phase 1 — SvelteKit foundation

Implement:

* SvelteKit;
* TypeScript;
* static adapter;
* Docker;
* Compose;
* .env.example;
* LikeC4 source structure;
* architecture validation;
* ArchitectureScene generation.

Success criterion:

docker compose up --build starts the SvelteKit Architecture Explorer.

⸻

Phase 2 — Babylon Lite foundation

Implement:

* ArchitectureCanvas.svelte;
* WebGPU detection;
* Babylon Lite initialization;
* renderer abstraction;
* minimal architecture node rendering.

Success criterion:

LikeC4-derived architecture appears inside a Babylon Lite canvas embedded in SvelteKit.

⸻

Phase 3 — Kami 2D

Implement:

* orthographic camera;
* planar layout;
* nodes;
* boundaries;
* relationships;
* labels;
* Kami tokens;
* selection;
* inspector.

Success criterion:

the application is usable as a polished 2D architecture explorer.

⸻

Phase 4 — Kami 3D

Implement:

* perspective camera;
* semantic depth;
* extrusion;
* beveling;
* camera movement;
* 2D/3D transition.

Success criterion:

the same architecture transitions between Kami 2D and Kami 3D without losing semantic identity or orientation.

⸻

Phase 5 — ADRs

Implement:

* LikeC4 decision elements;
* ADR metadata;
* impact relationships;
* decision-specific rendering;
* Markdown ADR routes;
* DecisionPanel.

Success criterion:

decisions can be explored visually and opened as complete records.

⸻

Phase 6 — Semantic zoom

Implement:

* hierarchical focus;
* child expansion;
* parent context;
* neighbouring context;
* de-emphasis;
* breadcrumbs;
* animated navigation.

Success criterion:

navigating downward through architecture preserves spatial awareness.

⸻

Phase 7 — Hardening

Implement:

* Playwright;
* visual regression;
* performance optimization;
* production Compose;
* CI;
* Docker image publishing;
* dependency scanning;
* security scanning;
* documentation.

⸻

36. Developer experience

The intended developer experience is:

git clone <repository>
cd architecture-decision-records-management
cp .env.example .env
docker compose up --build

Then open:

http://localhost:8080

The application should initially display:

Architecture Explorer
        |
        v
configured LikeC4 view
        |
        v
Kami 2D

Selecting:

3D

transitions the same architecture into the Babylon Lite perspective projection.

⸻

37. Production

Build and run:

docker compose \
  -f compose.production.yaml \
  up --build -d

The production chain becomes:

LikeC4
   |
   v
ArchitectureScene
   |
   v
SvelteKit static build
   |
   v
Nginx
   |
   v
Browser
   |
   v
Babylon Lite / WebGPU

⸻

38. Definition of done

The implementation is complete when:

* LikeC4 is the only hand-maintained architecture model;
* Structurizr is not required;
* Three.js is not required;
* SvelteKit provides the application framework;
* Babylon Lite provides architecture rendering;
* Svelte owns application state;
* Babylon owns visualization state;
* the two are connected through a small renderer API;
* ArchitectureScene is renderer-neutral;
* 2D uses orthographic projection;
* 3D uses perspective projection;
* both projections contain identical semantic entities;
* switching projection preserves selection;
* switching projection preserves the user’s mental map;
* Kami controls both application and architecture appearance;
* nested architecture supports semantic zoom;
* ADRs are first-class architecture entities;
* ADRs link to Markdown documents;
* ADRs have dedicated SvelteKit routes;
* URLs can represent architecture views and selections;
* WebGPU capability is explicitly handled;
* Docker Compose starts the development environment;
* a production Docker image can be constructed;
* .env.example documents configuration;
* automated tests validate the architecture pipeline;
* another engineer or AI coding agent can implement and maintain the repository using this memo without needing the discussion that produced it.

⸻

39. References

* LikeC4 — https://likec4.dev/
* LikeC4 CLI — https://likec4.dev/tooling/cli/
* LikeC4 Docker — https://likec4.dev/tooling/docker/
* LikeC4 views — https://likec4.dev/dsl/views/
* LikeC4 repository — https://github.com/likec4/likec4
* Svelte — https://svelte.dev/
* SvelteKit — https://svelte.dev/docs/kit
* SvelteKit adapters — https://svelte.dev/docs/kit/adapters
* Babylon Lite — https://github.com/BabylonJS/Babylon-Lite
* Babylon Lite porting guide — https://github.com/BabylonJS/Babylon-Lite/blob/master/docs/lite/03-porting-guide.md
* Kami — https://github.com/vanHeemstraDesigns/Kami

⸻

40. Final implementation statement

The target solution is:

LikeC4 defines the architecture.
ArchitectureScene separates architecture semantics from visualization.
SvelteKit provides the application, navigation, state, ADR experience and user interface.
Babylon Lite renders the same architecture world in orthographic 2D and perspective 3D.
Kami defines how the entire environment looks and moves.
Markdown records why architectural decisions were made.
Docker makes the environment reproducible.

Or, in one architecture:

                        LikeC4
                           |
                           v
                  ArchitectureScene
                           |
                           v
                       SvelteKit
                           |
               +-----------+-----------+
               |                       |
               v                       v
           Kami UI                Babylon Lite
                                       |
                              +--------+--------+
                              |                 |
                              v                 v
                           Kami 2D           Kami 3D
                              |                 |
                              +--------+--------+
                                       |
                                       v
                              Architecture Explorer

This is the target architecture.

Future implementation decisions should preserve these boundaries unless a documented Architecture Decision Record deliberately changes them.
