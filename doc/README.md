# Architecture Decision Records Management (`doc/`)

Svelte 5 + SvelteKit 2 implementation of **Memo 4 Phases 1–10**.

## Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1–2 | Foundation + domain | ✅ |
| 3 | LikeC4 adapter | ✅ |
| 4 | Scene graph | ✅ |
| 5–7 | Babylon 2D/3D API surface | ✅ (stub entry; expand renderer modules) |
| 8 | Application services | ✅ |
| 9 | Remote functions | ✅ |
| 10 | OpenTelemetry-style tracing | ✅ |

## Quick start

```bash
cd doc
npm install
npm test
npm run dev
```

- http://localhost:5173/ — home  
- http://localhost:5173/architecture — scene graph list + context  
- http://localhost:5173/services — search / context explorer  
- http://localhost:5173/observability — live spans  
- http://localhost:5173/remote-demo — remote-layer demo  

```bash
OTEL_ENABLED=true npm run dev   # console span logging
```

## Layout

```
doc/
├── src/lib/architecture/     # domain + application + likec4 adapter
├── src/lib/scene/            # SceneGraph + builder
├── src/lib/observability/    # withSpan, SpanNames
├── src/lib/remote/           # *.remote.ts thin query wrappers
├── src/lib/renderer/babylon/ # renderer API (expand for full WebGL)
├── src/lib/theme/kami/       # colour tokens
├── src/routes/               # UI
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
