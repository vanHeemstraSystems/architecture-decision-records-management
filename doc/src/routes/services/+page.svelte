<script lang="ts">
	import { architectureContext } from '$lib/remote/architecture.remote';
	import { decisions } from '$lib/remote/decisions.remote';
	import { views as viewsRemote } from '$lib/remote/views.remote';
	import { search } from '$lib/remote/search.remote';
	import type { SearchResult, ArchitectureContext } from '$lib/architecture';

	let searchQuery = $state('babylon');
	let searchResult = $state<SearchResult | null>(null);
	let context = $state<ArchitectureContext | null>(null);
	let contextId = $state('softwareSystem');
	let decisionTitles = $state<string[]>([]);
	let viewNames = $state<string[]>([]);

	async function runSearch() {
		searchResult = await search(searchQuery);
	}
	async function loadContext() {
		context = await architectureContext(contextId);
	}

	$effect(() => {
		(async () => {
			decisionTitles = (await decisions()).map((d) => `${d.id}: ${d.title}`);
			viewNames = (await viewsRemote()).map((v) => v.name);
			await runSearch();
			await loadContext();
		})();
	});
</script>

<svelte:head><title>Application Services</title></svelte:head>
<h1>Application Services</h1>
<p class="lead">Plain TypeScript functions — not remote functions. Phase 8.</p>

<section class="card">
	<h2>Search</h2>
	<div class="row">
		<input bind:value={searchQuery} />
		<button type="button" onclick={runSearch}>Search</button>
	</div>
	{#if searchResult}
		<p class="muted">{searchResult.total} hits</p>
		<ul>
			{#each searchResult.elements as e}
				<li><code>{e.id}</code> — {e.name}</li>
			{/each}
			{#each searchResult.decisions as d}
				<li><code>{d.id}</code> — {d.title}</li>
			{/each}
		</ul>
	{/if}
</section>

<section class="card">
	<h2>Context</h2>
	<div class="row">
		<input bind:value={contextId} />
		<button type="button" onclick={loadContext}>Load</button>
	</div>
	{#if context}
		<p><strong>{context.element.name}</strong> ({context.element.kind})</p>
		<p>Children: {context.children.map((c) => c.name).join(', ') || '—'}</p>
		<p>ADRs: {context.decisions.length}</p>
	{/if}
</section>

<section class="card">
	<h2>Decisions</h2>
	<ul>{#each decisionTitles as t}<li>{t}</li>{/each}</ul>
</section>

<section class="card">
	<h2>Views</h2>
	<ul>{#each viewNames as n}<li>{n}</li>{/each}</ul>
</section>

<style>
	h1 { margin-top: 0; }
	.lead { color: #8b98a5; }
	.card {
		background: #16181c; border: 1px solid #2f3336; border-radius: 12px;
		padding: 1.25rem; margin-bottom: 1rem;
	}
	h2 { font-size: 1.05rem; margin: 0 0 0.75rem; color: #1d9bf0; }
	.row { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
	input {
		flex: 1; background: #0f1419; border: 1px solid #2f3336;
		color: #e7e9ea; padding: 0.4rem 0.6rem; border-radius: 6px;
	}
	button {
		background: #16181c; border: 1px solid #2f3336; color: #e7e9ea;
		padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer;
	}
	button:hover { border-color: #1d9bf0; color: #1d9bf0; }
	code { background: #2f3336; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.85em; }
	.muted { color: #71767b; font-size: 0.9rem; }
	ul { margin: 0; padding-left: 1.2rem; }
</style>
