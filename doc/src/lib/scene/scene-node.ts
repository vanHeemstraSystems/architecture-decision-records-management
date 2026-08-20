export interface SceneNode {
	id: string;
	kind: string;
	label: string;
	description?: string;
	position: { x: number; y: number; z: number };
	size?: { width: number; height: number; depth?: number };
	styleToken: string;
	parentId?: string;
	tags?: string[];
	decisionStatus?: string;
	layer?: number;
	metadata?: Record<string, unknown>;
}
