<script lang="ts">
	import { model } from '$lib/remote/architecture.remote';
	import { getTracingConfig } from '$lib/observability';
	const modelP = model();
	const otel = getTracingConfig();
</script>
<svelte:head><title>ADR Management</title></svelte:head>
<section class="hero">
	<h1>Architecture Decision Records Management</h1>
	<p class="lead">
		Memo 4 Phases 1–10: SvelteKit · LikeC4 · Scene Graph · Babylon API ·
		Application services · Remote functions · OpenTelemetry
	</p>
</section>
<section class="status">
	<h2>Implementation status</h2>
	<ul>
		<li>✅ Phase 1–2 — Foundation + domain model</li>
		<li>✅ Phase 3 — LikeC4 adapter</li>
		<li>✅ Phase 4 — Scene graph</li>
		<li>✅ Phase 5–7 — Babylon 2D/3D API (expand renderer modules as needed)</li>
		<li>✅ Phase 8 — Application services</li>
		<li>✅ Phase 9 — Remote functions</li>
		<li>✅ Phase 10 — OpenTelemetry-style tracing</li>
	</ul>
	<p>OTEL: <strong>{otel.enabled ? 'on' : 'off'}</strong> · <code>{otel.serviceName}</code></p>
</section>
{#await modelP then model}
	<section class="model">
		<h2>{model.name}</h2>
		<p>
			{model.elements.length} elements · {model.relationships.length} relationships ·
			{model.decisions.length} ADRs · {model.views.length} views
		</p>
		<p>
			<a href="/architecture">Architecture</a> ·
			<a href="/services">Services</a> ·
			<a href="/observability">Observability</a>
		</p>
	</section>
{/await}
<style>
	.hero { margin-bottom: 2rem; }
	h1 { font-size: 1.75rem; margin: 0 0 0.5rem; }
	.lead { color: #8b98a5; }
	.status, .model {
		background: #16181c; border: 1px solid #2f3336; border-radius: 12px;
		padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;
	}
	h2 { font-size: 1.1rem; margin: 0 0 1rem; color: #1d9bf0; }
	code { background: #2f3336; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.85em; }
	a { color: #1d9bf0; }
</style>
