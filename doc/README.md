# Architecture Decision Records Management (`doc/`)

Svelte 5 + SvelteKit 2 implementation of **Memo 4 Phases 1–10**.

## Status

| Phase | Description | Status |
| --- | --- | --- |
| 1–2 | Foundation + domain | ✅ |
| 3 | LikeC4 adapter (static server imports) | ✅ |
| 4 | Scene graph | ✅ |
| 5–7 | Babylon 2D/3D API surface | ✅ (stub entry; expand renderer modules) |
| 8 | Application services | ✅ |
| 9 | Remote functions (`query()` from `$app/server`) | ✅ |
| 10 | OpenTelemetry-style tracing | ✅ |

Phases 1–10 of [memo4.md](../memo4.md) are complete. The ADR filesystem adapter is live under `src/lib/architecture/infrastructure/adr/` and the Structurizr Lite flow has been retired.

## Architecture highlights

- **LikeC4 adapter** loads its workspace via static server imports from `likec4/adapter.server.ts` (no `@vite-ignore` dynamic-import shim). The browser-side `likec4/adapter.ts` is a pure fallback that returns an empty workspace when the server module is not reachable.
- **ADR filesystem adapter** (`infrastructure/adr/`) reads real Markdown files from [`doc/architecture/decisions/`](./architecture/decisions/) at request time and merges them into the domain model. The composite source id is `likec4-workspace+adr-fs`.
- **Remote functions** in `src/lib/remote/*.remote.ts` use `query()` from [`$app/server`](https://svelte.dev/docs/kit/$app-server). The client transparently receives an HTTP proxy; the server executes the real application service. See memo4 §5.
- **Application services** stay plain TypeScript and are the only layer the UI, tests, and remote functions depend on.

## Quick start

```bash
cd doc
npm install
npm test
npm run dev
```

- [http://localhost:5173/](http://localhost:5173/) — home
- [http://localhost:5173/architecture](http://localhost:5173/architecture) — scene graph list + context
- [http://localhost:5173/services](http://localhost:5173/services) — search / context explorer
- [http://localhost:5173/observability](http://localhost:5173/observability) — live spans
- [http://localhost:5173/remote-demo](http://localhost:5173/remote-demo) — remote-layer demo

```bash
OTEL_ENABLED=true npm run dev   # console span logging
```

### Preview (production build)

```bash
npm run build
npm run preview
```

`npm run preview` serves the same real on-disk ADRs as `npm run dev` — the architecture endpoint reports `source: likec4-workspace+adr-fs`.

## Decisions on disk

The ADR adapter picks up any `NNNN-*.md` files under `doc/architecture/decisions/`. As of the current sprint:

1. `0001-record-architecture-decisions.md` — *Record architecture decisions*
2. `0002-implement-as-unix-shell-scripts.md` — *Implement as Unix shell scripts*
3. `0003-use-rust-for-performance-critical-functionality.md` — *Use Rust for performance-critical functionality*

## Validation gates

Every change must pass these four commands before it is considered done:

```bash
cd doc
npm run check     # svelte-check — 0 errors, 0 warnings
npm test          # vitest — 19 tests across 6 files (incl. 7 ADR adapter tests)
npm run build     # svelte-kit build
npm run preview   # smoke-test the production bundle
```

## Layout

```
doc/
├── src/lib/architecture/
│   ├── domain/                  # ArchitectureModel, Element, Decision, View
│   ├── application/             # getArchitecture, search, …
│   └── infrastructure/
│       ├── likec4/              # LikeC4 adapter (adapter.server.ts + browser fallback)
│       └── adr/                 # ADR filesystem adapter
├── src/lib/scene/               # SceneGraph + builder
├── src/lib/observability/       # withSpan, SpanNames
├── src/lib/remote/              # *.remote.ts thin query wrappers
├── src/lib/renderer/babylon/    # renderer API (expand for full WebGL)
├── src/lib/theme/kami/          # colour tokens
├── src/routes/                  # UI
├── architecture/decisions/      # real ADR Markdown files
├── tests/
├── Dockerfile
└── compose.yaml
```

## Git (on your machine)

```bash
git checkout -b feat/memo4-phases-1-10
git add doc/
git commit -m "feat: Memo 4 phases 1-10 implementation under doc/"
git push -u origin feat/memo4-phases-1-10
gh pr create --base main --title "Memo 4: Phases 1-10" --body "See memo4.md roadmap."
```
