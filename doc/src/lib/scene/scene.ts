import type { SceneNode } from './scene-node';
import type { SceneEdge } from './scene-edge';

export interface SceneGraph {
	id: string;
	name: string;
	nodes: SceneNode[];
	edges: SceneEdge[];
	hints?: {
		preferredProjection?: '2d' | '3d';
		layout?: string;
		focusNodeId?: string;
	};
	sourceModelId?: string;
	metadata?: Record<string, unknown>;
}
