# Memo 4 — SvelteKit 3-Ready LikeC4 Architecture Visualization Platform

Status

Decision: Adopt a Svelte 5 + SvelteKit application architecture for the architecture-decision-records-management platform, using LikeC4 as the architecture modelling engine, Babylon.js as the visualization engine, and Kami as the shared visual language.

The production implementation SHALL initially target the latest stable SvelteKit 2.x, while deliberately adopting an architecture that is ready for SvelteKit 3.

SvelteKit 3 prereleases SHALL NOT be required for production. Once SvelteKit 3 reaches stable maturity, the application SHOULD migrate without requiring a redesign of its domain, rendering, or LikeC4 integration layers.

The target architecture is:

Svelte 5
    +
SvelteKit 2.x → SvelteKit 3
    +
SvelteKit Remote Functions boundary
    +
Open Engineering Architecture Domain
    +
LikeC4 adapter
    +
Canonical Scene Graph
    +
Babylon.js renderer
    +
Kami design tokens
    +
OpenTelemetry

Structurizr is no longer required in the target runtime architecture.

⸻

1. Executive Summary

The architecture visualization application SHALL be implemented as a SvelteKit application rather than as a standalone Vite application or a Structurizr extension.

Its responsibilities are deliberately separated.

LikeC4
    │
    │ architecture semantics
    ▼
Architecture Domain
    │
    │ canonical model
    ▼
Scene Graph
    │
    ├──────────────┐
    ▼              ▼
Babylon.js 2D   Babylon.js 3D
    │              │
    └──────┬───────┘
           ▼
       Kami Theme
           │
           ▼
        Svelte UI

SvelteKit surrounds these components as the application platform:

┌──────────────────────────────────────────────────────────┐
│                      SVELTEKIT                           │
│                                                          │
│  Browser                                                 │
│                                                          │
│  Svelte UI                                               │
│      │                                                   │
│      ├── Kami                                            │
│      │                                                   │
│      └── Babylon.js                                      │
│             ├── 2D                                      │
│             └── 3D                                      │
│                                                          │
│                typed application boundary                │
│                         │                                │
│  ───────────────────────┼─────────────────────────────   │
│                         ▼                                │
│  Server                                                  │
│                                                          │
│  Architecture Application Layer                         │
│      │                                                   │
│      ├── LikeC4 adapter                                  │
│      ├── ADR repository                                  │
│      ├── architecture queries                            │
│      ├── search                                          │
│      ├── relationships                                   │
│      ├── scene generation                                │
│      └── persistence                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘

A fundamental design rule SHALL be:

SvelteKit is an interface onto the architecture engine. SvelteKit is not the architecture engine.

This separation allows the same architecture capabilities eventually to be exposed through SvelteKit, a CLI, MCP, AI agents, automated architecture reviews, documentation generation, or other Open Engineering tooling.

⸻

2. Why SvelteKit

SvelteKit provides considerably more value to this application than using Svelte with Vite alone.

SvelteKit becomes the application platform responsible for:

* routing;
* server-side execution;
* client/server boundaries;
* type-safe application operations;
* SSR where useful;
* prerendering where useful;
* static asset delivery;
* application configuration;
* deployment adapters;
* error handling;
* observability;
* security boundaries;
* container deployment.

Svelte itself remains responsible primarily for reactive UI composition.

Babylon.js remains responsible for visualization.

LikeC4 remains responsible for architecture modelling.

Kami remains responsible for visual language.

This provides clear ownership:

$app/navigation    → navigation
$app/state         → application state
$app/forms         → forms
$app/server        → server operations
Svelte             → UI composition
LikeC4             → architecture semantics
Architecture Core  → application/domain semantics
Babylon.js         → visualization
Kami               → visual identity
OpenTelemetry      → observability

⸻

3. Why We Are Designing for SvelteKit 3

SvelteKit 3 introduces and consolidates capabilities that fit this application particularly well.

The most important is the increasingly integrated remote-function model.

Rather than designing the application primarily around manually maintained REST endpoints such as:

Svelte component
      ↓
fetch('/api/architecture/decision/ADR-001')
      ↓
+server.ts
      ↓
validation
      ↓
architecture service
      ↓
JSON
      ↓
client interface
      ↓
component

the application SHOULD move toward domain-oriented operations:

Svelte component
      │
      │ getDecision("ADR-001")
      ▼
SvelteKit boundary
      │
      ▼
Architecture application layer
      │
      ▼
LikeC4 / ADR repository

This removes unnecessary transport-oriented thinking from the application.

The UI asks architecture questions rather than constructing HTTP requests.

⸻

4. SvelteKit 2 First, SvelteKit 3 Ready

The production implementation SHALL initially use stable SvelteKit 2.x.

It SHALL NOT depend on SvelteKit 3 prerelease APIs.

However, the codebase SHALL be structured so that migration to SvelteKit 3 is inexpensive.

The application SHOULD therefore use:

SvelteKit
    │
    ▼
transport/interface adapter
    │
    ▼
application services
    │
    ▼
domain

rather than:

SvelteKit
    │
    ▼
domain logic mixed throughout routes

Framework-specific APIs MUST remain at the edges of the system.

⸻

5. Architecture Domain

The project SHALL introduce an explicit architecture domain between LikeC4 and the visualization layer.

This is important.

Babylon.js MUST NOT operate directly on the LikeC4 AST.

Likewise, Svelte components MUST NOT become dependent on LikeC4 implementation details.

Instead:

LikeC4
   │
   ▼
LikeC4 Adapter
   │
   ▼
Canonical Architecture Model
   │
   ▼
Scene Graph
   │
   ▼
Babylon.js

This allows LikeC4 to remain replaceable and allows additional model sources to be introduced later.

⸻

6. Canonical Architecture Model

The application SHALL define its own canonical model.

Conceptually:

ArchitectureModel
│
├── Elements
│
├── Relationships
│
├── Decisions
│
├── Views
│
├── Groups
│
├── Metadata
│
└── References

Representative TypeScript definitions may look like:

export type ArchitectureElementId = string;
export type DecisionId = string;
export type ViewId = string;
export interface ArchitectureElement {
    id: ArchitectureElementId;
    kind: ArchitectureElementKind;
    name: string;
    description?: string;
    parent?: ArchitectureElementId;
    metadata: Record<string, unknown>;
}
export interface ArchitectureRelationship {
    id: string;
    source: ArchitectureElementId;
    target: ArchitectureElementId;
    label?: string;
}
export interface ArchitectureDecision {
    id: DecisionId;
    title: string;
    status: DecisionStatus;
    markdown?: string;
    relatedElements: ArchitectureElementId[];
}
export interface ArchitectureView {
    id: ViewId;
    name: string;
    elements: ArchitectureElementId[];
}

The exact schema may evolve.

The architectural boundary MUST NOT.

⸻

7. ADRs Are First-Class Citizens

Architecture Decision Records SHALL remain first-class architecture entities.

They MUST NOT merely be treated as documentation attached to another element.

The canonical architecture model therefore includes:

System
Container
Component
Person
Group
Relationship
Decision
View

A decision can relate to:

Decision
   │
   ├── System
   ├── Container
   ├── Component
   ├── Relationship
   ├── another Decision
   └── external evidence

This solves one of the limitations encountered with the earlier Structurizr-oriented approach.

ADRs can therefore become actual visual objects in both 2D and 3D.

⸻

8. LikeC4 Adapter

LikeC4 SHALL be treated as an infrastructure adapter.

Conceptually:

src/lib/architecture/infrastructure/likec4/

Its responsibility is:

LikeC4 source
      ↓
parse
      ↓
resolve
      ↓
LikeC4 model
      ↓
translate
      ↓
Canonical Architecture Model

No Babylon-specific concerns belong here.

No Kami-specific concerns belong here.

No Svelte-specific concerns belong here.

This is purely architecture-model translation.

⸻

9. Application Services

Architecture operations SHALL be represented as normal TypeScript application functions.

For example:

getArchitecture()
getArchitectureContext()
getElement()
getRelationships()
getDecisions()
getDecision()
getChildren()
getParents()
getDependencies()
getDependants()
getView()
searchArchitecture()

Representative usage:

const context = await getArchitectureContext(elementId);

These functions MUST NOT inherently be SvelteKit remote functions.

Instead:

                         ┌── SvelteKit
                         │
application service ─────┼── CLI
                         │
                         ├── MCP
                         │
                         ├── tests
                         │
                         └── future agents

This is one of the most important architectural decisions in this memo.

⸻

10. Remote Functions

Where appropriate, SvelteKit remote functions SHOULD expose application services to the browser.

For example:

architecture.remote.ts
decisions.remote.ts
search.remote.ts
views.remote.ts

Conceptually:

export const architectureContext = query(...);

which delegates to:

getArchitectureContext(...)

The remote function MUST remain thin.

It may perform:

* validation;
* authentication;
* authorization;
* transport-specific error mapping;
* telemetry;
* request-context handling.

It MUST NOT contain core architecture logic.

⸻

11. Query-Oriented Architecture Exploration

Architecture exploration maps particularly well onto SvelteKit’s query model.

Read operations SHOULD eventually appear as operations such as:

getModel()
getView(id)
getElement(id)
getChildren(id)
getParents(id)
getRelationships(id)
getDependencies(id)
getDependants(id)
getDecisions(id)
getDecision(id)
searchArchitecture(query)

Mutation operations SHOULD be represented separately:

createDecision()
updateDecision()
createRelationship()
deleteRelationship()
moveElement()
saveLayout()
createView()
updateView()

This provides a very clear distinction:

QUERY
  │
  └── understand architecture
COMMAND
  │
  └── change architecture

This distinction SHOULD be preserved independently of SvelteKit so that the same vocabulary can later be used by agents and other Open Engineering interfaces.

⸻

12. Canonical Scene Graph

Babylon.js SHOULD consume a scene representation rather than the complete architecture model.

The transformation is:

Architecture Model
       │
       ▼
Scene Builder
       │
       ▼
Canonical Scene Graph
       │
       ▼
Babylon.js

A representative node might be:

export interface SceneNode {
    id: string;
    kind: ArchitectureElementKind;
    label: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    styleToken: string;
}

Relationships similarly become scene edges.

export interface SceneEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
    styleToken: string;
}

This ensures Babylon.js never needs to understand LikeC4 syntax.

⸻

13. One Scene Graph, Two Representations

The application SHOULD use the same canonical scene graph for both 2D and 3D.

                   Scene Graph
                       │
              ┌────────┴────────┐
              ▼                 ▼
         2D Projection      3D Projection
              │                 │
              ▼                 ▼
          Babylon.js        Babylon.js

The difference between 2D and 3D therefore becomes primarily:

camera
layout
depth
lighting
interaction
animation

rather than two independent rendering implementations.

⸻

14. Babylon.js

Babylon.js SHALL replace the earlier Three.js-oriented visualization concept.

Babylon.js is responsible for:

* scene creation;
* cameras;
* meshes;
* materials;
* labels;
* connections;
* picking;
* animation;
* zoom;
* pan;
* orbit;
* transitions;
* 2D presentation;
* 3D presentation.

Where practical, the lighter-weight/modular Babylon.js packages SHOULD be used instead of importing the entire engine.

Imports SHOULD be tree-shakeable.

For example, only required Babylon functionality should enter the browser bundle.

This is especially important because the application shell itself should remain lightweight.

⸻

15. Lazy Loading Babylon.js

Babylon.js SHOULD NOT unnecessarily increase the initial SvelteKit bundle.

The renderer SHOULD be dynamically loaded when the architecture canvas is required.

Conceptually:

const renderer = await import('$lib/renderer/babylon');

This provides:

Initial request
    │
    ▼
SvelteKit shell
    │
    ▼
architecture page
    │
    ▼
load Babylon renderer

instead of:

every page
    │
    ▼
download Babylon.js

⸻

16. Kami Theme

Kami SHALL remain the single visual source of truth.

The application SHALL NOT separately invent:

CSS theme
Babylon theme
LikeC4 theme

Instead:

Kami Design Tokens
        │
        ├── CSS variables
        │
        ├── Svelte components
        │
        ├── Babylon materials
        │
        ├── node styles
        │
        ├── edge styles
        │
        └── typography

Representative tokens could include:

kami.color.background
kami.color.surface
kami.color.primary
kami.color.secondary
kami.color.text
kami.color.muted
kami.architecture.system
kami.architecture.container
kami.architecture.component
kami.architecture.person
kami.architecture.decision
kami.relationship.normal
kami.relationship.highlighted
kami.radius.default
kami.shadow.default
kami.spacing.default

Babylon materials SHALL be generated from these tokens.

Svelte CSS SHALL use the same tokens.

⸻

17. 2D and 3D Must Look Like the Same Product

Switching between 2D and 3D MUST NOT look like switching between unrelated applications.

For example:

SYSTEM
  ↓
Kami system token
  ├── 2D card
  └── 3D system mesh
DECISION
  ↓
Kami decision token
  ├── 2D decision card
  └── 3D decision object

Color, typography, visual hierarchy and semantic identity MUST remain consistent.

⸻

18. Svelte Components

Svelte SHALL own UI composition around the visualization.

Potential components include:

ArchitectureCanvas.svelte
ArchitectureToolbar.svelte
ViewSelector.svelte
DimensionSelector.svelte
ArchitectureSearch.svelte
ElementInspector.svelte
RelationshipInspector.svelte
DecisionInspector.svelte
Breadcrumbs.svelte
NavigationHistory.svelte
KamiPanel.svelte
KamiDialog.svelte

Babylon.js MUST NOT become responsible for ordinary application UI.

For example, selecting a node may originate in Babylon:

Babylon picking
      ↓
element ID
      ↓
Svelte state
      ↓
ElementInspector

⸻

19. Navigation

Architecture navigation SHOULD be reflected in application URLs where useful.

For example:

/
 /architecture
 /architecture/views
 /architecture/views/:id
 /architecture/elements/:id
 /architecture/decisions/:id

This provides:

* browser history;
* deep links;
* bookmarks;
* shareable architecture references;
* reload-safe navigation.

The Babylon scene SHOULD synchronize with application navigation rather than implementing a separate hidden navigation system.

⸻

20. Server-Side Architecture Processing

Architecture parsing and processing SHOULD remain server-side whenever browser execution provides no clear benefit.

Examples include:

LikeC4 parsing
ADR Markdown loading
repository traversal
search indexing
architecture validation
relationship analysis
graph queries
model transformations

The browser SHOULD receive purpose-specific DTOs.

For example:

Browser asks:
getElement("payment-service")
Server returns:
ElementDetailsDTO

rather than:

Browser downloads:
entire LikeC4 AST

⸻

21. OpenTelemetry

The application SHOULD be designed for OpenTelemetry observability.

Once the relevant SvelteKit observability APIs are sufficiently stable, server operations SHOULD emit traces.

An architecture interaction might become:

architecture.view.open
    │
    ├── architecture.model.load
    │
    ├── architecture.view.resolve
    │
    ├── architecture.relationships.resolve
    │
    ├── architecture.decisions.resolve
    │
    └── architecture.scene.generate

A decision interaction might become:

architecture.decision.open
    │
    ├── adr.load
    ├── adr.references.resolve
    └── architecture.context.resolve

This aligns naturally with the Open Engineering principle that system behavior should be observable and explainable.

⸻

22. Browser Performance

The visualization MUST remain responsive for substantial architecture models.

The implementation SHOULD therefore consider:

* lazy-loading Babylon;
* modular Babylon packages;
* instanced meshes;
* thin instances where appropriate;
* scene freezing where appropriate;
* selective label rendering;
* level-of-detail strategies;
* viewport-based detail;
* incremental graph loading;
* caching query results;
* Web Workers for expensive browser-side layout operations where necessary.

The system SHOULD avoid rendering every piece of architecture information simultaneously.

⸻

23. Progressive Architecture Loading

Large models SHOULD support progressive exploration.

Instead of:

load entire enterprise
      ↓
render 20,000 objects

prefer:

load selected view
      ↓
render visible context
      ↓
user selects element
      ↓
request related context
      ↓
expand scene

This combines particularly well with query-oriented SvelteKit application services.

⸻

24. Proposed Repository Structure

The implementation SHOULD converge toward:

.
├── src/
│   ├── lib/
│   │   │
│   │   ├── architecture/
│   │   │   ├── domain/
│   │   │   │   ├── architecture.ts
│   │   │   │   ├── element.ts
│   │   │   │   ├── relationship.ts
│   │   │   │   ├── decision.ts
│   │   │   │   └── view.ts
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── get-architecture.ts
│   │   │   │   ├── get-context.ts
│   │   │   │   ├── get-element.ts
│   │   │   │   ├── get-decision.ts
│   │   │   │   ├── get-view.ts
│   │   │   │   └── search.ts
│   │   │   │
│   │   │   └── infrastructure/
│   │   │       ├── likec4/
│   │   │       └── adr/
│   │   │
│   │   ├── scene/
│   │   │   ├── scene.ts
│   │   │   ├── scene-node.ts
│   │   │   ├── scene-edge.ts
│   │   │   └── scene-builder.ts
│   │   │
│   │   ├── renderer/
│   │   │   └── babylon/
│   │   │       ├── engine.ts
│   │   │       ├── scene.ts
│   │   │       ├── camera.ts
│   │   │       ├── nodes.ts
│   │   │       ├── edges.ts
│   │   │       ├── picking.ts
│   │   │       └── animation.ts
│   │   │
│   │   ├── theme/
│   │   │   └── kami/
│   │   │       ├── tokens.ts
│   │   │       ├── css.ts
│   │   │       └── babylon.ts
│   │   │
│   │   └── components/
│   │
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   └── architecture/
│   │
│   └── remote/
│       ├── architecture.remote.ts
│       ├── decisions.remote.ts
│       └── search.remote.ts
│
├── architecture/
│   ├── model/
│   └── decisions/
│
├── static/
│
├── tests/
│
├── Dockerfile
├── compose.yaml
├── .dockerignore
├── .env.example
├── package.json
├── svelte.config.js
├── vite.config.ts
└── README.md

The exact placement of SvelteKit-specific remote-function files SHALL follow the API conventions of the SvelteKit version actually installed.

⸻

25. Testing Strategy

The architecture SHALL make testing possible without starting SvelteKit or Babylon.js.

Domain tests

LikeC4 fixture
      ↓
adapter
      ↓
ArchitectureModel
      ↓
assertions

Application tests

const result = await getArchitectureContext('foo');

These tests MUST NOT require a browser.

Scene tests

ArchitectureModel
      ↓
SceneBuilder
      ↓
SceneGraph
      ↓
assertions

These SHOULD NOT require Babylon.

Renderer tests

Renderer tests validate:

* scene construction;
* picking;
* materials;
* cameras;
* transitions.

End-to-end tests

Finally:

SvelteKit
    +
Babylon
    +
LikeC4

is validated through browser-level tests.

This layered strategy is another direct consequence of keeping the framework at the boundary.

⸻

26. Container Architecture

The application SHALL run as a Docker container.

The target runtime is:

Browser
   │
   │ HTTP
   ▼
SvelteKit Node server
   │
   ├── static Svelte assets
   ├── application operations
   ├── LikeC4
   └── ADR content

The production container SHOULD use a multi-stage build.

⸻

27. Dockerfile

A representative implementation is:

FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["node", "build"]

The exact Node baseline SHALL follow the supported baseline of the chosen SvelteKit release.

The application SHOULD use @sveltejs/adapter-node.

⸻

28. compose.yaml

A representative local deployment is:

name: architecture-decision-records
services:
  architecture:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "${APP_PORT:-8080}:3000"
    environment:
      NODE_ENV: production
      HOST: 0.0.0.0
      PORT: 3000
    volumes:
      - ./architecture:/app/architecture:ro
    restart: unless-stopped
    logging:
      options:
        max-size: "10m"
        max-file: "3"

Unlike the earlier Structurizr container, no special user mapping SHOULD be required merely to run the application.

⸻

29. Environment Configuration

.env.example SHOULD contain only configuration that genuinely varies between deployments.

For example:

APP_PORT=8080
ARCHITECTURE_ROOT=/app/architecture
OTEL_ENABLED=false
OTEL_SERVICE_NAME=architecture-decision-records

Secrets MUST NOT be committed.

Browser-visible environment values MUST be explicitly distinguished from server-only configuration.

⸻

30. Local Development

The expected development workflow is:

npm install
npm run dev

The application becomes available through the SvelteKit development server.

Production-like execution:

docker compose build
docker compose up -d

Then:

http://localhost:8080

⸻

31. Development Container Versus Production Container

Development SHOULD normally use the native SvelteKit development server for fast HMR.

Docker SHOULD primarily represent the deployable runtime.

If containerized development is required later, a dedicated development Compose profile MAY be added.

Production and development concerns SHOULD NOT be unnecessarily mixed in one container definition.

⸻

32. Migration Path from the Existing Structurizr Implementation

Migration SHOULD be incremental.

Phase 1 — Foundation

Create:

Svelte 5
SvelteKit 2
adapter-node
Docker
Compose

Verify:

browser
   ↓
SvelteKit
   ↓
container

Phase 2 — Architecture Domain

Introduce:

ArchitectureModel
ArchitectureElement
ArchitectureRelationship
ArchitectureDecision
ArchitectureView

No renderer yet.

Phase 3 — LikeC4

Introduce the LikeC4 adapter.

Verify:

LikeC4
   ↓
ArchitectureModel

using automated tests.

Phase 4 — Scene Graph

Implement:

ArchitectureModel
   ↓
SceneBuilder
   ↓
SceneGraph

Again, without Babylon.

Phase 5 — Babylon 2D

Implement the initial architecture canvas using Babylon.js in a primarily two-dimensional projection.

This establishes:

* nodes;
* edges;
* selection;
* zoom;
* pan;
* labels;
* Kami styling.

Phase 6 — ADR Visualization

Add Decision nodes as first-class scene objects.

Support:

Decision → Element
Decision → Relationship
Decision → Decision

and opening the corresponding Markdown ADR.

Phase 7 — 3D

Extend the same scene graph into 3D.

Add:

* depth;
* perspective;
* orbit camera;
* spatial grouping;
* animated transitions.

Phase 8 — SvelteKit Application Services

Move architecture interactions behind application services.

For example:

getArchitectureContext()
getDecision()
getRelationships()
searchArchitecture()

Phase 9 — Remote Functions

Where sufficiently stable, expose these application services using SvelteKit remote functions.

Do not move domain logic into the remote functions.

Phase 10 — Observability

Introduce OpenTelemetry.

Trace architecture operations and application performance.

Phase 11 — SvelteKit 3

Once SvelteKit 3 is stable and its migration guidance is mature:

SvelteKit 2
      ↓
migration
      ↓
SvelteKit 3

The architecture domain, LikeC4 adapter, scene graph, Babylon renderer and Kami implementation SHOULD require little or no redesign.

⸻

33. CI Strategy

CI SHOULD test both the production baseline and, once practical, the future framework baseline.

Initially:

CI
 │
 ├── lint
 ├── typecheck
 ├── unit tests
 ├── build
 └── Docker build

Later, a non-blocking SvelteKit 3 compatibility job MAY be introduced:

CI
 │
 ├── SvelteKit stable       REQUIRED
 │
 └── SvelteKit next         ALLOWED TO FAIL

As SvelteKit 3 approaches stable maturity, this job can become increasingly important.

This allows incompatibilities to be discovered before the actual migration.

⸻

34. Dependency Policy

Framework dependencies SHOULD remain deliberately current.

The project SHOULD avoid long-term pinning to an obsolete SvelteKit 2 release.

Dependabot or Renovate SHOULD be considered for:

Svelte
SvelteKit
LikeC4
Babylon.js
adapter-node
Vite
TypeScript
OpenTelemetry

Major upgrades MUST remain explicit architectural decisions.

⸻

35. Security

Server-only concerns MUST remain server-side.

This includes:

* filesystem access;
* private repository credentials;
* future database credentials;
* telemetry credentials;
* authentication secrets;
* private architecture sources.

Babylon.js and browser code MUST receive only data intended for the current user.

Remote functions MUST NOT be interpreted as a replacement for authorization.

Every mutation MUST enforce authorization server-side.

⸻

36. Future MCP Integration

The separation introduced in this architecture deliberately enables future MCP support.

For example:

                       ┌── SvelteKit UI
                       │
Architecture Services ─┼── CLI
                       │
                       ├── MCP Server
                       │
                       └── AI Agent

An MCP tool could eventually expose:

architecture_get_element
architecture_get_context
architecture_get_dependencies
architecture_get_decisions
architecture_search

without duplicating architecture logic.

⸻

37. Future AI Integration

The same boundary enables an AI assistant to answer questions such as:

Why does this component exist?
Which ADR introduced this dependency?
What depends on this container?
Which decisions affect this system?
Show the blast radius if this component changes.
Which architectural decisions contradict this relationship?

The AI agent queries the architecture application layer.

It does not need to scrape the Babylon scene.

This distinction is essential.

⸻

38. Open Engineering Compatibility

Although this repository can function independently, its architecture SHOULD align with Open Engineering principles.

In particular:

Architecture
      │
      ├── observable
      ├── queryable
      ├── explainable
      ├── composable
      ├── machine-readable
      └── human-readable

The architecture model becomes more than visualization input.

It becomes an operational source of architectural knowledge.

⸻

39. Final Architecture

The resulting system is:

                         USERS
                           │
                           ▼
                    ┌─────────────┐
                    │ Svelte UI   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Babylon.js  │
                    │   2D / 3D   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Scene Graph │
                    └──────┬──────┘
                           │
                ┌──────────▼──────────┐
                │ Architecture Domain │
                └──────────┬──────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
         LikeC4           ADRs       Future Sources
                APPLICATION INTERFACES
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
        SvelteKit         CLI            MCP
            │                              │
            │                              ▼
            │                          AI Agents
            │
            ▼
       Remote Functions
                CROSS-CUTTING CONCERNS
            Kami Design System
                    +
              OpenTelemetry
                    +
                 Docker

⸻

40. Final Decision

The implementation SHALL proceed with:

Svelte 5 + stable SvelteKit 2.x + LikeC4 + Babylon.js + Kami.

The architecture SHALL simultaneously be optimized for migration to SvelteKit 3.

The most important design decisions are:

1. SvelteKit is the application platform, not the architecture engine.
2. LikeC4 is an adapter, not the application’s internal domain model.
3. A canonical Architecture Model separates architecture semantics from LikeC4.
4. A canonical Scene Graph separates architecture semantics from Babylon.js.
5. Babylon.js renders both 2D and 3D representations.
6. Kami supplies common design tokens to Svelte and Babylon.js.
7. ADRs are first-class architecture entities.
8. Architecture operations are normal application services.
9. SvelteKit remote functions expose those services rather than contain them.
10. Architecture queries and commands form a reusable application vocabulary.
11. OpenTelemetry makes architecture operations observable.
12. Docker provides the deployable runtime.
13. SvelteKit 3 adoption happens after stabilization rather than by building production on a prerelease.
14. The architecture domain remains reusable by SvelteKit, CLI, MCP, AI agents and future Open Engineering tooling.

The resulting application is therefore no longer merely an architecture diagram viewer.

It becomes a queryable, interactive architecture knowledge platform in which LikeC4 defines architecture, ADRs explain architecture, Babylon.js makes architecture spatially understandable, Kami makes it visually coherent, SvelteKit makes it an application, and the Open Engineering-compatible domain layer makes that architectural knowledge reusable by both humans and machines.
