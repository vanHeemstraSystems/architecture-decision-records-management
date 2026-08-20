import type { ArchitectureRelationship } from '../domain/relationship';
import type { ArchitectureElementId } from '../domain/architecture';
import { getArchitecture } from './get-architecture';
import { withSpan, SpanNames } from '$lib/observability';

export async function getRelationships(
	elementId?: ArchitectureElementId
): Promise<ArchitectureRelationship[]> {
	return withSpan(
		SpanNames.RELATIONSHIPS_RESOLVE,
		{ 'architecture.element.id': elementId ?? 'all' },
		async (span) => {
			const model = await getArchitecture();
			const list = elementId
				? model.relationships.filter((r) => r.source === elementId || r.target === elementId)
				: model.relationships;
			span.setAttribute('architecture.relationships.count', list.length);
			return list;
		}
	);
}

export async function getDependencies(elementId: ArchitectureElementId) {
	const model = await getArchitecture();
	return model.relationships.filter((r) => r.source === elementId);
}

export async function getDependants(elementId: ArchitectureElementId) {
	const model = await getArchitecture();
	return model.relationships.filter((r) => r.target === elementId);
}
