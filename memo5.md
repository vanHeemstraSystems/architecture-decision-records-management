# Memo 5 — AI-Native SvelteKit Development with @sveltejs/opencode

Status

Proposed implementation direction

This memo extends the architecture defined in memo4.md. It does not replace that memo.

memo4.md defines the SvelteKit-based application architecture, including LikeC4 and Babylon.js-based visualization. This memo defines how that application should be developed and maintained using an AI-native Svelte toolchain centered on @sveltejs/opencode.

The objective is to make Svelte-specific AI assistance part of the repository’s standard engineering environment rather than relying solely on generic LLM knowledge.

⸻

## 1. Decision

Adopt OpenCode with the official @sveltejs/opencode integration as the preferred AI-assisted development environment for the SvelteKit application described in memo4.md.

The target development chain is:
```
Developer
    │
    ▼
OpenCode
    │
    ├──────────────► configured LLM
    │                   │
    │                   ├── local model where practical
    │                   └── remote model when required
    │
    ▼
@sveltejs/opencode
    │
    ├── Svelte-specific instructions
    ├── Svelte skills
    ├── Svelte file editing agent
    └── Svelte MCP
            │
            ├── current Svelte documentation
            ├── current SvelteKit documentation
            ├── code analysis
            └── svelte-autofixer
                    │
                    ▼
              SvelteKit source
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       LikeC4              Babylon.js
          │                   │
          └─────────┬─────────┘
                    ▼
          Architecture experience
              2D + 3D views
```
The LLM therefore provides general reasoning and software-engineering capability, while Svelte’s own AI tooling supplies framework-specific knowledge, validation and editing support.

⸻

## 2. Why This Matters

A generic coding LLM inevitably has a knowledge cutoff.

That is particularly relevant for this project because it intends to use modern versions of:

* Svelte;
* SvelteKit;
* LikeC4;
* Babylon.js;
* TypeScript;
* Vite-based tooling underneath SvelteKit;
* containerized deployment;
* emerging SvelteKit capabilities.

We should therefore avoid making the model itself the authoritative source for current Svelte APIs.

Instead:
```
LLM knowledge
     +
Svelte-maintained knowledge
     +
Svelte-aware validation
     =
better Svelte engineering
```
This distinction becomes increasingly important as Svelte and SvelteKit evolve.

⸻

## 3. Architectural Principle

The repository SHALL distinguish between:

General intelligence

Provided by the LLM configured for OpenCode.

Responsibilities include:

* reasoning;
* architecture;
* decomposition;
* refactoring strategy;
* TypeScript reasoning;
* testing strategy;
* implementation planning;
* debugging;
* general software engineering.

Framework intelligence

Provided by @sveltejs/opencode and the Svelte MCP/tooling.

Responsibilities include:

* Svelte syntax;
* Svelte 5 idioms;
* runes;
* component patterns;
* SvelteKit APIs;
* framework-specific best practices;
* current documentation retrieval;
* Svelte source validation;
* Svelte-specific code correction.

This separation is intentional.

The LLM should reason about Svelte using Svelte’s current tooling, rather than pretending its training knowledge is necessarily authoritative.

⸻

## 4. @sveltejs/opencode

Add the official Svelte OpenCode integration to the development environment.

The OpenCode configuration should include:
```
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@sveltejs/opencode"]
}
```
The exact configuration MAY evolve as OpenCode and the Svelte AI tooling mature.

Do not unnecessarily duplicate configuration supplied by the plugin.

Prefer the smallest configuration that gives the agent access to the official Svelte integration.

⸻

## 5. Svelte MCP

The Svelte MCP layer is a key architectural component.

Conceptually:
```
OpenCode agent
      │
      ▼
@sveltejs/opencode
      │
      ▼
Svelte MCP
      │
      ├── discover documentation
      ├── retrieve documentation
      ├── inspect Svelte code
      ├── suggest corrections
      └── validate generated code
```
Where practical, the agent SHOULD consult Svelte documentation through the Svelte tooling before making significant framework-specific implementation decisions.

This is especially important for:

* unfamiliar APIs;
* newly introduced APIs;
* migration work;
* deprecated functionality;
* SvelteKit configuration;
* SSR behavior;
* client/server boundaries;
* state-management patterns;
* Svelte 5 runes;
* future Svelte/SvelteKit changes.

⸻

## 6. Svelte File Editing

Svelte files should not be treated as generic HTML or TypeScript files.

For files such as:

*.svelte
*.svelte.ts
*.svelte.js

OpenCode should make use of the Svelte-specific editing capabilities supplied by @sveltejs/opencode.

The expected workflow is:
```
Task
 │
 ▼
OpenCode reasoning
 │
 ▼
Svelte-specific agent/tooling
 │
 ├── retrieve relevant documentation
 │
 ├── edit source
 │
 ├── inspect result
 │
 └── run Svelte validation/autofix
 │
 ▼
candidate implementation
```
This gives us an important engineering property:

AI-generated Svelte code is checked by Svelte-aware tooling before it is considered complete.

⸻

## 7. Validation Is Mandatory

AI assistance must not bypass conventional engineering validation.

The resulting pipeline should remain approximately:
```
AI generation
     │
     ▼
Svelte-aware validation
     │
     ▼
TypeScript validation
     │
     ▼
lint
     │
     ▼
tests
     │
     ▼
build
     │
     ▼
container build
```
A successful LLM response is not equivalent to a successful implementation.

Repository-defined deterministic checks remain authoritative.

At minimum, changes should be capable of passing the project’s equivalents of:
```
npm run check
npm run lint
npm test
npm run build
```
Exact scripts should be defined by the implementation repository.

⸻

## 8. Local-First LLM Strategy

OpenCode and @sveltejs/opencode should remain independent of a specific model vendor.

The preferred architecture is:
```
                 OpenCode
                    │
             model interface
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
 Local inference            Remote model
        │                       │
 lower marginal cost      stronger model when
 privacy/locality          genuinely required
```
This allows routine engineering work to be attempted using locally hosted models while retaining the ability to use stronger remote models for difficult tasks.

The Svelte intelligence layer remains conceptually unchanged:
```
Local model ───┐
               ├── OpenCode
Remote model ──┘       │
                       ▼
                @sveltejs/opencode
                       │
                       ▼
                   Svelte MCP
```
This is important because model selection and framework expertise become separate concerns.

⸻

## 9. Model Escalation

The implementation SHOULD support model escalation rather than assuming every task requires the most capable or expensive model.

For example:
```
Task
 │
 ▼
Local model
 │
 ├── success ─────────────► validate
 │
 └── insufficient
          │
          ▼
    stronger model
          │
          ▼
       validate
```
Suitable local-model tasks may include:

* routine component creation;
* tests;
* documentation;
* CSS;
* straightforward refactoring;
* TypeScript changes;
* repetitive implementation;
* repository maintenance.

Escalation may be appropriate for:

* difficult architectural reasoning;
* complex debugging;
* large cross-cutting refactors;
* subtle SSR problems;
* unfamiliar framework changes.

The repository should not encode an unnecessary dependency on a particular commercial model.

⸻

## 10. Relationship to SvelteKit

SvelteKit remains the application framework.

@sveltejs/opencode does not become part of the production application architecture.

This distinction is important:
```
DEVELOPMENT
Developer
   ↓
OpenCode
   ↓
@sveltejs/opencode
   ↓
Svelte MCP
   ↓
source repository
RUNTIME
Browser
   ↓
SvelteKit application
   ↓
LikeC4
   +
Babylon.js
```
The OpenCode/Svelte AI tooling belongs to the engineering control plane, not the application runtime.

Production containers therefore should not need OpenCode or @sveltejs/opencode.

⸻

## 11. Relationship to LikeC4

LikeC4 remains responsible for architecture semantics and architecture-model visualization.

Svelte should provide the surrounding application experience.

Conceptually:
```
SvelteKit
 │
 ├── navigation
 ├── application shell
 ├── routing
 ├── interaction
 ├── state
 ├── ADR integration
 │
 └── architecture views
       │
       ├── LikeC4 2D
       │
       └── Babylon.js 3D
```
The AI tooling can therefore assist with the integration code while LikeC4 remains authoritative for architecture modeling.

The agent should not recreate LikeC4 semantics manually in Svelte components when LikeC4 already provides the required information.

⸻

## 12. Relationship to Babylon.js

Babylon.js remains the preferred 3D rendering technology established in memo4.md.

The development split should remain clear:
```
LikeC4
   │
   ▼
architecture model
   │
   ▼
projection / transformation
   │
   ├────────────► LikeC4 2D
   │
   └────────────► Babylon.js 3D
```
Svelte components provide lifecycle and UI integration around Babylon.js.

The AI agent can help generate this integration, but the repository should maintain clear boundaries between:

* architecture semantics;
* Svelte UI;
* Babylon rendering;
* interaction logic.

Avoid giant Svelte components containing the entire 3D engine implementation.

⸻

## 13. Recommended Source Structure

The exact structure may evolve, but the implementation should move toward boundaries similar to:
```
.
├── .opencode/
│   └── svelte.json
│
├── src/
│   ├── lib/
│   │   ├── architecture/
│   │   │   ├── model/
│   │   │   ├── adapters/
│   │   │   └── projections/
│   │   │
│   │   ├── likec4/
│   │   │   ├── components/
│   │   │   └── integration/
│   │   │
│   │   ├── babylon/
│   │   │   ├── engine/
│   │   │   ├── scene/
│   │   │   ├── entities/
│   │   │   ├── interaction/
│   │   │   └── components/
│   │   │
│   │   └── ui/
│   │
│   └── routes/
│
├── static/
├── tests/
├── opencode.json
├── package.json
├── Dockerfile
├── compose.yaml
└── .env.example
```
Do not create empty directories simply to match this diagram.

Create boundaries when implementation requires them.

⸻

## 14. Repository Instructions for AI Agents

The repository SHOULD explicitly document how AI agents are expected to work.

Instructions should include principles such as:

1. Read the relevant architecture memos before making structural changes.
2. Treat memo4.md as authoritative for the application architecture.
3. Treat this memo as authoritative for Svelte AI-assisted development.
4. Use Svelte-specific tooling for Svelte-specific questions.
5. Consult current Svelte documentation rather than relying exclusively on model memory.
6. Run Svelte-aware validation after modifying Svelte files.
7. Run repository checks before considering work complete.
8. Preserve LikeC4 as the architecture-model authority.
9. Preserve Babylon.js as the preferred 3D renderer.
10. Do not introduce OpenCode tooling into the production runtime.
11. Prefer local inference where it is adequate.
12. Escalate models based on task complexity rather than by default.

⸻

## 15. Docker Boundary

The Docker architecture defined in memo4.md remains valid.

The production image should contain only what is required to run the SvelteKit application.

Conceptually:
```
Developer machine
│
├── OpenCode
├── @sveltejs/opencode
├── Svelte MCP
├── local/remote LLM
│
└── repository
      │
      ▼
   docker build
      │
      ▼
production image
      │
      └── SvelteKit application
```
Do not install the complete AI development environment into the final runtime image.

A multi-stage Docker build should continue to separate:
```
dependencies
    ↓
build
    ↓
minimal runtime
```
⸻

## 16. CI Remains Deterministic

AI tooling belongs primarily to development.

CI should not require an LLM to determine whether the repository is valid.

Prefer:
```
git push
   │
   ▼
CI
   │
   ├── install
   ├── type/check
   ├── lint
   ├── test
   ├── build
   └── container validation
```
over:
```
git push
   │
   ▼
ask an LLM whether the code looks correct
```
AI review MAY later supplement CI.

It must not replace deterministic checks.

⸻

## 17. Preparing for Future SvelteKit Versions

One strategic advantage of this architecture is reduced dependence on model training dates.

As SvelteKit evolves:
```
new SvelteKit release
        │
        ▼
updated documentation/tooling
        │
        ▼
Svelte MCP
        │
        ▼
@sveltejs/opencode
        │
        ▼
OpenCode agent
```
This should make future migrations easier because the agent can reason with current framework information.

This is especially useful while preparing for a future major SvelteKit version.

However, MCP access does not itself guarantee migration compatibility.

The repository must still:

* isolate framework-specific assumptions;
* avoid deprecated APIs;
* maintain tests;
* keep dependencies current;
* follow official migration guidance;
* minimize unnecessary framework coupling.

⸻

## 18. Implementation Sequence

Implement this memo incrementally.

### Phase 1 — OpenCode

Introduce OpenCode configuration into the repository.

Verify that ordinary repository tasks can be performed through OpenCode.

### Phase 2 — Svelte Integration

Enable:

@sveltejs/opencode

Verify that the plugin is active for Svelte work.

### Phase 3 — MCP

Configure the preferred Svelte MCP mode.

Confirm that the agent can retrieve current Svelte documentation.

### Phase 4 — Svelte Editing

Test the workflow against a real .svelte component.

The agent should:
```
inspect
   ↓
retrieve relevant guidance
   ↓
edit
   ↓
validate
   ↓
correct
```
### Phase 5 — Repository Validation

Ensure AI-created changes pass:
```
npm run check
npm run lint
npm test
npm run build
```
Adapt these commands to the actual repository scripts.

### Phase 6 — Local Model

Configure OpenCode to use the preferred local inference endpoint where supported.

Use a simple Svelte task as the first acceptance test.

### Phase 7 — Model Escalation

Document which classes of work are normally handled locally and when a stronger remote model should be selected.

Do not prematurely automate escalation until practical usage demonstrates that it is necessary.

⸻

## 19. Acceptance Criteria

This memo is considered implemented when:

* OpenCode is configured for the repository;
* @sveltejs/opencode is enabled;
* Svelte-specific AI tooling is available;
* current Svelte documentation can be consulted through the supported Svelte tooling;
* Svelte files can be edited using the Svelte-aware workflow;
* generated Svelte code can be validated using Svelte-aware tooling;
* repository checks remain authoritative;
* local inference can be selected independently from the Svelte tooling where supported;
* remote models can remain available as an escalation path;
* LikeC4 remains the architecture-model authority;
* Babylon.js remains the 3D renderer;
* AI development dependencies are excluded from the production runtime;
* the Dockerized application continues to build and run independently of OpenCode.

⸻

## 20. Non-Goals

This memo does not propose:

* embedding an LLM into the production application;
* making OpenCode a runtime dependency;
* replacing SvelteKit with an AI framework;
* replacing LikeC4;
* replacing Babylon.js;
* allowing AI output to bypass testing;
* making MCP a production service dependency;
* coupling the repository to one proprietary LLM;
* replacing developers with autonomous agents.

The objective is much narrower:

Give coding agents first-class, current, Svelte-aware engineering capabilities while preserving deterministic software-engineering practices.

⸻

## 21. Target End State

The resulting development architecture should be:
```
                         DEVELOPER
                             │
                             ▼
                         OpenCode
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
        Local inference                Remote model
              │                             │
              └──────────────┬──────────────┘
                             │
                             ▼
                    @sveltejs/opencode
                             │
                    ┌────────┼────────┐
                    │        │        │
                    ▼        ▼        ▼
                 Skills   Subagent   Svelte MCP
                                      │
                                      ▼
                            Current Svelte knowledge
                                      +
                              Svelte validation
                                      │
                                      ▼
                              SvelteKit source
                                      │
                     ┌────────────────┴────────────────┐
                     ▼                                 ▼
                   LikeC4                         Babylon.js
                     │                                 │
                     ▼                                 ▼
              Architecture 2D                   Architecture 3D
                     │                                 │
                     └────────────────┬────────────────┘
                                      ▼
                              SvelteKit application
                                      │
                                      ▼
                                Docker image
```
This creates a useful separation of concerns:

the model reasons, Svelte tooling supplies framework expertise, deterministic tools verify the result, and SvelteKit runs the application.

That should be the preferred AI-assisted development model for the architecture established in memo4.md.

⸻

## References

* memo4.md — SvelteKit / LikeC4 / Babylon.js application architecture
* @sveltejs/opencode — https://www.npmjs.com/package/@sveltejs/opencode
* Svelte AI tooling — https://github.com/sveltejs/ai-tools
* Svelte CLI — https://github.com/sveltejs/cli
* Svelte — https://svelte.dev/
* SvelteKit — https://svelte.dev/docs/kit
* OpenCode — https://opencode.ai/
* LikeC4 — https://likec4.dev/
* Babylon.js — https://www.babylonjs.com/
