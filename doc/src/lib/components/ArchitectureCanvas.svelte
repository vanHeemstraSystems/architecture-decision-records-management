<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { SceneGraph } from '$lib/scene';
	import type { BabylonRenderer, ProjectionMode } from '$lib/renderer/babylon';
	import AdrDetailPanel from './AdrDetailPanel.svelte';

	interface Decision {
		id: string;
		title: string;
		status: string;
		markdown?: string;
		relatedElements?: string[];
		relatedDecisions?: string[];
		date?: string;
	}

	interface Props {
		graph: SceneGraph | null;
		/** Optional: resolve ADR by id (wire to getDecision) */
		loadDecision?: (id: string) => Promise<Decision | null>;
		/** Optional: notified whenever a mesh is picked (all ids, including ADRs) */
		onSelect?: (id: string) => void;
	}

	let { graph, loadDecision, onSelect }: Props = $props();

	let canvasEl: HTMLCanvasElement;
	let renderer: BabylonRenderer | null = null;
	let selectedId: string | null = $state(null);
	let selectedDecision: Decision | null = $state(null);
	let mode: ProjectionMode = $state('3d');
	let status = $state('Initialising…');
	let errorMsg = $state<string | null>(null);

	onMount(async () => {
		try {
			status = 'Loading Babylon.js…';
			const { createBabylonRenderer } = await import('$lib/renderer/babylon');
			renderer = await createBabylonRenderer(canvasEl);
			mode = renderer.getMode();
			renderer.onSelect(async (id) => {
				selectedId = id;
				selectedDecision = null;
				if (id) onSelect?.(id);
				if (id?.startsWith('ADR-') && loadDecision) {
					selectedDecision = await loadDecision(id);
				}
			});
			status = 'Ready';
			if (graph) {
				await renderer.setGraph(graph);
				status = `${graph.name} · ${graph.nodes.length} nodes · ${mode.toUpperCase()}`;
			}
		} catch (err: any) {
			errorMsg = err?.message ?? String(err);
			status = 'Failed';
			console.error(err);
		}
	});

	onDestroy(() => {
		renderer?.dispose();
		renderer = null;
	});

	$effect(() => {
		if (renderer && graph) {
			status = 'Updating scene…';
			renderer
				.setGraph(graph)
				.then(() => {
					status = `${graph.name} · ${graph.nodes.length} nodes · ${mode.toUpperCase()}`;
				})
				.catch((err) => {
					errorMsg = err?.message ?? String(err);
				});
		}
	});

	async function toggleMode() {
		if (!renderer) return;
		const next: ProjectionMode = mode === '3d' ? '2d' : '3d';
		status = `Switching to ${next.toUpperCase()}…`;
		await renderer.setMode(next, true);
		mode = next;
		renderer.fit();
		status = `${graph?.name ?? ''} · ${mode.toUpperCase()}`;
	}

	function fit() {
		renderer?.fit();
	}

	function closePanel() {
		selectedDecision = null;
		selectedId = null;
	}

	async function navigateDecision(id: string) {
		if (loadDecision) selectedDecision = await loadDecision(id);
		selectedId = id;
		renderer?.focus(id);
	}
</script>

<div class="canvas-wrap">
	<canvas bind:this={canvasEl} class="canvas"></canvas>

	<div class="toolbar">
		<button type="button" onclick={fit}>Fit</button>
		<button type="button" class="mode" onclick={toggleMode}>
			{mode === '3d' ? 'Switch to 2D' : 'Switch to 3D'}
		</button>
		<span class="badge">{mode.toUpperCase()}</span>
		{#if selectedId && !selectedDecision}
			<span class="sel"><code>{selectedId}</code></span>
		{/if}
		<span class="status">{status}</span>
	</div>

	<AdrDetailPanel
		decision={selectedDecision}
		onClose={closePanel}
		onNavigateDecision={navigateDecision}
	/>

	{#if errorMsg}
		<div class="error">{errorMsg}</div>
	{/if}
</div>

<style>
	.canvas-wrap {
		position: relative;
		width: 100%;
		height: 580px;
		background: #0f1419;
		border: 1px solid #2f3336;
		border-radius: 12px;
		overflow: hidden;
	}
	.canvas {
		width: 100%;
		height: 100%;
		display: block;
		touch-action: none;
	}
	.toolbar {
		position: absolute;
		top: 0.6rem;
		left: 0.6rem;
		right: 0.6rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		pointer-events: none;
		z-index: 5;
	}
	.toolbar > * {
		pointer-events: auto;
	}
	button {
		background: #16181c;
		border: 1px solid #2f3336;
		color: #e7e9ea;
		padding: 0.3rem 0.7rem;
		border-radius: 6px;
		font-size: 0.85rem;
		cursor: pointer;
	}
	button:hover {
		border-color: #1d9bf0;
		color: #1d9bf0;
	}
	.badge {
		font-size: 0.75rem;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		background: #1d9bf022;
		color: #1d9bf0;
		font-weight: 600;
	}
	.sel code {
		background: #2f3336;
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
		color: #ffd400;
		font-size: 0.85rem;
	}
	.status {
		margin-left: auto;
		font-size: 0.8rem;
		color: #71767b;
	}
	.error {
		position: absolute;
		bottom: 0.6rem;
		left: 0.6rem;
		right: 0.6rem;
		background: #3d1214;
		color: #f4212e;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.85rem;
		z-index: 5;
	}
</style>
