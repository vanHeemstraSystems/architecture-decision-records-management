# feat/memo4 — Changed Files Archive

This archive contains the files that differ from `origin/feat/memo4` after:

1. Merging completed files from `main` (package.json, domain, application services, routes, tests, …)
2. Implementing the missing Memo 4 modules so that `npm test` and `npm run dev` succeed

## What was added / fixed

| Path | Purpose |
|------|---------|
| `doc/src/lib/observability/index.ts` | Phase 10 – withSpan, SpanNames, in-memory spans |
| `doc/src/lib/architecture/index.ts` | Phase 8 – public barrel for domain + application services |
| `doc/src/lib/scene/scene-builder.ts` | Phase 4 – buildSceneGraph() |
| `doc/src/lib/scene/index.ts` | Exports buildSceneGraph |
| `doc/src/lib/remote/*` | Phase 9 – thin remote wrappers |
| `doc/src/*.remote.ts` | Re-exports for remote functions |
| `doc/tsconfig.json` | Extends SvelteKit-generated config |
| `doc/Dockerfile` / `doc/compose.yaml` | Resolved merge (OTEL + logging) |
| + all completed files brought from `main` | package.json, domain, services, routes, tests, … |

## How to apply

From the root of a clean `feat/memo4` checkout:

```bash
# unpack on top of the repo
unzip -o feat-memo4-changed-files.zip

cd doc
npm install
npm test          # 10 tests should pass
npm run dev       # http://localhost:5173
```

Or, if you prefer a full branch:

```bash
git checkout feat/memo4
# copy the contents of this archive into the working tree
git add -A
git commit -m "feat: implement missing Memo 4 Phase 4/8/9/10 modules"
git push -u origin feat/memo4
```

## Verification (expected)

- `npm test` → 3 files / 10 tests passed
- `npm run dev` → routes `/`, `/architecture`, `/services`, `/observability`, `/remote-demo` all return 200
