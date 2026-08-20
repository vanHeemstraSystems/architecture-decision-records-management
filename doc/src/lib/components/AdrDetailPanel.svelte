<script lang="ts">
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
		decision: Decision | null;
		onClose?: () => void;
		onNavigateDecision?: (id: string) => void;
	}

	let { decision, onClose, onNavigateDecision }: Props = $props();
</script>

{#if decision}
	<aside class="panel">
		<header>
			<div class="id">{decision.id}</div>
			<button type="button" class="close" onclick={() => onClose?.()} aria-label="Close">×</button>
		</header>
		<h2>{decision.title}</h2>
		<div class="meta">
			<span class="status status-{decision.status}">{decision.status}</span>
			{#if decision.date}<span class="date">{decision.date}</span>{/if}
		</div>
		{#if decision.relatedElements?.length}
			<section>
				<h3>Affects elements</h3>
				<ul>
					{#each decision.relatedElements as el}
						<li><code>{el}</code></li>
					{/each}
				</ul>
			</section>
		{/if}
		{#if decision.relatedDecisions?.length}
			<section>
				<h3>Related decisions</h3>
				<ul>
					{#each decision.relatedDecisions as rid}
						<li>
							<button type="button" class="link" onclick={() => onNavigateDecision?.(rid)}>
								{rid}
							</button>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
		{#if decision.markdown}
			<section class="markdown">
				<h3>ADR content</h3>
				<pre>{decision.markdown}</pre>
			</section>
		{/if}
	</aside>
{/if}

<style>
	.panel {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
		bottom: 0.6rem;
		width: min(380px, 92%);
		background: #16181c;
		border: 1px solid #2f3336;
		border-radius: 12px;
		padding: 1rem 1.1rem;
		overflow-y: auto;
		z-index: 10;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.id {
		font-size: 0.8rem;
		color: #1d9bf0;
		font-weight: 600;
	}
	.close {
		background: transparent;
		border: none;
		color: #8b98a5;
		font-size: 1.4rem;
		cursor: pointer;
		line-height: 1;
	}
	.close:hover {
		color: #e7e9ea;
	}
	h2 {
		font-size: 1.15rem;
		margin: 0 0 0.75rem;
		line-height: 1.3;
	}
	.meta {
		display: flex;
		gap: 0.6rem;
		align-items: center;
		margin-bottom: 1rem;
	}
	.status {
		font-size: 0.75rem;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		font-weight: 600;
		text-transform: uppercase;
	}
	.status-accepted {
		background: #0a2e1c;
		color: #00ba7c;
	}
	.status-proposed {
		background: #0a1e2e;
		color: #1d9bf0;
	}
	.status-deprecated,
	.status-rejected {
		background: #2e0a0a;
		color: #f4212e;
	}
	.status-superseded {
		background: #2e1a0a;
		color: #ff7a00;
	}
	.date {
		font-size: 0.8rem;
		color: #71767b;
	}
	h3 {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #71767b;
		margin: 0 0 0.4rem;
	}
	section {
		margin-bottom: 1rem;
	}
	ul {
		margin: 0;
		padding-left: 1.1rem;
	}
	code {
		background: #2f3336;
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
		font-size: 0.85em;
	}
	.link {
		background: none;
		border: none;
		color: #1d9bf0;
		cursor: pointer;
		font-size: 0.9rem;
		padding: 0;
		text-decoration: underline;
	}
	.markdown pre {
		white-space: pre-wrap;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.8rem;
		line-height: 1.45;
		background: #0f1419;
		border: 1px solid #2f3336;
		border-radius: 8px;
		padding: 0.75rem;
		margin: 0;
		max-height: 280px;
		overflow-y: auto;
	}
</style>
