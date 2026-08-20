import type { ArchitectureElement } from './element';
import type { ArchitectureRelationship } from './relationship';
import type { ArchitectureDecision } from './decision';
import type { ArchitectureView } from './view';

export type ArchitectureElementId = string;
export type DecisionId = string;
export type ViewId = string;
export type RelationshipId = string;

export type ArchitectureElementKind =
	| 'system' | 'container' | 'component' | 'person' | 'group'
	| 'softwareSystem' | 'deploymentNode' | 'other';

export type DecisionStatus =
	| 'proposed' | 'accepted' | 'deprecated' | 'superseded' | 'rejected';

export interface ArchitectureModel {
	id: string;
	name: string;
	description?: string;
	elements: ArchitectureElement[];
	relationships: ArchitectureRelationship[];
	decisions: ArchitectureDecision[];
	views: ArchitectureView[];
	metadata: Record<string, unknown>;
	source?: string;
	updatedAt?: string;
}

export function createEmptyArchitectureModel(
	id = 'empty',
	name = 'Empty Architecture'
): ArchitectureModel {
	return {
		id,
		name,
		elements: [],
		relationships: [],
		decisions: [],
		views: [],
		metadata: {}
	};
}
