import { query } from '$app/server';
import { getView, getViews } from '$lib/architecture';

export const view = query('unchecked', async (id: string) => getView(id));
export const views = query(async () => getViews());
