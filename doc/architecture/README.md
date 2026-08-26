# `doc/architecture/` — LikeC4 model + ADRs

This directory is the **source of truth** for the architecture data that the
SvelteKit app in [`doc/`](../README.md) renders. It holds:

- The **LikeC4 workspace** describing containers, people, and views.
- The **Architecture Decision Records** (Nygard-style Markdown) recording why
  each choice was made.

The SvelteKit app reads these files directly from disk at request time via two
server-only adapters and composes them into a single canonical
`ArchitectureModel`. There is **no build step, no Docker container, and no
Structurizr Lite / Java process** involved — the model is plain files, parsed
by the app.

> For the app itself (routes, remote functions, tests), see [`../README.md`](../README.md).
> For the authoritative architecture rules, see [`../../memo4.md`](../../memo4.md)
> (especially §5, §7, §8, §40).

## 1. Prerequisites

- Node.js **≥ 20**
- npm (bundled with Node.js)

No Docker, no Java, no Structurizr Lite install required.

## 2. Installation

From the repository root:

```bash
cd doc && npm install
```

## 3. Directory layout

```
doc/architecture/
├── decisions/                     # Nygard-style Markdown ADRs (NNNN-*.md)
│   ├── 0001-record-architecture-decisions.md
│   ├── 0002-implement-as-unix-shell-scripts.md
│   └── 0003-use-rust-for-performance-critical-functionality.md
├── model/
│   └── adr-platform.c4            # LikeC4 workspace (single file today)
└── .gitignore
```

## 4. Authoring ADRs

Filename convention: `NNNN-kebab-title.md` with a **zero-padded 4-digit
sequence** (e.g. `0004-adopt-babylon.md`). The ADR filesystem adapter picks up
any `NNNN-*.md` file on the next request — **no restart, no index rebuild**.

Required YAML frontmatter and standard Nygard sections:

```markdown
---
status: "Accepted"
---

# 4. Adopt Babylon.js for 3D rendering

Date: 2026-08-26

## Status

Accepted

## Context

Why this decision is needed.

## Decision

What we decided.

## Consequences

What follows from this decision (positive and negative).
```

See [`decisions/0001-record-architecture-decisions.md`](decisions/0001-record-architecture-decisions.md)
for the working template.

## 5. Authoring / editing the LikeC4 model

The workspace lives in [`model/adr-platform.c4`](model/adr-platform.c4). It is
a single LikeC4 file today; the adapter parses it statically on every server
request, so edits show up on the next reload without restarting `npm run dev`.

Minimal `systemContext`-style view:

```likec4
views {
  view SystemContext {
    title 'System Context'
    include user, softwareSystem
  }
}
```

Full DSL reference: <https://likec4.dev/dsl>.

## 6. How the SvelteKit app consumes this directory

See memo4 [§5](../../memo4.md), [§7](../../memo4.md), [§8](../../memo4.md) for
the authoritative layering. Concretely:

- **LikeC4 adapter** — [`../src/lib/architecture/infrastructure/likec4/adapter.server.ts`](../src/lib/architecture/infrastructure/likec4/adapter.server.ts)
  statically parses `model/adr-platform.c4`.
- **ADR filesystem adapter** — [`../src/lib/architecture/infrastructure/adr/adapter.server.ts`](../src/lib/architecture/infrastructure/adr/adapter.server.ts)
  reads `decisions/*.md`, extracts YAML frontmatter, and returns
  `ArchitectureDecision[]`.
- **Application service** — `getArchitecture()` composes both adapters into a
  canonical `ArchitectureModel`.
- **Remote functions** — [`../src/lib/remote/*.remote.ts`](../src/lib/remote/)
  wrap the services with `query()` from `$app/server` (thin only, per memo4
  [§8](../../memo4.md)).
- The `/architecture` route reports the composite source id
  `likec4-workspace+adr-fs` when both adapters are live.

## 7. Running the app

From `doc/`:

```bash
npm run dev
```

Opens on <http://localhost:5173>. Routes:

- `/` — home
- `/architecture` — canonical model view (source id shown at the top)
- `/services` — application-services demo
- `/observability` — OTEL span buffer
- `/remote-demo` — remote-function demo

Enable OTEL span logging:

```bash
OTEL_ENABLED=true npm run dev
```

Preview production build against the same on-disk ADRs
(`source: likec4-workspace+adr-fs`):

```bash
npm run build && npm run preview   # http://localhost:4173
```

## 8. Testing

```bash
npm test                 # vitest — 19/19 across 6 suites (incl. 7 ADR-adapter tests)
npm run test:watch       # re-run on change
```

## 9. Validation gates (mandatory before merge)

Per [memo4](../../memo4.md), a successful LLM edit is **not** a successful
implementation. Before merging, from `doc/`:

```bash
cd doc
npm run check
npm test
npm run build
npm run preview
```

CI must remain deterministic (no LLM required to judge correctness).

## 10. Troubleshooting

- **`source: likec4-adapter:seed-fallback` in production** — the adapter could
  not reach the `.server.ts` entry point. Check that the call site runs on the
  server (remote function or `+page.server.ts`), not in the browser.
- **A new ADR does not appear** — verify the filename matches `NNNN-*.md`
  (four-digit zero-padded prefix) and the YAML frontmatter is well-formed
  (opening/closing `---`, `status: "..."`).
- **LikeC4 parse errors** — run `npm run dev` and check the server console;
  the parser reports the offending line in `model/adr-platform.c4`.

## 11. Related documents

- [`../README.md`](../README.md) — SvelteKit app overview (routes, tests, build)
- [`../../memo4.md`](../../memo4.md) — authoritative architecture memo
- [`../../AGENTS.md`](../../AGENTS.md) — day-to-day agent constraints
- [`../../VISUALISATION.md`](../../VISUALISATION.md) — project intent overview
