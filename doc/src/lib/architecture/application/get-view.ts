import type { ArchitectureView } from '../domain/view';
import type { ViewId } from '../domain/architecture';
import { getArchitecture } from './get-architecture';
import { withSpan, SpanNames } from '$lib/observability';

export async function getView(id: ViewId): Promise<ArchitectureView | null> {
	return withSpan(SpanNames.VIEW_RESOLVE, { 'architecture.view.id': id }, async (span) => {
		const model = await getArchitecture();
		const view = model.views.find((v) => v.id === id) ?? null;
		span.setAttribute('architecture.view.found', Boolean(view));
		if (view) span.setAttribute('architecture.view.elements', view.elements.length);
		return view;
	});
}

export async function getViews(): Promise<ArchitectureView[]> {
	return withSpan(SpanNames.VIEW_OPEN, {}, async (span) => {
		const model = await getArchitecture();
		span.setAttribute('architecture.views.count', model.views.length);
		return model.views;
	});
}
