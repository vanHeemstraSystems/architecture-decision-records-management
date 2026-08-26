import type { ArchitectureModel, ArchitectureElementKind } from '../../domain/architecture';
import type { ArchitectureElement } from '../../domain/element';
import type { ArchitectureRelationship } from '../../domain/relationship';
import type { ArchitectureView } from '../../domain/view';
import { buildSeedModel, seedDecisions } from './seed-model';

/**
 * LikeC4 Adapter (Memo 4 §8).
 * Parses LikeC4 DSL via @likec4/language-services and translates the result
 * into the Canonical Architecture Model. Falls back to the seed model when
 * parsing is unavailable (browser bundle, missing DSL dir, offline tests).
 * ADRs are enriched from `seed-model` — LikeC4 has no ADR concept (memo4 §7).
 */

const ADAPTER_VERSION = '0.4.0';

export interface LoadFromLikeC4Options {
	/** Absolute or workspace-relative path containing `.c4` sources. */
	workspacePath?: string;
}

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

function canRunNodeParser(): boolean {
	return (
		typeof process !== 'undefined' &&
		!!process.versions?.node &&
		typeof (globalThis as { window?: unknown }).window === 'undefined'
	);
}

export async function loadFromLikeC4(
	options: LoadFromLikeC4Options = {}
): Promise<ArchitectureModel | null> {
	if (!canRunNodeParser()) {
		return buildSeedModel('likec4-adapter:seed', ADAPTER_VERSION);
	}
	try {
		const { fromWorkspace } = await import('@likec4/language-services/node');
		const path = await import('node:path');
		const workspace =
			options.workspacePath ??
			path.resolve(process.cwd(), 'architecture/model');
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
	ReturnType<Awaited<ReturnType<typeof import('@likec4/language-services/node').fromWorkspace>>['computedModel']>
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

	return {
		id: 'adr-platform',
		name: 'Architecture Decision Records Platform',
		description: 'Canonical model translated from LikeC4 DSL.',
		elements,
		relationships,
		decisions: seedDecisions,
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
