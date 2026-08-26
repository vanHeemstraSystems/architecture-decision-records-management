<script lang="ts">
	import { onMount } from 'svelte';
	import { model, architectureContext } from '$lib/remote/architecture.remote';
	import { decision } from '$lib/remote/decisions.remote';
	import { search } from '$lib/remote/search.remote';
	import {
		getRecentSpans,
		clearRecentSpans,
		getTracingConfig,
		type FinishedSpan
	} from '$lib/observability';

	let spans = $state<FinishedSpan[]>([]);
	let config = $state({ enabled: false, serviceName: '' });
	let status = $state('');

	function refresh() {
		spans = [...getRecentSpans()].reverse();
		config = getTracingConfig();
	}

	async function runDemo() {
		status = 'Running…';
		clearRecentSpans();
		await model();
		await architectureContext('softwareSystem');
		await decision('ADR-0002');
		await search('babylon');
		refresh();
		status = `Recorded ${getRecentSpans().length} spans`;
	}

	onMount(() => {
		refresh();
		runDemo();
	});
</script>

<svelte:head><title>Observability</title></svelte:head>
<h1>Observability (Phase 10)</h1>
<p class="lead">Spans: architecture.model.load, context.resolve, decision.open, search, …</p>

<section class="card">
	<h2>Config</h2>
	<p>
		<code>OTEL_ENABLED</code> = <strong>{config.enabled ? 'true' : 'false'}</strong>
		· <code>{config.serviceName}</code>
	</p>
	<div class="row">
		<button type="button" onclick={runDemo}>Run demo</button>
		<button type="button" onclick={() => { clearRecentSpans(); refresh(); }}>Clear</button>
		<button type="button" onclick={refresh}>Refresh</button>
	</div>
	<p class="muted">{status}</p>
</section>

<section class="card">
	<h2>Recent spans ({spans.length})</h2>
	{#if !spans.length}
		<p class="muted">No spans yet.</p>
	{:else}
		<table>
			<thead>
				<tr><th></th><th>Name</th><th>ms</th><th>Attributes</th></tr>
			</thead>
			<tbody>
				{#each spans as s}
					<tr>
						<td>{s.status === 'ok' ? '✓' : '✗'}</td>
						<td><code>{s.name}</code></td>
						<td>{s.durationMs}</td>
						<td class="attrs">
							{#each Object.entries(s.attributes).filter(([k]) => k !== 'service.name') as [k, v]}
								<span class="attr">{k}={String(v)}</span>
							{/each}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>

<style>
	h1 { margin-top: 0; }
	.lead { color: #8b98a5; }
	.card {
		background: #16181c; border: 1px solid #2f3336; border-radius: 12px;
		padding: 1.25rem; margin-bottom: 1rem;
	}
	h2 { font-size: 1.05rem; margin: 0 0 0.75rem; color: #1d9bf0; }
	.row { display: flex; gap: 0.5rem; margin: 0.75rem 0; }
	button {
		background: #16181c; border: 1px solid #2f3336; color: #e7e9ea;
		padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer;
	}
	button:hover { border-color: #1d9bf0; color: #1d9bf0; }
	code { background: #2f3336; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.85em; }
	.muted { color: #71767b; font-size: 0.9rem; }
	table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
	th, td { text-align: left; padding: 0.4rem 0.5rem; border-bottom: 1px solid #2f3336; vertical-align: top; }
	.attrs { display: flex; flex-wrap: wrap; gap: 0.25rem; }
	.attr {
		background: #0f1419; padding: 0.1rem 0.35rem; border-radius: 4px;
		font-size: 0.75rem; color: #8b98a5;
	}
</style>
