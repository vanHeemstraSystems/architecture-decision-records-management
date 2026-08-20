export interface SceneEdge {
	id: string;
	source: string;
	target: string;
	label?: string;
	kind?: string;
	styleToken: string;
	metadata?: Record<string, unknown>;
}
