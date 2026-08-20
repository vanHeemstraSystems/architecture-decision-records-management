import type { ArchitectureElementId, RelationshipId } from './architecture';

export interface ArchitectureRelationship {
	id: RelationshipId;
	source: ArchitectureElementId;
	target: ArchitectureElementId;
	label?: string;
	kind?: string;
	metadata?: Record<string, unknown>;
}
