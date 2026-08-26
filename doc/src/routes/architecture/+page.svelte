<script lang="ts">
	import { decision } from '$lib/remote/decisions.remote';
	import { architectureContext } from '$lib/remote/architecture.remote';
	import { buildSceneGraph, type SceneGraph } from '$lib/scene';
	import type { ArchitectureContext } from '$lib/architecture';
	import ArchitectureCanvas from '$lib/components/ArchitectureCanvas.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const graph: SceneGraph = $derived(
		buildSceneGraph(data.model, {
			includeDecisions: true,
			includeDecisionLinks: true,
			includeDecisionToDecision: true,
			spatialGrouping: true
		})
	);

	let context = $state<ArchitectureContext | null>(null);
	let contextId = $state<string | null>(null);
	let contextError = $state<string | null>(null);

	async function loadDecision(id: string) {
		return (await decision(id)) ?? null;
	}

	async function selectNode(id: string) {
		if (id.startsWith('ADR-')) return;
		if (id === contextId) return;
		contextId = id;
		contextError = null;
		try {
			context = (await architectureContext(id)) ?? null;
		} catch (err) {
			contextError = err instanceof Error ? err.message : String(err);
			context = null;
		}
	}

	const dependencies = $derived(
		context ? context.relationships.filter((r) => r.source === context!.element.id) : []
	);
	const dependants = $derived(
		context ? context.relationships.filter((r) => r.target === context!.element.id) : []
	);
</script>

<svelte:head><title>Architecture</title></svelte:head>
<h1>Architecture Explorer</h1>
<p class="lead">
	Scene graph built from application services. Select a node in the canvas; ADRs open in the side
	panel. Toggle between 3D and 2D projections from the toolbar.
</p>

<div class="layout">
	<ArchitectureCanvas {graph} {loadDecision} onSelect={selectNode} />

	<aside class="context" aria-label="Element context">
		{#if contextError}
			<p class="error">Failed to load context: {contextError}</p>
		{:else if !context}
			<p class="empty">Select a non-ADR node to inspect its context.</p>
		{:else}
			<h2>{context.element.name}</h2>
			<p class="kind"><code>{context.element.kind}</code> · <code>{context.element.id}</code></p>
			{#if context.element.description}
				<p class="desc">{context.element.description}</p>
			{/if}
			<dl>
				<dt>Parent</dt>
				<dd>
					{#if context.parent}
						{context.parent.name} <span class="muted">({context.parent.id})</span>
					{:else}
						<span class="muted">—</span>
					{/if}
				</dd>

				<dt>Children ({context.children.length})</dt>
				<dd>
					{#if context.children.length}
						<ul>
							{#each context.children as c (c.id)}
								<li>{c.name} <span class="muted">({c.id})</span></li>
							{/each}
						</ul>
					{:else}
						<span class="muted">—</span>
					{/if}
				</dd>

				<dt>Decisions ({context.decisions.length})</dt>
				<dd>
					{#if context.decisions.length}
						<ul>
							{#each context.decisions as d (d.id)}
								<li>{d.id} · {d.title} <span class="muted">({d.status})</span></li>
							{/each}
						</ul>
					{:else}
						<span class="muted">—</span>
					{/if}
				</dd>

				<dt>Dependencies ({dependencies.length})</dt>
				<dd>
					{#if dependencies.length}
						<ul>
							{#each dependencies as r (r.id)}
								<li>→ {r.target}{r.label ? ` · ${r.label}` : ''}</li>
							{/each}
						</ul>
					{:else}
						<span class="muted">—</span>
					{/if}
				</dd>

				<dt>Dependants ({dependants.length})</dt>
				<dd>
					{#if dependants.length}
						<ul>
							{#each dependants as r (r.id)}
								<li>← {r.source}{r.label ? ` · ${r.label}` : ''}</li>
							{/each}
						</ul>
					{:else}
						<span class="muted">—</span>
					{/if}
				</dd>
			</dl>
		{/if}
	</aside>
</div>

<style>
	h1 { margin-top: 0; }
	.lead { color: #8b98a5; }
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 320px;
		gap: 1rem;
		align-items: start;
	}
	@media (max-width: 900px) {
		.layout { grid-template-columns: 1fr; }
	}
	.context {
		background: #0f1419;
		border: 1px solid #2f3336;
		border-radius: 12px;
		padding: 0.9rem 1rem;
		color: #e7e9ea;
		font-size: 0.9rem;
		max-height: 580px;
		overflow: auto;
	}
	.context h2 { margin: 0 0 0.25rem; font-size: 1.05rem; }
	.context .kind { margin: 0 0 0.5rem; color: #8b98a5; font-size: 0.8rem; }
	.context .desc { margin: 0 0 0.75rem; color: #b1b8bf; }
	.context dl { margin: 0; display: grid; grid-template-columns: 1fr; gap: 0.35rem 0; }
	.context dt { font-weight: 600; color: #b1b8bf; margin-top: 0.5rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.03em; }
	.context dd { margin: 0.15rem 0 0.4rem; }
	.context ul { list-style: none; padding: 0; margin: 0.15rem 0 0; display: flex; flex-direction: column; gap: 0.15rem; }
	.context code { background: #16181c; padding: 0.05rem 0.3rem; border-radius: 4px; font-size: 0.8rem; }
	.muted { color: #71767b; }
	.empty { color: #8b98a5; margin: 0; }
	.error { color: #f4212e; margin: 0; }
</style>
