<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>
<div class="app">
	<header>
		<a href="/" class="logo">ADR Management</a>
		<nav>
			<a href="/">Home</a>
			<a href="/architecture">Architecture</a>
			<a href="/services">Services</a>
			<a href="/observability">Observability</a>
			<a href="/remote-demo">Remote</a>
		</nav>
	</header>
	<main>{@render children()}</main>
</div>
<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, sans-serif;
		background: #0f1419;
		color: #e7e9ea;
		line-height: 1.5;
	}
	.app { min-height: 100vh; display: flex; flex-direction: column; }
	header {
		display: flex; align-items: center; justify-content: space-between;
		padding: 0.75rem 1.5rem; border-bottom: 1px solid #2f3336; background: #16181c;
	}
	.logo { font-weight: 700; color: #1d9bf0; text-decoration: none; }
	nav { display: flex; gap: 1rem; flex-wrap: wrap; }
	nav a { color: #e7e9ea; text-decoration: none; font-size: 0.9rem; }
	nav a:hover { color: #1d9bf0; }
	main {
		flex: 1; padding: 2rem 1.5rem; max-width: 1000px;
		margin: 0 auto; width: 100%; box-sizing: border-box;
	}
</style>
