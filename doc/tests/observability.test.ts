import { describe, it, expect, beforeEach } from 'vitest';
import { getArchitecture, getArchitectureContext, getDecision, searchArchitecture } from '../src/lib/architecture';
import { getRecentSpans, clearRecentSpans, SpanNames } from '../src/lib/observability';

describe('Observability', () => {
	beforeEach(() => clearRecentSpans());

	it('records model.load', async () => {
		await getArchitecture();
		expect(getRecentSpans().some((s) => s.name === SpanNames.MODEL_LOAD)).toBe(true);
	});

	it('records context.resolve', async () => {
		await getArchitectureContext('softwareSystem');
		expect(getRecentSpans().some((s) => s.name === SpanNames.CONTEXT_RESOLVE)).toBe(true);
	});

	it('records decision.open', async () => {
		await getDecision('ADR-0001');
		expect(getRecentSpans().some((s) => s.name === SpanNames.DECISION_OPEN)).toBe(true);
	});

	it('records search', async () => {
		await searchArchitecture('x');
		expect(getRecentSpans().some((s) => s.name === SpanNames.SEARCH)).toBe(true);
	});
});
