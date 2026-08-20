import { describe, it, expect } from 'vitest';
import { getArchitecture } from '../src/lib/architecture';
import { buildSceneGraph } from '../src/lib/scene';

describe('Scene builder', () => {
	it('builds non-empty graph with decisions', async () => {
		const model = await getArchitecture();
		const scene = buildSceneGraph(model, { includeDecisions: true, spatialGrouping: true });
		expect(scene.nodes.length).toBeGreaterThan(0);
		expect(scene.nodes.some((n) => n.kind === 'decision')).toBe(true);
		expect(scene.edges.length).toBeGreaterThan(0);
	});
});
