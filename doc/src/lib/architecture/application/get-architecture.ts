import type { ArchitectureModel } from '../domain/architecture';
import type { ArchitectureDecision } from '../domain/decision';
import { createEmptyArchitectureModel } from '../domain/architecture';
import { loadFromLikeC4Server } from '../infrastructure/likec4/adapter.server';
import { loadFromAdrServer } from '../infrastructure/adr/adapter.server';
import { withSpan, SpanNames } from '$lib/observability';

function mapDecisionRefsToFqn(
	decisions: ArchitectureDecision[],
	elementIds: Set<string>
): ArchitectureDecision[] {
	const shortToFqn = new Map<string, string>();
	for (const id of elementIds) {
		const short = id.includes('.') ? id.slice(id.lastIndexOf('.') + 1) : id;
		if (!shortToFqn.has(short)) shortToFqn.set(short, id);
	}
	return decisions.map((d) => ({
		...d,
		relatedElements: d.relatedElements.map((ref) =>
			elementIds.has(ref) ? ref : shortToFqn.get(ref) ?? ref
		)
	}));
}

export async function getArchitecture(): Promise<ArchitectureModel> {
	return withSpan(SpanNames.MODEL_LOAD, { 'architecture.operation': 'getArchitecture' }, async (span) => {
		try {
			const model = await loadFromLikeC4Server();
			if (model) {
				const adrDecisions = await withSpan(
					SpanNames.ADR_LOAD,
					{ 'architecture.operation': 'loadFromAdr' },
					async (adrSpan) => {
						const list = await loadFromAdrServer();
						adrSpan.setAttribute('architecture.adr.count', list.length);
						adrSpan.setAttribute('architecture.adr.source', 'filesystem');
						return list;
					}
				);
				const finalModel: ArchitectureModel =
					adrDecisions.length > 0
						? {
								...model,
								decisions: mapDecisionRefsToFqn(
									adrDecisions,
									new Set(model.elements.map((e) => e.id))
								),
								source: model.source ? `${model.source}+adr-fs` : 'adr-fs'
							}
						: model;
				span.setAttribute('architecture.model.id', finalModel.id);
				span.setAttribute('architecture.elements', finalModel.elements.length);
				span.setAttribute('architecture.decisions', finalModel.decisions.length);
				span.setAttribute('architecture.decisions.source', adrDecisions.length > 0 ? 'adr-fs' : 'seed');
				span.setAttribute('architecture.source', finalModel.source ?? 'unknown');
				return finalModel;
			}
		} catch {
			span.setAttribute('architecture.adapter.error', true);
		}
		span.setAttribute('architecture.model.empty', true);
		return createEmptyArchitectureModel();
	});
}
