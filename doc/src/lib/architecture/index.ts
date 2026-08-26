/**
 * Public barrel for the architecture layer.
 * Re-exports the domain model and application services consumed by
 * routes, remote functions, scene builders, and tests.
 * Infrastructure adapters are intentionally excluded from this surface.
 */

export type {
	ArchitectureElementId,
	DecisionId,
	ViewId,
	RelationshipId,
	ArchitectureElementKind,
	DecisionStatus,
	ArchitectureModel
} from './domain/architecture';
export { createEmptyArchitectureModel } from './domain/architecture';

export type { ArchitectureElement } from './domain/element';
export type { ArchitectureRelationship } from './domain/relationship';
export type { ArchitectureDecision } from './domain/decision';
export type { ArchitectureView } from './domain/view';

export { getArchitecture } from './application/get-architecture';
export {
	getArchitectureContext,
	getContext,
	type ArchitectureContext
} from './application/get-context';
export {
	getElement,
	getElements,
	getChildren,
	getParents
} from './application/get-element';
export {
	getRelationships,
	getDependencies,
	getDependants
} from './application/get-relationships';
export { getView, getViews } from './application/get-view';
export {
	getDecision,
	getDecisions,
	getAllDecisions,
	getDecisionsForElement
} from './application/get-decision';
export { searchArchitecture, type SearchResult } from './application/search';
