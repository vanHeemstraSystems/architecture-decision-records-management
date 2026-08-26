<script lang="ts">
	import { decision } from '$lib/remote/decisions.remote';
	import { buildSceneGraph, type SceneGraph } from '$lib/scene';
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

	async function loadDecision(id: string) {
		return (await decision(id)) ?? null;
	}
</script>

<svelte:head><title>Architecture</title></svelte:head>
<h1>Architecture Explorer</h1>
<p class="lead">
	Scene graph built from application services. Select a node in the canvas; ADRs open in the side
	panel. Toggle between 3D and 2D projections from the toolbar.
</p>
<ArchitectureCanvas {graph} {loadDecision} />

<style>
	h1 { margin-top: 0; }
	.lead { color: #8b98a5; }
</style>
