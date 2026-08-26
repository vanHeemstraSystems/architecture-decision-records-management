import type { PageServerLoad } from './$types';
import { getArchitecture } from '$lib/architecture';

export const load: PageServerLoad = async () => {
	const model = await getArchitecture();
	return { model };
};
