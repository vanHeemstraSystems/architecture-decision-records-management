/**
 * Thin remote wrappers around architecture application services (Memo 4 §5, §9).
 *
 * Each export uses `query()` from `$app/server`, so the client bundle receives
 * an HTTP proxy while the server executes the real application service. This
 * keeps LikeC4 parsing, `node:fs` ADR reads, and other server-only dependencies
 * out of the client bundle without any dynamic-import shims.
 */

import { query } from '$app/server';
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

export const model = query(async () => getArchitecture());
export const architectureContext = query('unchecked', async (id: string) =>
	getArchitectureContext(id)
);
export const element = query('unchecked', async (id: string) => getElement(id));
export const elements = query('unchecked', async (kind?: string) =>
	getElements(kind as never)
);
export const children = query('unchecked', async (parentId: string) => getChildren(parentId));
export const parents = query('unchecked', async (id: string) => getParents(id));
export const relationships = query('unchecked', async (elementId?: string) =>
	getRelationships(elementId)
);
export const dependencies = query('unchecked', async (id: string) => getDependencies(id));
export const dependants = query('unchecked', async (id: string) => getDependants(id));
