# Agent instructions — Architecture Decision Records Management

This repository builds a SvelteKit architecture-exploration platform (LikeC4 + Babylon.js + ADRs).

## Authoritative documents

| Document | Authority |
|----------|-----------|
| **memo4.md** | Application architecture (domain, adapters, scene graph, Babylon, services, remote functions, OTEL) |
| **memo5.md** | AI-assisted *development* process (OpenCode, @sveltejs/opencode, validation) |
| **This file** | Day-to-day agent constraints derived from those memos |

Read the relevant memo before making structural changes.

## Product architecture boundaries (memo4)

Preserve these layers. Do not collapse them.

```
UI / routes / components
        │
        ▼
Remote functions (*.remote.ts)     ← thin only: validate, auth, telemetry
        │
        ▼
Application services               ← getArchitecture, getDecision, search, …
        │
        ▼
Domain model                       ← ArchitectureModel, Element, Decision, View
        │
        ▼
Adapters                           ← LikeC4 (and future ADR filesystem)
```

### Hard rules

1. **LikeC4** is the architecture-model authority. Do not re-encode C4 semantics inside Svelte components.
2. **Canonical domain model** is the only model the rest of the app depends on. Adapters translate *into* it.
3. **Scene graph** is a projection of the domain for rendering — not a second domain model.
4. **Babylon.js** is the preferred 3D renderer. Svelte owns lifecycle/UI; Babylon owns the scene.
5. **Remote functions** MUST remain thin. No domain logic, no LikeC4 parsing, no layout algorithms inside `query()` / `command()`.
6. **Application services** are plain TypeScript and MUST stay usable from UI, tests, CLI, and MCP — not only from remote functions.
7. **OpenTelemetry** spans instrument application services (e.g. `architecture.model.load`). Prefer extending existing `withSpan` usage.
8. **OpenCode / @sveltejs/opencode / LLMs** are **dev-time only**. Never install them into the production Docker image.

### Preferred locations (under `doc/`)

| Concern | Path |
|---------|------|
| Domain | `src/lib/architecture/domain/` |
| Application services | `src/lib/architecture/application/` |
| LikeC4 adapter | `src/lib/architecture/infrastructure/likec4/` |
| Scene graph | `src/lib/scene/` |
| Babylon renderer | `src/lib/renderer/babylon/` |
| Remote functions | `src/lib/remote/*.remote.ts` (and thin `src/*.remote.ts` re-exports) |
| Observability | `src/lib/observability/` |
| UI | `src/routes/`, `src/lib/components/` |
| Tests | `tests/` |

Avoid giant Svelte components that embed the entire 3D engine. Keep renderer modules under `renderer/babylon/`.

## Svelte / AI development (memo5)

1. Use **@sveltejs/opencode** (see `opencode.json`) for Svelte-specific work.
2. Prefer **current Svelte/SvelteKit documentation** (via Svelte MCP) over model memory for framework APIs — especially Svelte 5 runes, remote functions, and SSR boundaries.
3. Treat `*.svelte` / `*.svelte.ts` as Svelte files, not generic HTML/TS.
4. After editing Svelte sources, run Svelte-aware validation when available, then repository checks.

## Validation is mandatory

A successful LLM response is **not** a successful implementation. Before considering work complete:

```bash
cd doc
npm run check
npm test
npm run build
```

CI must remain deterministic (no LLM required to judge correctness).

## Model strategy (guidance)

- Prefer local inference for routine edits when adequate.
- Escalate to a stronger model for hard architecture, unfamiliar APIs, or failed local attempts.
- Framework expertise comes from Svelte tooling; general reasoning comes from the LLM.

## What not to do

- Do not replace deterministic tests with “the model said it looks fine”.
- Do not move domain logic into remote functions or route `+page.svelte` files.
- Do not recreate LikeC4 inside the UI.
- Do not put OpenCode, MCP servers, or LLM SDKs in the runtime Docker image.
- Do not invent empty directory trees “to match the memo diagram”; create folders when code needs them.

## Quick orientation

```bash
cd doc && npm install && npm test && npm run dev
```

- Architecture explorer: `/architecture`
- Application services demo: `/services`
- Spans / OTEL buffer: `/observability`
