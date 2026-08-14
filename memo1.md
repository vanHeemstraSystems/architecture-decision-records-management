# Memo 1 — A Kami-Styled, Context-Preserving, Decision-Aware 2D/3D Architecture Explorer

Status: Proposed  
Repository: vanHeemstraSystems/architecture-decision-records-management.  
Purpose: Define the implementation vision for evolving the existing Structurizr-based architecture and ADR environment into a coherent Kami-styled, context-preserving architecture explorer spanning Structurizr diagrams, SVG visualisations, and interactive Three.js 3D views.  

⸻

## 1. Executive Summary

This repository already demonstrates several powerful ideas:

* architecture described as code using Structurizr DSL;
* C4 architecture views generated from workspace.dsl;
* Architecture Decision Records maintained as Markdown;
* ADR relationships visualised separately;
* architecture rendered in conventional 2D views;
* architecture explored spatially through Three.js-based 3D visualisation.

The next evolution should not replace Structurizr.

Instead, Structurizr should become the authoritative architecture model, while multiple visual projections are generated from that model.

The proposed architecture is:

                         ARCHITECTURE KNOWLEDGE
                               │
                        workspace.dsl
                               │
                  ┌────────────┴────────────┐
                  │                         │
             C4 architecture              ADRs
                  │                    Markdown
                  │                         │
                  └────────────┬────────────┘
                               │
                               ▼
                     Architecture Graph
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       Structurizr 2D      Kami SVG         Three.js 3D
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                         Kami Design
                            System

The governing principle is:

One architecture model, one architectural history, one visual language, multiple projections.

Structurizr defines what the architecture means.

Markdown ADRs explain why the architecture became what it is.

Kami defines how the architecture feels.

SVG provides specialised state, flow, lifecycle, and regional projections.

Three.js provides spatial exploration and semantic zoom.

⸻

## 2. Motivation

The existing implementation reveals several shortcomings inherent in conventional architecture diagrams.

2.1 Loss of spatial memory during drill-down

Moving from a System Landscape or System Context diagram into a Container view effectively replaces one diagram with another.

For example:

System A ───────── System B ───────── System C
                       │
                       ▼
                open System B

becomes:

API ───────── Worker ───────── Database

Although the second view contains more detail, the viewer has lost the spatial context of:

System A ←→ System B ←→ System C

The user therefore has to reconstruct the previous mental model.

The desired behaviour is closer to semantic zoom:

A ─────────────── [ B ] ─────────────── C
                       │
                       ▼
A · · ·     ╭────────── B ──────────╮     · · · C
            │                       │
            │ API → Worker → DB     │
            │                       │
            ╰───────────────────────╯

The surrounding architecture should remain visible while the selected subject reveals more detail.

⸻

2.2 Conventional Structurizr styling is visually harsh

The conventional C4/Structurizr aesthetic tends toward:

* strongly coloured rectangles;
* heavy boundaries;
* relatively dense text;
* diagram-tool aesthetics;
* limited visual hierarchy;
* little editorial whitespace.

The repository should instead adopt the visual language defined by Kami.

Kami is already used for SVG visualisations and should become the shared design system for all architecture projections.

⸻

2.3 Not every architectural concept belongs in C4

C4 is excellent for describing:

* people;
* software systems;
* containers;
* components;
* deployment relationships.

It is less appropriate for expressing concepts such as:

* state;
* lifecycle;
* transitions;
* regions;
* operational phases;
* temporal processes;
* decision history.

These should not be forced into C4 boxes.

Instead:

The same architecture knowledge should support multiple projections appropriate to the question being asked.

⸻

2.4 Architecture Decisions deserve first-class spatial representation

ADRs are already first-class content within this repository.

They are not:

* software systems;
* containers;
* components;
* deployment nodes.

They represent something fundamentally different:

Architectural rationale.

Structurizr supports ADRs and provides an ADR explorer, including relationships between decisions such as supersession.

The Three.js architecture explorer should therefore represent decisions without pretending that decisions are C4 elements.

This opens an opportunity to visualise not only architecture, but also the reasoning that produced the architecture.

⸻

## 3. Architectural Principle

The implementation should separate four concerns.

┌───────────────────────────────────────────────┐
│                ARCHITECTURE MODEL             │
│                                               │
│                workspace.dsl                  │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│              ARCHITECTURAL RATIONALE          │
│                                               │
│                  ADR/*.md                     │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│               VISUAL DESIGN SYSTEM            │
│                                               │
│                     Kami                      │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│                 VISUALISATIONS                │
│                                               │
│ Structurizr 2D │ SVG │ Three.js │ future ... │
└───────────────────────────────────────────────┘

No renderer should become the source of truth.

⸻

## 4. Structurizr Remains the Architecture Model

workspace.dsl should remain authoritative for the structural architecture.

Structurizr DSL already supports:

* people;
* software systems;
* containers;
* components;
* deployment environments;
* relationships;
* groups;
* views;
* perspectives;
* documentation;
* ADR imports;
* styling;
* themes.

The DSL should therefore describe architectural semantics, not renderer-specific appearance wherever that can be avoided.

The compiled workspace.json becomes particularly useful for downstream renderers.

Structurizr describes workspace.json as the compiled representation of the DSL workspace, additionally containing layout information.

The implementation pipeline should therefore include:

workspace.dsl
      │
      │ Structurizr CLI
      ▼
workspace.json
      │
      ├────────▶ Structurizr
      │
      ├────────▶ Three.js
      │
      └────────▶ auxiliary generators

This gives external renderers a stable machine-readable representation of the architecture.

⸻

## 5. Kami as the Shared Visual Design System

The Kami repository should define the canonical visual language.

Reference:

https://github.com/vanHeemstraDesigns/Kami

The design should emphasise:

* warm parchment surfaces;
* restrained warm neutrals;
* ink blue as the primary chromatic accent;
* generous whitespace;
* thin geometric strokes;
* restrained typography;
* minimal visual noise;
* little or no hard shadow;
* no gratuitous gradients;
* no arbitrary rainbow colouring.

The visual objective is closer to:

an architectural drawing or carefully composed editorial plate

than:

an enterprise diagramming application.

⸻

## 6. Design Tokens

Renderer-specific styles should not independently define the visual language.

Introduce canonical Kami architecture tokens.

For example:

{
  "canvas": "#f5f4ed",
  "ink": "#1B365D",
  "text": "#2C2924",
  "muted": "#777064",
  "border": "#B8B1A4",
  "surface": "#F5F4ED",
  "surfaceMuted": "#EFEDE4"
}

The exact canonical values should ultimately be sourced from Kami rather than duplicated manually.

The dependency becomes:

                       Kami tokens
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
      Structurizr       SVG/CSS       Three.js
          theme                           theme

⸻

## 7. Kami Structurizr Theme

Structurizr supports reusable JSON themes containing tag-based element and relationship styles.

A Kami Structurizr adapter should therefore be introduced.

Possible structure:

doc/architecture/
├── workspace.dsl
├── workspace.json
│
├── themes/
│   └── kami/
│       ├── theme.dsl
│       ├── theme.json
│       └── README.md
│
├── decisions/
│
└── visualisations/

An initial style might conceptually resemble:

styles {
    element "Element" {
        shape RoundedBox
        background #F5F4ED
        color #2C2924
        stroke #B8B1A4
        strokeWidth 1
    }
    element "Software System" {
        background #F5F4ED
        color #1B365D
        stroke #1B365D
        strokeWidth 2
    }
    element "Container" {
        background #EFEDE4
        color #2C2924
        stroke #9E978B
        strokeWidth 1
    }
    relationship "Relationship" {
        color #777064
        thickness 1
        routing Curved
    }
}

The precise properties should be validated against the Structurizr version used by the repository.

Structurizr themes can be generated from a DSL workspace with the CLI:

structurizr export \
  -workspace theme.dsl \
  -format theme

producing theme.json.

⸻

## 8. Kami Compliance Levels

Not every renderer provides identical capabilities.

Trying to pixel-match all renderers would create unnecessary complexity.

Define three compliance levels.

8.1 Kami Native

Used where complete presentation control exists.

Examples:

* SVG;
* HTML;
* generated reports.

Supports:

* exact typography;
* exact spacing;
* exact strokes;
* complete layout control.

⸻

8.2 Kami Adapted

Used for Structurizr’s native diagram renderer.

Preserve:

* palette;
* visual hierarchy;
* rounded geometry;
* restrained relationships;
* whitespace;
* grouping conventions.

Accept renderer-native typography or other unavoidable limitations.

⸻

8.3 Kami Spatial

Used for Three.js.

Preserve the same visual principles while introducing genuinely spatial concepts:

* depth;
* elevation;
* camera;
* lighting;
* materials;
* animation;
* interaction.

⸻

## 9. Groups as Regions

Structurizr group should be used where collections of elements belong within a conceptual region.

Groups can be nested and are rendered as boundaries.

For example:

payments = softwareSystem "Payments" {
    group "EU Region" {
        group "Application" {
            api = container "API"
            worker = container "Worker"
        }
        group "Data" {
            database = container "Database"
            cache = container "Cache"
        }
    }
}

Conceptually:

╭──────────────────── EU Region ────────────────────╮
│                                                   │
│   ╭──── Application ────╮   ╭────── Data ──────╮ │
│   │                     │   │                   │ │
│   │   API      Worker   │──▶│ DB       Cache   │ │
│   │                     │   │                   │ │
│   ╰─────────────────────╯   ╰───────────────────╯ │
│                                                   │
╰───────────────────────────────────────────────────╯

Kami styling should make these boundaries subtle rather than visually dominant.

⸻

## 10. Context-Preserving Drill-Down

This should become a core interaction principle.

Drilling down must reveal detail without destroying the user’s mental map of the level above.

When entering a system:

Identity ───── Payments ───── Orders

do not replace the entire view with:

API ───── Worker ───── Database

Instead render:

Identity · · · ╭──────── PAYMENTS ────────╮ · · · Orders
               │                          │
               │ API → Worker → Database  │
               │                          │
               ╰──────────────────────────╯

The selected architecture should receive Kami ink emphasis.

Surrounding context should remain visible in subdued warm neutrals.

A useful visual convention is:

Ink = where I am.

Graphite = surrounding context.

Parchment = architectural space.

⸻

## 11. Semantic Zoom

The long-term interaction model should resemble geographical mapping more than page navigation.

At the landscape level:

Payments          Identity          Orders

Zoom into Payments:

             PAYMENTS
       API     Worker     Data
Identity                    Orders

Zoom into API:

              PAYMENTS
          ╭──── API ────╮
          │             │
          │ Controller  │
          │     ↓       │
          │ Service     │
          │     ↓       │
          │ Repository  │
          │             │
          ╰─────────────╯

The architecture should retain stable geography wherever practical.

⸻

## 12. Three.js as the Spatial Renderer

Three.js should consume the same architecture and Kami semantics.

The Three.js renderer should not invent a separate visual identity.

Instead:

Structurizr style             Three.js
background          ───────▶ material.color
color               ───────▶ text/label colour
stroke              ───────▶ outline colour
opacity             ───────▶ material.opacity
width/height        ───────▶ geometry dimensions
shape               ───────▶ geometry family
relationship color  ───────▶ line material
relationship width  ───────▶ line/tube width

Where Structurizr supplies resolved styling, Three.js should honour it where meaningful.

⸻

## 13. Three.js-Specific Kami Properties

Three-dimensional visualisation necessarily introduces properties Structurizr does not define.

Examples include:

depth
elevation
roughness
metalness
lighting
camera
fog
animation
hover
selection
castShadow
receiveShadow

These belong in the Kami Three.js adapter.

For example:

export const KAMI_3D = {
    material: {
        roughness: 0.92,
        metalness: 0.0
    },
    geometry: {
        cornerRadius: 0.08,
        depth: 0.15
    },
    elevation: {
        softwareSystem: 0.0,
        container: 0.25,
        component: 0.5
    },
    shadows: {
        enabled: false
    }
};

The intention is not shiny 3D cubes.

The visual metaphor should be:

a physical architectural model constructed from warm paper, card, ink and drafting materials.

Prefer:

* matte surfaces;
* restrained depth;
* soft ambient lighting;
* little or no specular reflection;
* near-orthographic perspective;
* slow camera transitions;
* restrained animation.

Avoid:

* chrome;
* neon;
* excessive reflections;
* strong game-like lighting;
* arbitrary colours;
* gratuitous animation.

⸻

## 14. Semantic Zoom in Three.js

Three.js provides an opportunity to solve context loss much better than conventional 2D drill-down.

Selecting Payments should cause:

1. the camera to approach Payments;
2. Payments to expand;
3. its containers to become visible;
4. surrounding systems to remain spatially stable;
5. surrounding systems to become visually subdued.

For example:

                Identity
                   │
        ╭────── Payments ──────╮
        │                      │
        │    API       DB      │
        │     │         ▲      │
        │     └─────────┘      │
        │                      │
        ╰──────────────────────╯
                   │
                 Orders

The architecture becomes a space one navigates rather than a sequence of unrelated pages.

⸻

## 15. SVG as a Complementary Projection

SVG should remain available for architectural questions that C4 does not naturally express.

Use Structurizr/C4 for questions such as:

* Who uses what?
* What communicates with what?
* What contains what?
* What runs where?

Use specialised Kami SVG views for questions such as:

* What happens inside this process?
* What state is this element in?
* What transitions are possible?
* What lifecycle does this follow?
* Which region contains these concepts?
* How does something evolve over time?

Therefore:

                     Architecture Knowledge
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
      C4 Projection     State Projection   Spatial Projection
          │                  │                  │
          ▼                  ▼                  ▼
     Structurizr             SVG             Three.js

Switching between them should feel like turning pages in the same architecture book.

⸻

## 16. Perspectives

Structurizr perspectives should be exploited to preserve spatial memory while changing the architectural question.

Potential perspectives include:

Architecture
Security
Ownership
Runtime
Cost
Risk
Technical Debt
Compliance

Instead of generating unrelated diagrams, the same spatial arrangement can be restyled according to a selected perspective.

This supports an important cognitive principle:

Keep the objects stable; change the information projected onto them.

⸻

## 17. Architecture Decisions as First-Class Citizens

ADRs must become first-class citizens of the architecture explorer.

However:

A Decision is not another C4 element.

A decision represents architectural rationale.

It explains why architectural elements and relationships exist in their current form.

Therefore a Decision should have its own visual primitive.

⸻

## 18. Decision Visual Primitive

Do not represent ADRs as ordinary system/container boxes.

Use a distinct Kami primitive such as:

◇ ADR-017

or:

◆ ADR-017

Conceptually:

                     ◇ ADR-017
                    ╱
           ◇ ADR-012
              ╲
               ╲
             [ ORDERS ]
              /      \
            API       DB
                       \
                        ◇ ADR-021

The decision marker could be implemented in Three.js using:

* PlaneGeometry;
* thin ExtrudeGeometry;
* custom card geometry;
* a billboard/sprite for labels.

The object should appear more like an annotation or museum label than another architectural component.

⸻

## 19. Decisions as a Semantic 3D Layer

The z-axis should carry semantic meaning.

For example:

                    DECISIONS
                 ◇       ◇
                     ◇
             ------------------     z = 2
                  ARCHITECTURE
              API ───── Database
                   Worker
             ------------------     z = 1
                    CONTEXT
             Identity     Orders
             ------------------     z = 0

This makes the 3D environment an architecture knowledge space rather than simply a C4 diagram with depth.

⸻

## 20. Progressive ADR Interaction

Do not attempt to render an entire Markdown ADR permanently in 3D.

Use progressive disclosure.

Rest

◇

Hover

◇ ADR-017
  Adopt PostgreSQL

Selection

Display a Kami-styled information panel:

╭──────────────────────────────────────╮
│ ADR-017                              │
│                                      │
│ Adopt PostgreSQL                     │
│                                      │
│ Accepted · 12 March 2026             │
│                                      │
│ PostgreSQL was selected because...   │
│                                      │
│                       Read decision →│
╰──────────────────────────────────────╯

Read decision should navigate to the canonical Markdown/Structurizr ADR representation.

Three.js therefore remains a spatial index into architectural knowledge, not a replacement Markdown reader.

⸻

## 21. Decision → Architecture Exploration

Selecting an ADR should reveal its architectural footprint.

Suppose:

ADR-017
Adopt PostgreSQL

affects:

Orders
Orders API
Orders Database
Reporting

Selecting ADR-017 should:

1. emphasise affected elements using Kami ink;
2. fade unrelated elements;
3. reveal lines from the ADR marker to affected elements;
4. optionally reposition the camera to show the complete affected area.

Conceptually:

                         ◆ ADR-017
                        ╱    │    ╲
                       ▼     ▼     ▼
                  Orders API
                       │
                       ▼
               ORDERS DATABASE ─── Reporting

This answers:

What architectural footprint did this decision create?

⸻

## 22. Architecture → Decision Exploration

The inverse operation is equally important.

Selecting:

Orders Database

and activating:

Show Decisions

could reveal:

               ◇ ADR-004
                   │
               ◆ ADR-017
                 ╲ │
                  ╲│
           [ Orders Database ]
                  ╱
               ◇ ADR-031

The explorer therefore supports:

Architecture ─────▶ Decisions
Decisions ─────────▶ Architecture

This bidirectional navigation should become a defining feature.

⸻

## 23. Decision History

Structurizr ADRs include statuses such as:

* Proposed;
* Accepted;
* Superseded.

Kami should avoid converting this into a traffic-light colour system.

Use form, opacity, stroke, and elevation instead.

For example:

Accepted
    ◆ ADR-017
Proposed
    ◇ ADR-024
Superseded
    ◇ ADR-003
    ─────────

Superseded decisions might also recede vertically or become partially transparent.

Selecting a superseded decision should reveal lineage:

ADR-003
   │
   │ superseded by
   ▼
ADR-017
   │
   │ refined by
   ▼
ADR-031

Three.js can therefore reveal a spatial history of architectural reasoning.

⸻

## 24. ADR Metadata Extension

Structurizr’s ADR attachment establishes useful scope, but richer spatial exploration requires explicit information about which architecture elements a decision affects.

Introduce machine-readable metadata.

For example:

---
id: ADR-017
status: accepted
date: 2026-03-12
affects:
  - orders
  - orders.api
  - orders.database
supersedes:
  - ADR-003
---

The exact format should be aligned with the existing ADR convention and ADR tooling.

This metadata should remain lightweight.

It supplements the ADR; it does not replace the human-readable decision record.

⸻

## 25. Architecture Knowledge Graph

The implementation should eventually compile Structurizr and ADR information into an intermediate graph.

Conceptually:

workspace.dsl ───────────────┐
                             │
ADRs/*.md ───────────────────┼──▶ Architecture Graph
                             │
ADR metadata ────────────────┤
                             │
Kami tokens ─────────────────┘

The graph might contain:

Node
 ├── Person
 ├── SoftwareSystem
 ├── Container
 ├── Component
 ├── Group
 └── Decision
Edge
 ├── Uses
 ├── Contains
 ├── BelongsTo
 ├── Affects
 ├── Supersedes
 ├── Refines
 └── Documents

This graph becomes the common input for richer visualisations.

⸻

## 26. Proposed Repository Structure

An eventual structure might resemble:

.
├── doc/
│   └── architecture/
│       ├── workspace.dsl
│       ├── workspace.json
│       │
│       ├── decisions/
│       │   ├── 0001-*.md
│       │   ├── 0002-*.md
│       │   └── ...
│       │
│       ├── themes/
│       │   └── kami/
│       │       ├── theme.dsl
│       │       └── theme.json
│       │
│       └── visualisations/
│           ├── svg/
│           └── threejs/
│
├── src/
│   ├── model/
│   │   ├── structurizr/
│   │   ├── decisions/
│   │   └── graph/
│   │
│   ├── design/
│   │   └── kami/
│   │       ├── tokens.*
│   │       └── adapters/
│   │
│   └── renderers/
│       ├── svg/
│       └── threejs/
│           ├── theme.*
│           ├── materials.*
│           ├── geometry.*
│           ├── lighting.*
│           ├── camera.*
│           ├── decisions.*
│           └── interactions.*
│
└── memo1.md

This is a target structure rather than a mandatory immediate migration.

Existing repository conventions should be preserved where practical.

⸻

## 27. Build Pipeline

The desired build flow is:

                     workspace.dsl
                          │
                          ▼
                    Structurizr CLI
                          │
                          ▼
                    workspace.json
                          │
                          │
ADRs/*.md ────────────────┼──────────── Kami
      │                   │              │
      ▼                   ▼              ▼
 ADR parser ─────▶ Architecture Graph ◀─ tokens
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
       Structurizr       SVG         Three.js
            │             │             │
            └─────────────┼─────────────┘
                          ▼
                 Architecture Explorer

Generation should eventually be reproducible through CI.

⸻

## 28. Implementation Phases

Phase 1 — Kami Structurizr

Implement the shared visual language first.

Deliver:

* Kami architecture tokens;
* Structurizr theme;
* warm parchment canvas;
* ink-blue emphasis;
* neutral elements;
* rounded geometry;
* subtle boundaries;
* restrained relationships.

Success criterion:

Native Structurizr views clearly belong to the same visual family as existing Kami SVG diagrams.

⸻

Phase 2 — Regions and Groups

Introduce conventions for:

* groups;
* nested groups;
* architectural regions;
* group styling.

Success criterion:

Collections of containers/components can be visually understood as belonging to a larger architectural region.

⸻

Phase 3 — Context-Preserving 2D Views

Create view conventions that preserve external architectural context during drill-down.

Success criterion:

Entering a Container view does not require the viewer to mentally reconstruct the System Context view.

⸻

Phase 4 — Shared Kami Three.js Adapter

Move Three.js styling behind a formal Kami adapter.

Implement:

* materials;
* outlines;
* typography;
* geometry;
* lighting;
* camera;
* interaction states.

Success criterion:

2D Structurizr, SVG, and Three.js look like different projections of one design system.

⸻

Phase 5 — Three.js Semantic Zoom

Implement camera-based drill-down.

Success criterion:

Landscape → System → Container → Component navigation retains spatial context.

⸻

Phase 6 — ADR Import

Parse Structurizr ADRs and associated metadata into the Three.js architecture graph.

Success criterion:

ADRs exist as queryable first-class objects in the Three.js application.

⸻

Phase 7 — Decision Layer

Implement the Kami Decision visual primitive.

Add:

* rest state;
* hover;
* selection;
* Markdown link;
* status representation.

Success criterion:

ADRs can be discovered and opened directly from the spatial architecture.

⸻

Phase 8 — Bidirectional Decision Navigation

Implement:

Decision → affected architecture
Architecture → relevant decisions

Success criterion:

Selecting either side can reveal the other.

⸻

Phase 9 — Decision History

Implement:

* supersession;
* decision lineage;
* historical fading;
* timeline exploration.

Success criterion:

The explorer can answer not only “what is the architecture?” but “how and why did it become this architecture?”

⸻

Phase 10 — Architecture Explorer

Unify the projections behind a coherent interface.

Possible modes:

Architecture
Decisions
State
Deployment
Security
Ownership
Risk
History

These should be projections over common knowledge rather than independent documentation islands.

⸻

## 29. Design Principles

The implementation should continuously enforce the following principles.

Model once, project many times

Do not duplicate architectural semantics merely because another renderer is used.

Preserve spatial memory

Drill-down should add detail rather than destroy context.

Decisions are rationale, not components

Never model ADRs as fake C4 elements merely to make rendering easier.

Restraint over decoration

3D exists to improve understanding, not to demonstrate Three.js.

Kami everywhere

Every renderer should inherit the same visual grammar.

Use the right projection

Do not force state, lifecycle, time, or rationale into C4 when another projection communicates it better.

Progressive disclosure

The user should initially see only enough information to orient themselves.

Architecture and rationale are bidirectional

It must be possible to move from architecture to its decisions and from a decision to its architectural consequences.

Markdown remains canonical for ADR content

3D navigation augments ADRs; it does not replace them.

The architecture model remains renderer-independent

Three.js, SVG, and Structurizr are projections—not sources of architectural truth.

⸻

## 30. Long-Term Vision

The resulting system should ultimately feel less like navigating a collection of diagrams and more like exploring an architecture knowledge space.

Conceptually:

                     KNOWLEDGE / EVIDENCE
                 ADRs          Documentation
                  ◇                 ▤
                   ╲               ╱
                    ╲             ╱
                       ARCHITECTURE
              System → Container → Component
                            │
                            ▼
                         RUNTIME
                 Deployment / Region

Architecture can then be explored through several dimensions:

STRUCTURE
What exists?
RELATIONSHIPS
What communicates?
SPACE
Where does it belong?
DEPTH
What is inside it?
STATE
What condition is it in?
TIME
How did it evolve?
DECISIONS
Why is it this way?
PERSPECTIVES
What does it look like from the viewpoint
of security, ownership, cost, risk, etc.?

This is substantially more useful than simply converting C4 rectangles into 3D cubes.

The Three.js implementation becomes valuable because it provides a spatial interface over architectural knowledge.

⸻

## 31. Target Experience

Imagine opening the architecture.

A quiet Kami parchment world appears.

Software systems occupy stable positions on an architectural landscape.

Selecting one smoothly approaches it.

Its containers unfold without making neighbouring systems disappear.

Selecting a container moves closer again and reveals its components.

A subtle control enables:

Decisions

Small ink markers appear above the architecture.

Selecting:

◆ ADR-017 — Adopt PostgreSQL

causes unrelated architecture to recede.

The database, API, reporting service, and relationships affected by the decision become emphasised in ink.

A small Kami card explains:

ADR-017
Adopt PostgreSQL
Accepted · 12 March 2026
Read decision →

Selecting the database and choosing Decisions reverses the relationship and reveals every decision that contributed to it.

Selecting an older decision reveals that it was superseded.

Following that relationship visually reconstructs the evolution of the architecture.

At no point has the underlying architecture changed.

Only the projection onto the architecture knowledge graph has changed.

That is the intended destination.

⸻

## 32. References

Existing implementation

* Architecture Decision Records Management
    https://github.com/vanHeemstraSystems/architecture-decision-records-management

Kami

* Kami
    https://github.com/vanHeemstraDesigns/Kami

Structurizr

* Structurizr
    https://structurizr.com/
* Structurizr documentation
    https://docs.structurizr.com/
* Structurizr DSL
    https://docs.structurizr.com/dsl
* Structurizr DSL language reference
    https://docs.structurizr.com/dsl/language
* Structurizr DSL — Architecture Decision Records
    https://docs.structurizr.com/dsl/adrs
* Structurizr — Decisions
    https://docs.structurizr.com/server/decisions
* Structurizr — Themes
    https://docs.structurizr.com/ui/diagrams/themes
* Structurizr DSL — Groups
    https://docs.structurizr.com/dsl/cookbook/groups/
* Structurizr DSL — Perspectives
    https://docs.structurizr.com/dsl/cookbook/perspectives-static/
* Structurizr — Diagram Perspectives
    https://docs.structurizr.com/server/diagrams/perspectives
* Structurizr — DSL vs JSON workspace representation
    https://docs.structurizr.com/workspaces/file-types
* Structurizr CLI — Export
    https://docs.structurizr.com/cli/export

Three.js

* Three.js
    https://threejs.org/
* Three.js documentation
    https://threejs.org/docs/
* Three.js examples
    https://threejs.org/examples/

C4 Model

* C4 Model
    https://c4model.com/

Architecture Decision Records

* Michael Nygard — Documenting Architecture Decisions
    https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
* ADR Tools
    https://github.com/npryce/adr-tools
* Markdown Architectural Decision Records
    https://adr.github.io/madr/

⸻

## 33. Conclusion

The goal is not to replace Structurizr.

The goal is to let Structurizr become what it is exceptionally good at being:

the structured semantic model of the architecture.

Around that model:

* Kami supplies the visual grammar;
* Structurizr 2D supplies C4 projections;
* SVG supplies specialised state, lifecycle, flow, and regional projections;
* Three.js supplies spatial and semantic exploration;
* Markdown ADRs supply architectural rationale;
* the Architecture Graph connects these concepts.

The resulting principle is:

One architecture model.
One architectural history.
One visual language.
Many projections.

And the defining interaction principle should remain:

Reveal more without making the user forget where they came from.
