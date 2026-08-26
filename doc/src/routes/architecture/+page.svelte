<script lang="ts">
	import { getArchitectureContext, type ArchitectureContext } from '$lib/architecture';
	import { buildSceneGraph, type SceneGraph } from '$lib/scene';
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
	let selectedId = $state<string | null>(null);

	async function selectNode(id: string) {
		selectedId = id;
		context = id.startsWith('ADR-') ? null : await getArchitectureContext(id);
	}
</script>

<svelte:head><title>Architecture</title></svelte:head>
<h1>Architecture Explorer</h1>
<p class="lead">Scene graph built from application services. Select a node for context.</p>
<div class="card">
	<h2>{graph.name}</h2>
	<p class="muted">{graph.nodes.length} nodes · {graph.edges.length} edges</p>
	<ul>
		{#each graph.nodes as n}
			<li>
				<button type="button" class:active={selectedId === n.id} onclick={() => selectNode(n.id)}>
					<code>{n.id}</code> — {n.label}
					<span class="tag">{n.kind}</span>
				</button>
			</li>
		{/each}
	</ul>
</div>
{#if context}
	<aside class="card">
		<h3>Context: {context.element.name}</h3>
		{#if context.parent}<p>Parent: {context.parent.name}</p>{/if}
		{#if context.children.length}
			<p>Children: {context.children.map((c) => c.name).join(', ')}</p>
		{/if}
		<p>
			Relationships: {context.relationships.length} · Related ADRs:
			{context.decisions.length}
		</p>
	</aside>
{/if}
<style>
	h1 { margin-top: 0; }
	.lead { color: #8b98a5; }
	.card {
		background: #16181c; border: 1px solid #2f3336; border-radius: 12px;
		padding: 1.25rem; margin-bottom: 1rem;
	}
	h2, h3 { color: #1d9bf0; margin: 0 0 0.5rem; }
	.muted { color: #71767b; font-size: 0.9rem; }
	ul { list-style: none; padding: 0; margin: 0; }
	button {
		background: 0; border: 0; color: #e7e9ea; cursor: pointer;
		padding: 0.35rem 0; text-align: left; width: 100%;
	}
	button:hover, button.active { color: #1d9bf0; }
	code { background: #2f3336; padding: 0.1rem 0.3rem; border-radius: 4px; font-size: 0.85em; }
	.tag { font-size: 0.75rem; color: #8b98a5; margin-left: 0.35rem; }
</style>
