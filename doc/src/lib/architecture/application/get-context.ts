import type { ArchitectureModel, ArchitectureElementId } from '../domain/architecture';
import type { ArchitectureElement } from '../domain/element';
import type { ArchitectureRelationship } from '../domain/relationship';
import type { ArchitectureDecision } from '../domain/decision';
import { getArchitecture } from './get-architecture';
import { withSpan, SpanNames } from '$lib/observability';

export interface ArchitectureContext {
	element: ArchitectureElement;
	parent: ArchitectureElement | null;
	children: ArchitectureElement[];
	relationships: ArchitectureRelationship[];
	decisions: ArchitectureDecision[];
	model: ArchitectureModel;
}

export async function getArchitectureContext(
	elementId: ArchitectureElementId
): Promise<ArchitectureContext | null> {
	return withSpan(SpanNames.CONTEXT_RESOLVE, { 'architecture.element.id': elementId }, async (span) => {
		const model = await getArchitecture();
		const element = model.elements.find((e) => e.id === elementId);
		if (!element) {
			span.setAttribute('architecture.context.found', false);
			return null;
		}
		const parent = element.parent
			? model.elements.find((e) => e.id === element.parent) ?? null
			: null;
		const children = model.elements.filter((e) => e.parent === elementId);
		const relationships = model.relationships.filter(
			(r) => r.source === elementId || r.target === elementId
		);
		const decisions = model.decisions.filter((d) => d.relatedElements.includes(elementId));
		span.setAttribute('architecture.context.found', true);
		span.setAttribute('architecture.context.children', children.length);
		span.setAttribute('architecture.context.relationships', relationships.length);
		span.setAttribute('architecture.context.decisions', decisions.length);
		return { element, parent, children, relationships, decisions, model };
	});
}

export const getContext = getArchitectureContext;
