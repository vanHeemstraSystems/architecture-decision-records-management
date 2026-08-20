<script lang="ts">
	/**
	 * Remote functions demo — requires kit.experimental.remoteFunctions.
	 * Falls back to direct application services if remote import fails at build.
	 */
	import {
		getArchitecture,
		getArchitectureContext,
		getDecisions,
		searchArchitecture
	} from '$lib/architecture';

	let modelName = $state('');
	let searchHits = $state(0);
	let contextName = $state('');
	let decisionCount = $state(0);

	$effect(() => {
		(async () => {
			const m = await getArchitecture();
			modelName = m.name;
			decisionCount = (await getDecisions()).length;
			const s = await searchArchitecture('babylon');
			searchHits = s.total;
			const c = await getArchitectureContext('softwareSystem');
			contextName = c?.element.name ?? '—';
		})();
	});
</script>

<svelte:head><title>Remote Functions</title></svelte:head>
<h1>Remote Functions (Phase 9)</h1>
<p class="lead">
	<code>*.remote.ts</code> files wrap application services with <code>query()</code>.
	This page exercises the same services (direct call). Wire remote imports when
	<code>experimental.remoteFunctions</code> is enabled.
</p>
<section class="card">
	<p>Model: <strong>{modelName}</strong></p>
	<p>Decisions: {decisionCount}</p>
	<p>Search “babylon”: {searchHits} hits</p>
	<p>Context softwareSystem: {contextName}</p>
</section>
<style>
	h1 { margin-top: 0; }
	.lead { color: #8b98a5; }
	.card {
		background: #16181c; border: 1px solid #2f3336; border-radius: 12px;
		padding: 1.25rem;
	}
	code { background: #2f3336; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.85em; }
</style>
