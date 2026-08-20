import type { ArchitectureModel } from '../domain/architecture';
import { createEmptyArchitectureModel } from '../domain/architecture';
import { loadFromLikeC4 } from '../infrastructure/likec4/adapter';
import { withSpan, SpanNames } from '$lib/observability';

export async function getArchitecture(): Promise<ArchitectureModel> {
	return withSpan(SpanNames.MODEL_LOAD, { 'architecture.operation': 'getArchitecture' }, async (span) => {
		try {
			const model = await loadFromLikeC4();
			if (model) {
				span.setAttribute('architecture.model.id', model.id);
				span.setAttribute('architecture.elements', model.elements.length);
				span.setAttribute('architecture.decisions', model.decisions.length);
				span.setAttribute('architecture.source', model.source ?? 'unknown');
				return model;
			}
		} catch {
			span.setAttribute('architecture.adapter.error', true);
		}
		span.setAttribute('architecture.model.empty', true);
		return createEmptyArchitectureModel();
	});
}
