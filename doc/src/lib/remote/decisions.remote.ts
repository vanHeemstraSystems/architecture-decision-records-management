import { query } from '$app/server';
import { getDecisions, getDecision, getDecisionsForElement } from '$lib/architecture';

export const decisions = query(async () => getDecisions());
export const decision = query('unchecked', async (id: string) => getDecision(id));
export const decisionsForElement = query('unchecked', async (elementId: string) =>
	getDecisionsForElement(elementId)
);
