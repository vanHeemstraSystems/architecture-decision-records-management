/**
 * Fallback ArchitectureModel used when the LikeC4 DSL cannot be parsed
 * (e.g. running in the browser, missing workspace directory, or `@likec4/language-services`
 * unavailable). Also carries the ADR-enrichment data — LikeC4 has no ADR concept,
 * ADRs are memo4 §7 first-class citizens in the canonical model.
 */
import type { ArchitectureModel } from '../../domain/architecture';
import type { ArchitectureElement } from '../../domain/element';
import type { ArchitectureRelationship } from '../../domain/relationship';
import type { ArchitectureDecision } from '../../domain/decision';
import type { ArchitectureView } from '../../domain/view';

export const seedElements: ArchitectureElement[] = [
	{ id: 'user', kind: 'person', name: 'User', description: 'Architect or stakeholder', metadata: {} },
	{ id: 'softwareSystem', kind: 'softwareSystem', name: 'Architecture Explorer', description: 'Kami-styled platform', metadata: {} },
	{ id: 'webUI', kind: 'container', name: 'Web UI', parent: 'softwareSystem', tags: ['SvelteKit'], metadata: {} },
	{ id: 'likec4Adapter', kind: 'container', name: 'LikeC4 Adapter', parent: 'softwareSystem', tags: ['TypeScript'], metadata: {} },
	{ id: 'babylonRenderer', kind: 'container', name: 'Babylon.js Renderer', parent: 'softwareSystem', tags: ['Babylon.js'], metadata: {} },
	{ id: 'adrParser', kind: 'container', name: 'ADR Parser', parent: 'softwareSystem', metadata: {} },
	{ id: 'structurizrLite', kind: 'softwareSystem', name: 'Structurizr Lite', metadata: {} },
	{ id: 'adrs', kind: 'softwareSystem', name: 'Architecture Decisions', metadata: {} }
];

export const seedRelationships: ArchitectureRelationship[] = [
	{ id: 'r1', source: 'user', target: 'softwareSystem', label: 'Explores', kind: 'uses' },
	{ id: 'r2', source: 'softwareSystem', target: 'structurizrLite', label: 'Reads from', kind: 'uses' },
	{ id: 'r3', source: 'softwareSystem', target: 'adrs', label: 'Indexes', kind: 'uses' },
	{ id: 'r4', source: 'webUI', target: 'babylonRenderer', label: 'Renders via', kind: 'uses' },
	{ id: 'r5', source: 'webUI', target: 'likec4Adapter', label: 'Resolves', kind: 'uses' },
	{ id: 'r6', source: 'likec4Adapter', target: 'adrParser', label: 'Enriches', kind: 'uses' }
];

export const seedDecisions: ArchitectureDecision[] = [
	{
		id: 'ADR-0001',
		title: 'Record architecture decisions',
		status: 'accepted',
		relatedElements: ['softwareSystem', 'adrs'],
		relatedDecisions: [],
		date: '2026-07-29',
		markdown:
			'# 1. Record architecture decisions\n\n## Status\nAccepted\n\n## Decision\nUse ADRs as described by Michael Nygard.'
	},
	{
		id: 'ADR-0002',
		title: 'Adopt SvelteKit + Babylon.js',
		status: 'accepted',
		relatedElements: ['webUI', 'babylonRenderer'],
		relatedDecisions: ['ADR-0001'],
		date: '2026-08-01',
		markdown:
			'# 2. Adopt SvelteKit + Babylon.js\n\n## Status\nAccepted\n\n## Decision\nSvelteKit application platform + Babylon.js renderer.'
	},
	{
		id: 'ADR-0003',
		title: 'LikeC4 as modelling engine',
		status: 'accepted',
		relatedElements: ['likec4Adapter'],
		relatedDecisions: ['ADR-0002'],
		date: '2026-08-10',
		markdown:
			'# 3. LikeC4 as modelling engine\n\n## Status\nAccepted\n\n## Decision\nLikeC4 + canonical domain model.'
	},
	{
		id: 'ADR-0004',
		title: 'Deprecate Structurizr runtime',
		status: 'deprecated',
		relatedElements: ['structurizrLite'],
		relatedDecisions: ['ADR-0003'],
		date: '2026-08-15',
		markdown:
			'# 4. Deprecate Structurizr runtime\n\n## Status\nDeprecated\n\n## Decision\nLegacy import only; runtime uses LikeC4 + Babylon.'
	}
];

export const seedViews: ArchitectureView[] = [
	{
		id: 'SystemContext',
		name: 'System Context',
		elements: ['user', 'softwareSystem', 'structurizrLite', 'adrs'],
		kind: 'systemContext'
	},
	{
		id: 'Containers',
		name: 'Containers',
		elements: ['softwareSystem', 'webUI', 'likec4Adapter', 'babylonRenderer', 'adrParser'],
		kind: 'container'
	},
	{
		id: 'Decisions',
		name: 'Decision Landscape',
		elements: ['softwareSystem', 'webUI', 'likec4Adapter', 'babylonRenderer', 'adrs'],
		kind: 'decision'
	}
];

export function buildSeedModel(source: string, adapterVersion: string): ArchitectureModel {
	return {
		id: 'adr-platform',
		name: 'Architecture Decision Records Platform',
		description: 'Canonical model produced by the LikeC4 adapter.',
		elements: seedElements,
		relationships: seedRelationships,
		decisions: seedDecisions,
		views: seedViews,
		metadata: { adapter: 'likec4-bridge', version: adapterVersion, mode: source },
		source,
		updatedAt: new Date().toISOString()
	};
}
