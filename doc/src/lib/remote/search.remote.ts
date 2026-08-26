import { query } from '$app/server';
import { searchArchitecture } from '$lib/architecture';

export const search = query('unchecked', async (q: string) => searchArchitecture(q));
