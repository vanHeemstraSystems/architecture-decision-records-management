# Visualisation

This repository has moved away from the previous **Structurizr Lite** flow (Java + Docker + `workspace.dsl`) and now ships a **SvelteKit + LikeC4 + Babylon.js** application under [`doc/`](./doc/). ADR visualisation, search, and 3D exploration all run inside that single SvelteKit app — no external DSL, no Java runtime, and no Docker container are required.

For architecture details see [`memo4.md`](./memo4.md) (application authority) and [`AGENTS.md`](./AGENTS.md) (day-to-day contributor constraints).

## Quick start

```bash
cd doc
npm install
npm run dev
```

Then open:

- [http://localhost:5173/architecture](http://localhost:5173/architecture) — scene-graph list + context
- [http://localhost:5173/services](http://localhost:5173/services) — search / context explorer
- [http://localhost:5173/observability](http://localhost:5173/observability) — live OpenTelemetry-style spans

## Where do the ADRs come from?

ADRs are read directly from [`doc/architecture/decisions/*.md`](./doc/architecture/decisions/) by the ADR filesystem adapter (`doc/src/lib/architecture/infrastructure/adr/`). Drop a new `NNNN-*.md` file into that directory and it will appear in the UI on the next request — no rebuild, no external service, no DSL edit.
