import type { ArchitectureDecision } from '../domain/decision';
import type { DecisionId, ArchitectureElementId } from '../domain/architecture';
import { getArchitecture } from './get-architecture';
import { withSpan, SpanNames } from '$lib/observability';

export async function getDecision(id: DecisionId): Promise<ArchitectureDecision | null> {
	return withSpan(SpanNames.DECISION_OPEN, { 'architecture.decision.id': id }, async (span) => {
		const model = await getArchitecture();
		const decision = model.decisions.find((d) => d.id === id) ?? null;
		if (decision) {
			span.setAttribute('architecture.decision.title', decision.title);
			span.setAttribute('architecture.decision.status', decision.status);
			span.setAttribute('adr.load', true);
			span.setAttribute('adr.references.count', decision.relatedElements.length);
		} else {
			span.setAttribute('architecture.decision.found', false);
		}
		return decision;
	});
}

export async function getDecisions(): Promise<ArchitectureDecision[]> {
	return withSpan(SpanNames.DECISIONS_RESOLVE, {}, async (span) => {
		const model = await getArchitecture();
		span.setAttribute('architecture.decisions.count', model.decisions.length);
		return model.decisions;
	});
}

export const getAllDecisions = getDecisions;

export async function getDecisionsForElement(
	elementId: ArchitectureElementId
): Promise<ArchitectureDecision[]> {
	return withSpan(SpanNames.DECISIONS_RESOLVE, { 'architecture.element.id': elementId }, async (span) => {
		const model = await getArchitecture();
		const list = model.decisions.filter((d) => d.relatedElements.includes(elementId));
		span.setAttribute('architecture.decisions.count', list.length);
		return list;
	});
}
