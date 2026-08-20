# OpenCode / AI development (memo5)

The **application** lives here (`doc/`). AI tooling is configured at the **repository root**:

- `../opencode.json` — enables `@sveltejs/opencode`
- `../AGENTS.md` — agent rules (memo4 boundaries + memo5 process)
- `../.opencode/` — skills and Svelte project hints

```bash
# from repo root, with OpenCode installed
opencode
```

Production Docker images must **not** include OpenCode or LLM tooling.
