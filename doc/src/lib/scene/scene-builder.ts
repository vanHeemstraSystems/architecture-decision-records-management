/**
 * Scene Graph builder (Memo 4 Phase 4).
 * Transforms Canonical Architecture Model → SceneGraph.
 * No Babylon / rendering concerns.
 */

import type { ArchitectureModel } from '$lib/architecture';
import type { SceneGraph } from './scene';
import type { SceneNode } from './scene-node';
import type { SceneEdge } from './scene-edge';

export interface BuildSceneGraphOptions {
	includeDecisions?: boolean;
	includeDecisionLinks?: boolean;
	includeDecisionToDecision?: boolean;
	spatialGrouping?: boolean;
	preferredProjection?: '2d' | '3d';
}

const KIND_TOKEN: Record<string, string> = {
	person: 'kami.person',
	softwareSystem: 'kami.system',
	system: 'kami.system',
	container: 'kami.container',
	component: 'kami.component',
	group: 'kami.group',
	deploymentNode: 'kami.deployment',
	decision: 'kami.decision',
	other: 'kami.other'
};

function styleFor(kind: string, status?: string): string {
	if (kind === 'decision' && status) {
		return `kami.decision.${status}`;
	}
	return KIND_TOKEN[kind] ?? 'kami.other';
}

/**
 * Build a SceneGraph from an ArchitectureModel.
 */
export function buildSceneGraph(
	model: ArchitectureModel,
	options: BuildSceneGraphOptions = {}
): SceneGraph {
	const {
		includeDecisions = true,
		includeDecisionLinks = true,
		includeDecisionToDecision = true,
		spatialGrouping = false,
		preferredProjection = '2d'
	} = options;

	const nodes: SceneNode[] = [];
	const edges: SceneEdge[] = [];

	const byParent = new Map<string | undefined, typeof model.elements>();
	for (const el of model.elements) {
		const key = el.parent;
		if (!byParent.has(key)) byParent.set(key, []);
		byParent.get(key)!.push(el);
	}

	const colWidth = 220;
	const rowHeight = 140;
	const depthStep = spatialGrouping ? 80 : 0;

	const roots = byParent.get(undefined) ?? byParent.get('') ?? model.elements.filter((e) => !e.parent);

	function placeElements(list: typeof model.elements, parentX = 0, parentY = 0, depth = 0) {
		list.forEach((el, i) => {
			const x = parentX + (i - (list.length - 1) / 2) * colWidth;
			const y = parentY + 0 * rowHeight;
			const z = spatialGrouping ? depth * depthStep : 0;

			nodes.push({
				id: el.id,
				kind: el.kind,
				label: el.name,
				description: el.description,
				position: { x, y: parentY + depth * rowHeight, z },
				styleToken: styleFor(el.kind),
				parentId: el.parent,
				tags: el.tags,
				layer: depth,
				metadata: { ...el.metadata }
			});

			const children = byParent.get(el.id) ?? [];
			if (children.length) {
				placeElements(children, x, parentY + depth * rowHeight, depth + 1);
			}
		});
	}

	placeElements(roots.length ? roots : model.elements, 0, 0, 0);

	for (const rel of model.relationships) {
		edges.push({
			id: rel.id,
			source: rel.source,
			target: rel.target,
			label: rel.label,
			kind: rel.kind,
			styleToken: 'kami.relationship',
			metadata: rel.metadata
		});
	}

	if (includeDecisions) {
		const decisionStartX = 400;
		const decisionStartY = -200;
		model.decisions.forEach((d, i) => {
			const x = decisionStartX + (i % 3) * colWidth;
			const y = decisionStartY + Math.floor(i / 3) * rowHeight;
			const z = spatialGrouping ? -depthStep : 0;

			nodes.push({
				id: d.id,
				kind: 'decision',
				label: d.title,
				description: d.markdown?.slice(0, 120),
				position: { x, y, z },
				styleToken: styleFor('decision', d.status),
				decisionStatus: d.status,
				layer: 0,
				metadata: { status: d.status, date: d.date, ...d.metadata }
			});

			if (includeDecisionLinks) {
				for (const elId of d.relatedElements) {
					edges.push({
						id: `${d.id}->${elId}`,
						source: d.id,
						target: elId,
						label: 'relates to',
						kind: 'decision-link',
						styleToken: 'kami.decision-link'
					});
				}
			}

			if (includeDecisionToDecision && d.relatedDecisions) {
				for (const otherId of d.relatedDecisions) {
					edges.push({
						id: `${d.id}->${otherId}`,
						source: d.id,
						target: otherId,
						label: 'supersedes / relates',
						kind: 'decision-decision',
						styleToken: 'kami.decision-link'
					});
				}
			}
		});
	}

	return {
		id: `scene-${model.id}`,
		name: `${model.name} Scene`,
		nodes,
		edges,
		hints: {
			preferredProjection,
			layout: spatialGrouping ? 'spatial-layers' : 'layered-grid',
			focusNodeId: roots[0]?.id
		},
		sourceModelId: model.id,
		metadata: {
			elementCount: model.elements.length,
			decisionCount: includeDecisions ? model.decisions.length : 0,
			relationshipCount: model.relationships.length
		}
	};
}
