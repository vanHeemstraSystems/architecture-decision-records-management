import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFromLikeC4Server as loadFromLikeC4 } from '../src/lib/architecture/infrastructure/likec4/adapter.server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspacePath = path.resolve(__dirname, '../architecture/model');

describe('loadFromLikeC4 — real DSL parse path', () => {
	it('parses adr-platform.c4 into the canonical ArchitectureModel', async () => {
		const model = await loadFromLikeC4({ workspacePath });

		expect(model).not.toBeNull();
		if (!model) return;

		expect(model.metadata?.mode).toBe('likec4-workspace');
		expect(model.source).toBe('likec4-workspace');

		const ids = new Set(model.elements.map((e) => e.id));
		for (const expected of [
			'softwareSystem',
			'softwareSystem.webUI',
			'softwareSystem.babylonRenderer',
			'softwareSystem.likec4Adapter'
		]) {
			expect(ids.has(expected)).toBe(true);
		}

		expect(model.relationships.length).toBeGreaterThanOrEqual(6);

		const viewIds = new Set(model.views.map((v) => v.id));
		expect(viewIds.has('SystemContext')).toBe(true);
		expect(viewIds.has('Containers')).toBe(true);

		expect(model.decisions).toHaveLength(3);

		const elementIds = new Set(model.elements.map((e) => e.id));
		for (const d of model.decisions) {
			for (const ref of d.relatedElements) {
				expect(elementIds.has(ref)).toBe(true);
			}
		}
	});

	it('returns a non-null model even when workspacePath contains no DSL sources', async () => {
		const model = await loadFromLikeC4({ workspacePath: '/nonexistent/path/xyz' });
		expect(model).not.toBeNull();
		if (!model) return;
		expect(model.metadata?.adapter).toBe('likec4-bridge');
	});
});
