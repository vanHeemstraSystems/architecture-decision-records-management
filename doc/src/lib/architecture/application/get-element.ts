import type { ArchitectureElement } from '../domain/element';
import type { ArchitectureElementId, ArchitectureElementKind } from '../domain/architecture';
import { getArchitecture } from './get-architecture';
import { withSpan, SpanNames } from '$lib/observability';

export async function getElement(id: ArchitectureElementId): Promise<ArchitectureElement | null> {
	return withSpan(SpanNames.ELEMENT_GET, { 'architecture.element.id': id }, async (span) => {
		const model = await getArchitecture();
		const el = model.elements.find((e) => e.id === id) ?? null;
		span.setAttribute('architecture.element.found', Boolean(el));
		return el;
	});
}

export async function getElements(kind?: ArchitectureElementKind): Promise<ArchitectureElement[]> {
	return withSpan(SpanNames.ELEMENT_GET, { 'architecture.element.kind': kind ?? 'all' }, async (span) => {
		const model = await getArchitecture();
		const list = kind ? model.elements.filter((e) => e.kind === kind) : model.elements;
		span.setAttribute('architecture.elements.count', list.length);
		return list;
	});
}

export async function getChildren(parentId: ArchitectureElementId): Promise<ArchitectureElement[]> {
	return withSpan(SpanNames.CHILDREN_GET, { 'architecture.element.id': parentId }, async (span) => {
		const model = await getArchitecture();
		const list = model.elements.filter((e) => e.parent === parentId);
		span.setAttribute('architecture.children.count', list.length);
		return list;
	});
}

export async function getParents(elementId: ArchitectureElementId): Promise<ArchitectureElement[]> {
	const model = await getArchitecture();
	const chain: ArchitectureElement[] = [];
	let current = model.elements.find((e) => e.id === elementId);
	while (current?.parent) {
		const parent = model.elements.find((e) => e.id === current!.parent);
		if (!parent) break;
		chain.push(parent);
		current = parent;
	}
	return chain;
}
