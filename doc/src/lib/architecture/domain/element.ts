import type { ArchitectureElementId, ArchitectureElementKind } from './architecture';

export interface ArchitectureElement {
	id: ArchitectureElementId;
	kind: ArchitectureElementKind;
	name: string;
	description?: string;
	parent?: ArchitectureElementId;
	tags?: string[];
	metadata: Record<string, unknown>;
}
