import { describe, it, expect } from 'vitest';
import {
	getArchitecture,
	getArchitectureContext,
	getElement,
	getChildren,
	getDecision,
	getDecisions,
	searchArchitecture
} from '../src/lib/architecture';

describe('Application services', () => {
	it('getArchitecture returns model', async () => {
		const m = await getArchitecture();
		expect(m.elements.length).toBeGreaterThan(0);
		expect(m.decisions.length).toBe(4);
	});

	it('getArchitectureContext', async () => {
		const ctx = await getArchitectureContext('softwareSystem');
		expect(ctx?.children.length).toBeGreaterThan(0);
	});

	it('getElement / getChildren', async () => {
		expect((await getElement('softwareSystem.webUI'))?.name).toBe('Web UI');
		expect((await getChildren('softwareSystem')).length).toBeGreaterThan(0);
	});

	it('getDecision / getDecisions', async () => {
		expect((await getDecision('ADR-0001'))?.status).toBe('accepted');
		expect((await getDecisions()).length).toBe(4);
	});

	it('searchArchitecture', async () => {
		const r = await searchArchitecture('babylon');
		expect(r.total).toBeGreaterThan(0);
	});
});
