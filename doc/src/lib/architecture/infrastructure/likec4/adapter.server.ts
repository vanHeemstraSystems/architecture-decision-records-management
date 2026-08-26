/**
 * LikeC4 Adapter — server-only parse path (Memo 4 §8).
 * Node-only. Imports `@likec4/language-services/node` and its Node built-ins.
 * The `.server.ts` suffix causes SvelteKit/Vite to reject imports of this file
 * from any browser bundle, so `@likec4/language-services` and `bundle-require`
 * never appear in the client output.
 */
import type { ArchitectureModel, ArchitectureElementKind } from '../../domain/architecture';
import type { ArchitectureElement } from '../../domain/element';
import type { ArchitectureRelationship } from '../../domain/relationship';
import type { ArchitectureView } from '../../domain/view';
import type { ArchitectureDecision } from '../../domain/decision';
import { buildSeedModel, seedDecisions } from './seed-model';
import type { LoadFromLikeC4Options } from './adapter';

const ADAPTER_VERSION = '0.5.0';

const KIND_MAP: Record<string, ArchitectureElementKind> = {
	person: 'person',
	softwareSystem: 'softwareSystem',
	system: 'system',
	container: 'container',
	component: 'component',
	group: 'group'
};

function mapKind(kind: string): ArchitectureElementKind {
	return KIND_MAP[kind] ?? 'other';
}

function textOrEmpty(value: unknown): string | undefined {
	if (value == null) return undefined;
	if (typeof value === 'string') return value || undefined;
	const s = String(value).trim();
	return s.length ? s : undefined;
}

export async function loadFromLikeC4Server(
	options: LoadFromLikeC4Options = {}
): Promise<ArchitectureModel> {
	try {
		const { fromWorkspace } = await import('@likec4/language-services/node');
		const path = await import('node:path');
		const workspace =
			options.workspacePath ?? path.resolve(process.cwd(), 'architecture/model');
		const likec4 = await fromWorkspace(workspace);
		if (likec4.hasErrors()) {
			likec4.printErrors();
			return buildSeedModel('likec4-adapter:seed-after-errors', ADAPTER_VERSION);
		}
		const model = await likec4.computedModel();
		return translate(model, workspace);
	} catch {
		return buildSeedModel('likec4-adapter:seed-fallback', ADAPTER_VERSION);
	}
}

type LikeC4ComputedModel = Awaited<
	ReturnType<
		Awaited<ReturnType<typeof import('@likec4/language-services/node').fromWorkspace>>['computedModel']
	>
>;

function translate(model: LikeC4ComputedModel, workspace: string): ArchitectureModel {
	const elements: ArchitectureElement[] = [];
	for (const el of model.elements()) {
		const kind = mapKind(String(el.kind));
		const description = textOrEmpty((el.description as { toString(): string })?.toString?.());
		const tags = [...el.tags].map((t) => String(t));
		elements.push({
			id: String(el.id),
			kind,
			name: el.title || el.name,
			description,
			parent: el.parent ? String(el.parent.id) : undefined,
			tags: tags.length ? tags : undefined,
			metadata: {}
		});
	}

	const relationships: ArchitectureRelationship[] = [];
	for (const rel of model.relationships()) {
		relationships.push({
			id: String(rel.id),
			source: String(rel.source.id),
			target: String(rel.target.id),
			label: textOrEmpty(rel.title),
			kind: rel.kind ? String(rel.kind) : undefined
		});
	}

	const views: ArchitectureView[] = [];
	for (const v of model.views()) {
		const viewElements: string[] = [];
		for (const node of v.elements()) {
			const el = node.element;
			if (el) viewElements.push(String(el.id));
		}
		views.push({
			id: String(v.id),
			name: v.title ?? String(v.id),
			elements: viewElements
		});
	}

	const elementIds = new Set(elements.map((e) => e.id));
	const shortToFqn = new Map<string, string>();
	for (const id of elementIds) {
		const short = id.includes('.') ? id.slice(id.lastIndexOf('.') + 1) : id;
		if (!shortToFqn.has(short)) shortToFqn.set(short, id);
	}
	const decisions: ArchitectureDecision[] = seedDecisions.map((d) => ({
		...d,
		relatedElements: d.relatedElements.map((ref) =>
			elementIds.has(ref) ? ref : (shortToFqn.get(ref) ?? ref)
		)
	}));

	return {
		id: 'adr-platform',
		name: 'Architecture Decision Records Platform',
		description: 'Canonical model translated from LikeC4 DSL.',
		elements,
		relationships,
		decisions,
		views,
		metadata: {
			adapter: 'likec4-bridge',
			version: ADAPTER_VERSION,
			mode: 'likec4-workspace',
			workspace
		},
		source: 'likec4-workspace',
		updatedAt: new Date().toISOString()
	};
}
