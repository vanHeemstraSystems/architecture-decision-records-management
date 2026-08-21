/**
 * Thin remote wrappers around architecture application services (Memo 4 Phase 9).
 */

import {
	getArchitecture,
	getArchitectureContext,
	getElement,
	getElements,
	getChildren,
	getParents,
	getRelationships,
	getDependencies,
	getDependants
} from '$lib/architecture';

export const model = getArchitecture;
export const architectureContext = getArchitectureContext;
export const element = getElement;
export const elements = getElements;
export const children = getChildren;
export const parents = getParents;
export const relationships = getRelationships;
export const dependencies = getDependencies;
export const dependants = getDependants;
