import type { ArchitectureElement } from '../domain/element';
import type { ArchitectureDecision } from '../domain/decision';
import type { ArchitectureRelationship } from '../domain/relationship';
import { getArchitecture } from './get-architecture';
import { withSpan, SpanNames } from '$lib/observability';

export interface SearchResult {
	elements: ArchitectureElement[];
	decisions: ArchitectureDecision[];
	relationships: ArchitectureRelationship[];
	query: string;
	total: number;
}

export async function searchArchitecture(query: string): Promise<SearchResult> {
	return withSpan(SpanNames.SEARCH, { 'architecture.search.query': query }, async (span) => {
		const model = await getArchitecture();
		const q = query.trim().toLowerCase();
		if (!q) {
			span.setAttribute('architecture.search.total', 0);
			return { elements: [], decisions: [], relationships: [], query, total: 0 };
		}
		const elements = model.elements.filter(
			(e) =>
				e.name.toLowerCase().includes(q) ||
				e.id.toLowerCase().includes(q) ||
				e.kind.toLowerCase().includes(q) ||
				e.tags?.some((t) => t.toLowerCase().includes(q))
		);
		const decisions = model.decisions.filter(
			(d) =>
				d.title.toLowerCase().includes(q) ||
				d.id.toLowerCase().includes(q) ||
				d.markdown?.toLowerCase().includes(q)
		);
		const relationships = model.relationships.filter(
			(r) =>
				r.label?.toLowerCase().includes(q) ||
				r.source.toLowerCase().includes(q) ||
				r.target.toLowerCase().includes(q)
		);
		const total = elements.length + decisions.length + relationships.length;
		span.setAttribute('architecture.search.total', total);
		return { elements, decisions, relationships, query, total };
	});
}
